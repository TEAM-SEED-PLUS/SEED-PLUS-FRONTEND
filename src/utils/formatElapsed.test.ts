import { describe, expect, it } from 'vitest';
import { formatElapsed } from './formatElapsed';

describe('formatElapsed', () => {
  it('1분 미만은 초만 표기한다', () => {
    expect(formatElapsed(0)).toBe('0초 경과');
    expect(formatElapsed(59)).toBe('59초 경과');
  });

  it('1분 이상은 분과 초를 함께 표기한다', () => {
    expect(formatElapsed(60)).toBe('1분 0초 경과');
    expect(formatElapsed(125)).toBe('2분 5초 경과');
  });
});
