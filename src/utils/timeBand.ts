import type { TimeBand } from '@/api/weatherFeedTypes';

/**
 * 상권날씨 시간대 구간.
 * AI 서버(common.py TIME_BANDS)와 반드시 같아야 한다 — 서버는 현재 시간대의
 * overview 스냅샷만 생성하므로, 경계가 어긋나면 FE가 스냅샷 없는 시간대를 요청하게 된다.
 */
export const TIME_BAND_RANGES: {
  band: TimeBand;
  start: number;
  end: number;
}[] = [
  { band: '심야', start: 0, end: 6 },
  { band: '아침', start: 6, end: 12 },
  { band: '점심', start: 12, end: 17 },
  { band: '오후', start: 17, end: 20 },
  { band: '저녁', start: 20, end: 24 },
];

const pad = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

/** '점심 12:00~17:00' 형태 라벨 */
export const formatTimeBandRange = (band: TimeBand) => {
  const range = TIME_BAND_RANGES.find((item) => item.band === band);
  return range ? `${pad(range.start)}~${pad(range.end)}` : '';
};

/** 사용자 기기 시간대와 무관하게 한국 시간(Asia/Seoul) 기준 현재 시간대를 구한다 */
export const getCurrentTimeBand = (now: Date = new Date()): TimeBand => {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hourCycle: 'h23',
      timeZone: 'Asia/Seoul',
    }).format(now)
  );
  return (
    TIME_BAND_RANGES.find((item) => hour >= item.start && hour < item.end)
      ?.band ?? '점심'
  );
};
