import { describe, expect, it } from 'vitest';
import { formatTimeBandRange, getCurrentTimeBand } from './timeBand';

// KST = UTC+9. 기기 시간대와 무관하게 한국 시간으로 판정되는지 UTC 시각으로 검증한다.
const kst = (hour: number, minute = 0) =>
  new Date(Date.UTC(2026, 8, 17, hour - 9, minute));

describe('getCurrentTimeBand (Asia/Seoul)', () => {
  it.each([
    [0, 0, '심야'],
    [5, 59, '심야'],
    [6, 0, '아침'],
    [11, 59, '아침'],
    [12, 0, '점심'],
    [16, 59, '점심'],
    [17, 0, '오후'],
    [19, 59, '오후'],
    [20, 0, '저녁'],
    [23, 59, '저녁'],
  ])('%i:%i KST → %s', (hour, minute, band) => {
    expect(getCurrentTimeBand(kst(hour, minute))).toBe(band);
  });
});

describe('formatTimeBandRange', () => {
  it('서버 구간과 같은 라벨을 만든다', () => {
    expect(formatTimeBandRange('점심')).toBe('12:00~17:00');
    expect(formatTimeBandRange('저녁')).toBe('20:00~24:00');
  });
});
