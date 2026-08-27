import { describe, expect, it } from 'vitest';
import { formatUpdatedAt } from './formatUpdatedAt';

// 기준 시각을 고정해 테스트가 실행 시점에 영향받지 않게 한다.
const now = new Date('2026-07-11T19:25:00');
const ago = (ms: number) => new Date(now.getTime() - ms).toISOString();

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe('formatUpdatedAt', () => {
  it('24시간 이내는 상대 시간으로 표기한다', () => {
    expect(formatUpdatedAt(ago(10 * 1000), now)).toBe('방금 전 업데이트');
    expect(formatUpdatedAt(ago(MINUTE), now)).toBe('1분 전 업데이트');
    expect(formatUpdatedAt(ago(15 * MINUTE), now)).toBe('15분 전 업데이트');
    expect(formatUpdatedAt(ago(HOUR), now)).toBe('1시간 전 업데이트');
    expect(formatUpdatedAt(ago(23 * HOUR), now)).toBe('23시간 전 업데이트');
  });

  it('24시간이 지나면 절대 날짜로 표기한다', () => {
    // 2026-07-10 19:25 (정확히 24시간 전)
    expect(formatUpdatedAt(ago(DAY), now)).toBe('최신화: 2026.07.10 19:25');
    expect(formatUpdatedAt(ago(3 * DAY), now)).toBe('최신화: 2026.07.08 19:25');
  });

  it('월·일·시·분을 두 자리로 채운다', () => {
    expect(formatUpdatedAt('2026-01-05T09:07:00', now)).toBe(
      '최신화: 2026.01.05 09:07'
    );
  });

  it('경계값: 59초는 방금 전, 60초는 1분 전', () => {
    expect(formatUpdatedAt(ago(59 * 1000), now)).toBe('방금 전 업데이트');
    expect(formatUpdatedAt(ago(60 * 1000), now)).toBe('1분 전 업데이트');
  });

  it('경계값: 59분은 분 단위, 60분은 시간 단위', () => {
    expect(formatUpdatedAt(ago(59 * MINUTE), now)).toBe('59분 전 업데이트');
    expect(formatUpdatedAt(ago(60 * MINUTE), now)).toBe('1시간 전 업데이트');
  });

  it('서버 시계가 앞서 미래 시각이 와도 방금 전으로 처리한다', () => {
    expect(formatUpdatedAt(ago(-5 * MINUTE), now)).toBe('방금 전 업데이트');
  });

  it('값이 없거나 잘못된 형식이면 빈 문자열을 반환한다', () => {
    expect(formatUpdatedAt(undefined, now)).toBe('');
    expect(formatUpdatedAt(null, now)).toBe('');
    expect(formatUpdatedAt('', now)).toBe('');
    expect(formatUpdatedAt('날짜아님', now)).toBe('');
  });
});
