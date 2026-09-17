import { useEffect, useMemo, useState } from 'react';
import {
  getWeatherApiErrorMessage,
  getWeatherFeed,
  getWeatherOverview,
  toWeatherContentItems,
} from '@/api/weatherFeedApi';
import type {
  TimeBand,
  WeatherFeed,
  WeatherOverviewDistrict,
} from '@/api/weatherFeedTypes';
import { AppFooter, HeaderUser } from '@/components/layout';
import { LightbulbIcon, StarIcon } from '@/components/ui/icons';
import {
  SeoulDistrictMap,
  TimeBandCards,
  WeatherLegend,
  WeatherNarrativeModal,
  WeatherRadarChart,
  WeatherSectionLoading,
  WeatherTrendingContent,
} from '@/components/weather';
import { SEOUL_DISTRICT_PATHS } from '@/components/weather/seoulMapPaths';
import {
  GRADE_ICON,
  resolveGrade,
} from '@/components/weather/weatherGradeStyle';
import { useDocumentTitle } from '@/hooks';
import {
  formatTimeBandRange,
  getCurrentTimeBand,
  TIME_BAND_RANGES,
} from '@/utils/timeBand';

const DISTRICTS = SEOUL_DISTRICT_PATHS.map((path) => path.name).sort(
  (left, right) => left.localeCompare(right, 'ko')
);

const formatGeneratedAt = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone: 'Asia/Seoul',
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value])
  );
  return `${parts.year}.${parts.month}.${parts.day} ${parts.hour}:${parts.minute}`;
};

/** 높을수록 주의가 필요한 값은 붉게, 중간은 주황, 낮으면 회색으로 표시한다 */
const metricTone = (value: number | null) => {
  if (value === null) return 'text-[#8b95a1]';
  if (value >= 70) return 'text-[#e5484d]';
  if (value >= 40) return 'text-[#f5a623]';
  return 'text-[#4e5968]';
};

const selectClass =
  'app-select h-9 rounded-md border border-[#e5e8eb] bg-white pl-3 text-xs text-[#191f28] outline-none focus:border-blue-600';

/** 아직 데이터가 없는 영역 — 값을 지어내지 않고 섹션별 안내만 둔다 */
const EmptySectionCard = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => (
  <section className="rounded-lg bg-white p-5 shadow-sm">
    <h3 className="text-sm font-extrabold text-[#191f28]">{title}</h3>
    <p className="mt-4 rounded-md bg-[#f7f8fa] px-4 py-10 text-center text-xs leading-relaxed text-gray-46">
      {message}
    </p>
  </section>
);

