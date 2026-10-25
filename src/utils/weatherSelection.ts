import type { TimeBand } from '@/api/weatherFeedTypes';
import { getCurrentTimeBand, TIME_BAND_RANGES } from './timeBand';

// 상권날씨에서 고른 자치구·시간대를 탭(세션) 단위로 기억해, 다른 화면에 다녀와도 보던 화면을 이어 보여준다.
// 시간대는 '고를 당시의 현재 시간대'가 지금과 같을 때만 복원한다 — 시간이 흘러 현재 시간대가 바뀌었으면
// 새 현재 시간대로 시작하는 게 맞다.
const STORAGE_KEY = 'seedplus:weather-selection';
export const DEFAULT_WEATHER_DISTRICT = '종로구';

type StoredSelection = {
  district: string;
  timeBand: TimeBand;
  /** 저장 당시의 현재 시간대 */
  currentBand: TimeBand;
};

const isTimeBand = (value: unknown): value is TimeBand =>
  TIME_BAND_RANGES.some((range) => range.band === value);

export const readWeatherSelection = (): {
  district: string;
  timeBand: TimeBand;
} => {
  const currentBand = getCurrentTimeBand();
  const fallback = {
    district: DEFAULT_WEATHER_DISTRICT,
    timeBand: currentBand,
  };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const stored = JSON.parse(raw) as Partial<StoredSelection>;
    const district =
      typeof stored.district === 'string' && stored.district
        ? stored.district
        : fallback.district;
    const timeBand =
      isTimeBand(stored.timeBand) && stored.currentBand === currentBand
        ? stored.timeBand
        : currentBand;
    return { district, timeBand };
  } catch {
    return fallback;
  }
};

export const writeWeatherSelection = (district: string, timeBand: TimeBand) => {
  try {
    const value: StoredSelection = {
      district,
      timeBand,
      currentBand: getCurrentTimeBand(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)이면 기억하지 않는다.
  }
};
