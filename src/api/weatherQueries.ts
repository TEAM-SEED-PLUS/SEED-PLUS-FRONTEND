import { queryOptions } from '@tanstack/react-query';
import { TIME_BAND_RANGES } from '@/utils/timeBand';
import { getWeatherFeed, getWeatherOverview } from './weatherFeedApi';
import type { TimeBand, WeatherOverviewDistrict } from './weatherFeedTypes';

// AI 서버가 overview 스냅샷을 5분마다 새로 만든다(WEATHER_OVERVIEW_INTERVAL_MINUTES 기본값).
// 상세 피드도 같은 주기로 다시 확인하면 충분하다 — 그 안에서는 받아둔 값을 그대로 쓴다.
const WEATHER_STALE_TIME_MS = 5 * 60 * 1000;

/** 같은 시간대라도 날짜가 바뀌면 다른 데이터라 키에 한국 날짜를 넣는다 */
const seoulDate = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(
    new Date()
  );

export const weatherQueryKeys = {
  all: ['weather'] as const,
  overview: (date: string) => ['weather', 'overview', date] as const,
  feed: (district: string, timeBand: TimeBand, date: string) =>
    ['weather', 'feed', district, timeBand, date] as const,
};

/** 지도·시간대 카드용 — 전 시간대 overview를 한 번에 받는다 (스냅샷이라 가볍다) */
export const weatherOverviewQuery = () =>
  queryOptions({
    queryKey: weatherQueryKeys.overview(seoulDate()),
    queryFn: async ({ signal }) => {
      const settled = await Promise.allSettled(
        TIME_BAND_RANGES.map(({ band }) =>
          getWeatherOverview({ timeBand: band }, signal)
        )
      );
      // 한 시간대가 실패해도 나머지는 보여준다(실패한 시간대는 빈 목록).
      return Object.fromEntries(
        settled.map((item, index) => [
          TIME_BAND_RANGES[index].band,
          item.status === 'fulfilled' ? item.value.districts : [],
        ])
      ) as Partial<Record<TimeBand, WeatherOverviewDistrict[]>>;
    },
    staleTime: WEATHER_STALE_TIME_MS,
  });

/** 선택 자치구 상세 — 캐시가 없으면 AI 분석에 수십 초가 걸릴 수 있다 */
export const weatherFeedQuery = (district: string, timeBand: TimeBand) =>
  queryOptions({
    queryKey: weatherQueryKeys.feed(district, timeBand, seoulDate()),
    queryFn: ({ signal }) => getWeatherFeed({ district, timeBand }, signal),
    staleTime: WEATHER_STALE_TIME_MS,
    // 실패(대부분 AI 지연·타임아웃)를 자동으로 다시 부르면 대기 시간만 두 배가 된다.
    // 재시도는 화면의 [다시 시도]로만 한다.
    retry: false,
  });
