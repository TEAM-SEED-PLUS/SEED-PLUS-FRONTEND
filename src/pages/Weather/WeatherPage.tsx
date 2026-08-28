import { useMemo, useRef, useState } from 'react';
import {
  mockDistrictGrades,
  mockWeatherContents,
  mockWeatherFeed,
  mockWeatherFeedLateNight,
  mockWeatherFeedNoData,
  mockWeatherFeedPartial,
} from '@/api/weatherFeedMock';
import type { TimeBand, WeatherFeed } from '@/api/weatherFeedTypes';
import { HeaderUser } from '@/components/layout';
import {
  SeoulDistrictMap,
  WeatherLegend,
  WeatherContentList,
  WeatherNarrativeCard,
  WeatherPlaceholderCard,
  WeatherSummaryCard,
} from '@/components/weather';
import { useDocumentTitle } from '@/hooks';

/** 기획 확정 시간대 (심야는 06시 이전 진입 시 자동 표기) */
const TIME_BANDS: { band: TimeBand; label: string }[] = [
  { band: '아침', label: '아침 06:00~12:00' },
  { band: '점심', label: '점심 12:00~17:00' },
  { band: '오후', label: '오후 17:00~20:00' },
  { band: '저녁', label: '저녁 20:00~24:00' },
];

/**
 * Mock 응답 선택기.
 * 실제 API 연동 시 이 함수를 fetch 호출로 교체하면 화면 코드는 그대로 동작한다.
 */
const selectMockFeed = (district: string, band: TimeBand): WeatherFeed => {
  const base =
    band === '심야'
      ? mockWeatherFeedLateNight
      : district === '금천구'
        ? mockWeatherFeedNoData
        : district === '중랑구'
          ? mockWeatherFeedPartial
          : mockWeatherFeed;

  const grade = mockDistrictGrades[district] ?? base.market_weather;

  return {
    ...base,
    query: { ...base.query, district, time_band: band },
    opportunity_score: grade.score,
    market_weather: grade,
  };
};

const WeatherPage = () => {
  useDocumentTitle('상권날씨');
  const [district, setDistrict] = useState('종로구');
  const [timeBand, setTimeBand] = useState<TimeBand>('점심');
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 실제 API 연동 시 이 부분이 fetch 호출로 바뀌면서 로딩 상태를 그대로 사용한다.
  // Mock 단계에서는 선택이 바뀔 때 짧은 로딩 UI만 노출한다.
  const runWithLoading = (apply: () => void) => {
    apply();
    setIsLoading(true);
    if (loadingTimer.current) clearTimeout(loadingTimer.current);
    loadingTimer.current = setTimeout(() => setIsLoading(false), 300);
  };

  const feed = useMemo(
    () => selectMockFeed(district, timeBand),
    [district, timeBand]
  );

  const isNoData = feed.data_quality.status === 'no_data';

  return (
    <div className="min-h-screen bg-gray-500">
      <HeaderUser />

      <main className="mx-auto w-full max-w-[1400px] px-5 pb-12 pt-[calc(var(--header-height)+24px)] lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-[#191f28]">
                상권날씨
              </h1>
              <span className="rounded-full border border-[#e5484d] px-2 py-0.5 text-[11px] font-bold text-[#e5484d]">
                실시간
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-46">
              서울 25개 자치구 실시간 상권 분석
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-[#4e5968]">
            시간대
            <select
              value={timeBand}
              onChange={(event) =>
                runWithLoading(() =>
                  setTimeBand(event.target.value as TimeBand)
                )
              }
              className="h-10 rounded-md border border-[#e5e8eb] bg-white px-3 text-xs text-[#191f28] outline-none focus:border-blue-600"
            >
              {TIME_BANDS.map(({ band, label }) => (
                <option key={band} value={band}>
                  {label}
                </option>
              ))}
              <option value="심야">심야 00:00~06:00</option>
            </select>
          </label>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
          {/* 좌: 지도 + 범례 */}
          <section className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="text-base font-extrabold text-[#191f28]">
              서울 상권 날씨, 지금 이 동네 어때요?
            </h2>
            <p className="mt-1 text-xs text-gray-46">
              자치구를 선택하면 해당 지역 분석을 확인할 수 있습니다.
            </p>

            <div className="mt-4 rounded-md bg-[#f7f8fa] p-3">
              <SeoulDistrictMap
                grades={mockDistrictGrades}
                selected={district}
                onSelect={(next) => runWithLoading(() => setDistrict(next))}
              />
            </div>
            <div className="mt-3 flex justify-center overflow-x-auto">
              <WeatherLegend />
            </div>
          </section>

          {/* 우: 선택 자치구 상세 */}
          <div className="flex flex-col gap-5">
            {isLoading ? (
              <section className="rounded-lg bg-white px-5 py-14 text-center text-sm font-medium text-gray-46 shadow-sm">
                상권날씨를 불러오고 있습니다.
              </section>
            ) : isNoData ? (
              <section className="rounded-lg border border-[#e5484d] bg-white px-5 py-14 text-center shadow-sm">
                <p className="text-sm font-bold text-[#e5484d]">
                  데이터를 불러오지 못했습니다.
                </p>
                <p className="mt-2 text-xs text-gray-46">
                  잠시 후 다시 시도하거나 다른 자치구를 선택해주세요.
                </p>
              </section>
            ) : (
              <>
                {feed.data_quality.badges.length > 0 && (
                  <div className="space-y-2">
                    {feed.data_quality.badges.map((badge) => (
                      <p
                        key={badge}
                        className="rounded-md border border-[#f5c518] bg-[#fff8e1] px-3 py-2 text-xs font-bold text-[#8a6d00]"
                      >
                        {badge}
                      </p>
                    ))}
                  </div>
                )}

                <WeatherSummaryCard feed={feed} />

                <WeatherPlaceholderCard
                  title="4대 지표"
                  description="유입 압력 · 소비 의도 · 경쟁 압박 · 운영 리스크 점수가 표시됩니다."
                />
                <WeatherPlaceholderCard
                  title="의사결정 태그"
                  description="진입 유리 · 관망 권장 · 기회 구간 등 판정 결과가 표시됩니다."
                />

                <WeatherNarrativeCard narrative={feed.narrative} />
                <WeatherContentList items={mockWeatherContents} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeatherPage;
