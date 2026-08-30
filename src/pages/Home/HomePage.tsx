import { useMemo, useState } from 'react';
import { mockTimeSlots } from '@/api/homeMock';
import { mockDistrictGrades, mockWeatherFeed } from '@/api/weatherFeedMock';
import type { TimeBand } from '@/api/weatherFeedTypes';
import { useAuth } from '@/auth';
import {
  LiveChatCard,
  SignalBanner,
  TimeSlotGrid,
  TrendingNewsCard,
  WeeklyBriefingCard,
} from '@/components/home';
import { HeaderUser } from '@/components/layout';
import {
  SeoulDistrictMap,
  WeatherLegend,
  WeatherNarrativeCard,
} from '@/components/weather';
import { useDocumentTitle } from '@/hooks';
import { LightbulbIcon, StarIcon } from '@/components/ui/icons';
import { GRADE_ICON } from '@/components/weather/weatherGradeStyle';

const TIME_BANDS: { band: TimeBand; label: string }[] = [
  { band: '아침', label: '아침 06:00~12:00' },
  { band: '점심', label: '점심 12:00~17:00' },
  { band: '오후', label: '오후 17:00~20:00' },
  { band: '저녁', label: '저녁 20:00~24:00' },
];

const HomePage = () => {
  useDocumentTitle();
  const { isAuthenticated } = useAuth();
  const [district, setDistrict] = useState('종로구');
  const [timeBand, setTimeBand] = useState<TimeBand>('점심');

  const weather = useMemo(
    () => mockDistrictGrades[district] ?? mockWeatherFeed.market_weather,
    [district]
  );

  return (
    <div className="min-h-screen bg-gray-500">
      <HeaderUser activeNav="home" />

      <div className="pt-[var(--header-height)]">
        <SignalBanner />
      </div>

      <main className="mx-auto w-full max-w-[1800px] px-5 pb-10 pt-5 lg:px-8">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,550px)_minmax(0,1fr)_minmax(0,413px)]">
          {/* 좌: 상권날씨 지도 */}
          <section className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pr-1">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-[#191f28]">
                    상권날씨
                  </h2>
                  <span className="rounded-full border border-[#e5484d] px-2 py-0.5 text-[10px] font-bold text-[#e5484d]">
                    실시간
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-gray-46">
                  서울 25개 자치구 실시간 상권 분석
                </p>
              </div>
              <select
                value={timeBand}
                onChange={(event) =>
                  setTimeBand(event.target.value as TimeBand)
                }
                aria-label="시간대 선택"
                className="h-9 rounded-md border border-[#e5e8eb] bg-white px-2 text-xs text-[#191f28] outline-none focus:border-blue-600"
              >
                {TIME_BANDS.map(({ band }) => (
                  <option key={band} value={band}>
                    {band}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 rounded-md border border-[#e5e8eb] p-4">
              <p className="text-sm font-extrabold text-[#191f28]">
                서울 상권 날씨,
                <br />
                지금 이 동네 어때요?
              </p>

              <div className="mt-3 rounded-md bg-[#f7f8fa] p-2">
                <SeoulDistrictMap
                  grades={mockDistrictGrades}
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
          <div className="flex flex-col gap-5">
            <section className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-extrabold text-[#191f28]">
                  {district} 상권날씨{' '}
                  <img
                    src={GRADE_ICON[weather.grade]}
                    alt=""
                    aria-hidden
                    className="inline-block h-5 w-5 align-text-bottom"
                  />{' '}
                  <span className="text-blue-600">{weather.grade}</span>
                </h2>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md border border-[#e5e8eb] px-3 py-1.5 text-xs font-bold text-[#4e5968] transition hover:bg-gray-500"
                >
                  <StarIcon className="h-3.5 w-3.5" />
                  즐겨찾기
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-46">
                {mockWeatherFeed.narrative.judgement_sentence}
              </p>

              <div className="mt-4">
                <TimeSlotGrid slots={mockTimeSlots} />
              </div>

              <div className="mt-4 rounded-md bg-[#e8f1ff] px-4 py-3 text-xs text-[#191f28]">
                <LightbulbIcon className="mr-1 inline-block h-4 w-4 align-text-bottom text-blue-600" />
                <strong className="font-extrabold text-blue-600">
                  추천 액션:
                </strong>{' '}
                {mockWeatherFeed.narrative.recommended_actions[0]}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <WeeklyBriefingCard />
              <LiveChatCard isAuthenticated={isAuthenticated} />
            </div>

            <WeatherNarrativeCard narrative={mockWeatherFeed.narrative} />
          </div>

          {/* 우: 지금 뜨는 소식 */}
          <TrendingNewsCard />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