const WeatherPage = () => {
  useDocumentTitle('상권날씨');
  const [district, setDistrict] = useState('종로구');
  // 서버는 현재 시간대의 overview 스냅샷만 생성하므로 한국 시간 기준 현재 시간대로 시작한다.
  const [timeBand, setTimeBand] = useState<TimeBand>(() =>
    getCurrentTimeBand()
  );
  const [overviewByBand, setOverviewByBand] = useState<
    Partial<Record<TimeBand, WeatherOverviewDistrict[]>>
  >({});
  const [isNarrativeOpen, setIsNarrativeOpen] = useState(false);

  // 재시도 시 같은 조건이어도 새 요청으로 인식되도록 키에 포함한다.
  const [retryCount, setRetryCount] = useState(0);
  const requestKey = `${district}|${timeBand}|${retryCount}`;
  // 조회 결과를 '어떤 조건으로 받은 것인지'와 함께 들고 있으면
  // 로딩 여부를 파생시킬 수 있어 effect 안에서 setState를 하지 않아도 된다.
  const [result, setResult] = useState<{
    key: string;
    feed: WeatherFeed | null;
    error: string;
  } | null>(null);

  // 시간대별 overview는 미리 만들어진 스냅샷을 읽기만 해 가볍다.
  // 지도와 시간대 카드가 함께 쓰도록 전 시간대를 한 번에 받아둔다.
  useEffect(() => {
    const abortController = new AbortController();

    Promise.allSettled(
      TIME_BAND_RANGES.map(({ band }) =>
        getWeatherOverview({ timeBand: band }, abortController.signal).then(
          (overview) => [band, overview.districts] as const
        )
      )
    ).then((settled) => {
      if (abortController.signal.aborted) return;
      setOverviewByBand(
        Object.fromEntries(
          settled.map((item, index) => [
            TIME_BAND_RANGES[index].band,
            item.status === 'fulfilled' ? item.value[1] : [],
          ])
        )
      );
    });

    return () => abortController.abort();
  }, [retryCount]);

  useEffect(() => {
    const abortController = new AbortController();

    getWeatherFeed({ district, timeBand }, abortController.signal)
      .then((response) =>
        setResult({ key: requestKey, feed: response, error: '' })
      )
      .catch((error) => {
        // 조건 변경·이탈로 인한 취소는 이미 다음 요청이 진행 중이므로 무시한다.
        const message = getWeatherApiErrorMessage(error);
        if (!message) return;
        setResult({ key: requestKey, feed: null, error: message });
      });

    return () => abortController.abort();
  }, [district, timeBand, requestKey]);

  const isLoading = result?.key !== requestKey;
  const feed = isLoading ? null : (result?.feed ?? null);
  const errorMessage = isLoading ? '' : (result?.error ?? '');
  const isNoData = !feed || feed.data_quality.status === 'no_data';

  const mapGrades = useMemo(
    () =>
      Object.fromEntries(
        (overviewByBand[timeBand] ?? []).map((item) => [item.district, item])
      ),
    [overviewByBand, timeBand]
  );

  // 시안 기준 6개(2열 3행)만 노출한다.
  const contentItems = useMemo(
    () => toWeatherContentItems(feed?.content?.items).slice(0, 6),
    [feed]
  );

  const grade = resolveGrade(feed?.market_weather.grade);
  const indicators = feed?.indicators;
  const metrics = indicators
    ? [
        { label: '운영 리스크', value: indicators.operational_risk },
        { label: '소비 의도', value: indicators.spending_intent },
        { label: '유입 압력', value: indicators.inflow_pressure },
        { label: '경쟁 압력', value: indicators.competition_pressure },
      ]
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-gray-500">
      {isNarrativeOpen && feed && (
        <WeatherNarrativeModal
          district={district}
          narrative={feed.narrative}
          onClose={() => setIsNarrativeOpen(false)}
        />
      )}
      <HeaderUser activeNav="weather" />

      <main className="mx-auto w-full max-w-[1800px] flex-1 px-5 pb-10 pt-[calc(var(--header-height)+20px)] lg:px-8">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,500px)_minmax(0,1fr)_minmax(0,380px)]">
          {/* 좌: 상권날씨 지도 */}
          <section className="self-start rounded-lg bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold text-[#191f28]">
                    상권날씨
                  </h1>
                  <span className="rounded-full border border-[#e5484d] px-2 py-0.5 text-[10px] font-bold text-[#e5484d]">
                    • 실시간
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-gray-46">
                  서울 25개 자치구 실시간 상권 분석
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                  aria-label="지역 선택"
                  className={selectClass}
                >
                  {DISTRICTS.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <select
                  value={timeBand}
                  onChange={(event) =>
                    setTimeBand(event.target.value as TimeBand)
                  }
                  aria-label="시간대 선택"
                  className={selectClass}
                >
                  {TIME_BAND_RANGES.map(({ band }) => (
                    <option key={band} value={band}>
                      {band}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 rounded-md border border-[#e5e8eb] p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-base font-extrabold leading-snug text-[#191f28]">
                  서울 상권 날씨,
                  <br />
                  지금 이 동네 어때요?
                </p>
                <span className="rounded-md border border-[#e5e8eb] px-2.5 py-1.5 text-xs font-bold text-[#4e5968]">
                  {timeBand} {formatTimeBandRange(timeBand)}
                </span>
              </div>

              <div className="mt-3 rounded-md bg-[#f7f8fa] p-2">
                <SeoulDistrictMap
                  grades={mapGrades}
                  selected={district}
                  onSelect={setDistrict}
                />
              </div>
              <div className="mt-3 flex justify-center overflow-x-auto">
                <WeatherLegend />
              </div>
            </div>
          </section>

          {/* 중앙: 선택 자치구 상세 + 브리핑/채팅 */}
          <div className="flex min-w-0 flex-col gap-5">
            {isLoading ? (
              <WeatherSectionLoading key={requestKey} district={district} />
            ) : isNoData || !feed ? (
              <section className="rounded-lg border border-[#e5484d] bg-white px-5 py-14 text-center shadow-sm">
                <p className="text-sm font-bold text-[#e5484d]">
                  {errorMessage || '아직 분석할 데이터가 충분하지 않습니다.'}
                </p>
                <p className="mt-2 text-xs text-gray-46">
                  잠시 후 다시 시도하거나 다른 자치구를 선택해주세요.
                </p>
                <button
                  type="button"
                  onClick={() => setRetryCount((current) => current + 1)}
                  className="mt-4 h-10 rounded-md bg-blue-600 px-4 text-xs font-bold text-white transition hover:bg-blue-700"
                >
                  다시 시도
                </button>
              </section>
            ) : (
              <section className="rounded-lg bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-extrabold text-[#191f28]">
                      {district} 상권날씨{' '}
                      {grade && (
                        <img
                          src={GRADE_ICON[grade]}
                          alt=""
                          aria-hidden
                          className="inline-block h-5 w-5 align-text-bottom"
                        />
                      )}{' '}
                      <span className="text-blue-600">
                        {feed.market_weather.grade ?? '미산출'}
                      </span>
                    </h2>
                    {feed.decision_tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-[#e8f1ff] px-2 py-1 text-[11px] font-bold text-blue-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsNarrativeOpen(true)}
                      className="h-9 rounded-md bg-blue-600 px-4 text-xs font-bold text-white transition hover:bg-blue-700"
                    >
                      AI 분석하기
                    </button>
                    <button
                      type="button"
                      disabled
                      title="즐겨찾기는 준비 중입니다."
                      className="flex h-9 items-center gap-1 rounded-md border border-[#e5e8eb] px-3 text-xs font-bold text-[#8b95a1] disabled:cursor-not-allowed"
                    >
                      <StarIcon className="h-3.5 w-3.5" />
                      즐겨찾기
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-xs text-gray-46">
                  {feed.narrative.judgement_sentence}{' '}
                  {formatGeneratedAt(feed.generated_at) &&
                    `(${formatGeneratedAt(feed.generated_at)} 기준)`}
                </p>
                {feed.data_quality.badges.length > 0 && (
                  <p className="mt-2 text-[11px] font-bold text-[#8a6d00]">
                    ※ {feed.data_quality.badges.join(' · ')}
                  </p>
                )}

                <div className="mt-4">
                  <TimeBandCards
                    district={district}
                    selected={timeBand}
                    overviewByBand={overviewByBand}
                    onSelect={setTimeBand}
                  />
                </div>

                <div className="mt-4 flex flex-col items-center gap-4 rounded-md bg-[#eef4ff] p-4 md:flex-row md:justify-center">
                  <WeatherRadarChart
                    axes={[
                      ...metrics,
                      { label: '기회 점수', value: feed.opportunity_score },
                    ]}
                  />
                  <div className="grid w-full max-w-[380px] grid-cols-2 gap-2">
                    {metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-md bg-white px-3 py-2.5 text-xs font-bold shadow-sm"
                      >
                        <span className={metricTone(metric.value)}>
                          {metric.label} : {metric.value ?? '?'}점
                        </span>
                      </div>
                    ))}
                    <div className="col-span-2 rounded-md bg-white px-3 py-2.5 text-center text-xs font-bold text-blue-600 shadow-sm">
                      기회 점수 : {feed.opportunity_score ?? '?'}점
                    </div>
                  </div>
                </div>

                {feed.narrative.recommended_actions[0] && (
                  <div className="mt-4 rounded-md border border-[#c9d6ec] bg-[#f5f9ff] px-4 py-3 text-xs text-[#191f28]">
                    <LightbulbIcon className="mr-1 inline-block h-4 w-4 align-text-bottom text-blue-600" />
                    <strong className="font-extrabold text-blue-600">
                      추천 액션:
                    </strong>{' '}
                    {feed.narrative.recommended_actions[0]}
                  </div>
                )}
              </section>
            )}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <EmptySectionCard
                title="주간 브리핑"
                message="주간 상권 브리핑은 데이터 준비 중입니다."
              />
              <EmptySectionCard
                title="SEED+ 실시간 채팅"
                message="실시간 채팅은 준비 중입니다."
              />
            </div>
          </div>

          {/* 우: 지금 뜨는 소식 */}
          <WeatherTrendingContent
            district={district}
            items={contentItems}
            isLoading={isLoading}
          />
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default WeatherPage;
