import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_WEATHER_DISTRICT,
  readWeatherSelection,
  writeWeatherSelection,
} from './weatherSelection';

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  vi.stubGlobal('sessionStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

// 한국 시간 13시(점심) / 21시(저녁)
const LUNCH = new Date('2026-10-25T04:00:00Z');
const EVENING = new Date('2026-10-25T12:00:00Z');

describe('weatherSelection', () => {
  it('저장된 값이 없으면 종로구 + 현재 시간대로 시작한다', () => {
    vi.useFakeTimers({ now: LUNCH });
    expect(readWeatherSelection()).toEqual({
      district: DEFAULT_WEATHER_DISTRICT,
      timeBand: '점심',
    });
  });

  it('같은 현재 시간대 안에서는 고른 자치구와 시간대를 복원한다', () => {
    vi.useFakeTimers({ now: LUNCH });
    writeWeatherSelection('마포구', '저녁');
    expect(readWeatherSelection()).toEqual({
      district: '마포구',
      timeBand: '저녁',
    });
  });

  it('현재 시간대가 바뀌었으면 자치구만 복원하고 시간대는 새 현재 시간대로 둔다', () => {
    vi.useFakeTimers({ now: LUNCH });
    writeWeatherSelection('마포구', '아침');
    vi.setSystemTime(EVENING);
    expect(readWeatherSelection()).toEqual({
      district: '마포구',
      timeBand: '저녁',
    });
  });

  it('저장값이 깨져 있으면 기본값으로 돌아간다', () => {
    vi.useFakeTimers({ now: LUNCH });
    store.set('seedplus:weather-selection', '{not json');
    expect(readWeatherSelection().district).toBe(DEFAULT_WEATHER_DISTRICT);
  });
});
