import { afterEach, describe, expect, it, vi } from 'vitest';
import { hasSessionHint, setSessionHint } from './sessionHint';

const stubStorage = () => {
  const store = new Map<string, string>();
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
      removeItem: (key: string) => void store.delete(key),
    },
  });
};

describe('sessionHint', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('처음 방문한 브라우저에는 흔적이 없다', () => {
    stubStorage();
    expect(hasSessionHint()).toBe(false);
  });

  it('로그인하면 흔적이 남고 로그아웃하면 지워진다', () => {
    stubStorage();
    setSessionHint(true);
    expect(hasSessionHint()).toBe(true);
    setSessionHint(false);
    expect(hasSessionHint()).toBe(false);
  });

  it('저장소를 쓸 수 없으면 흔적이 없는 것으로 본다', () => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem: () => {
          throw new Error('blocked');
        },
        setItem: () => {
          throw new Error('blocked');
        },
        removeItem: () => {
          throw new Error('blocked');
        },
      },
    });
    expect(() => setSessionHint(true)).not.toThrow();
    expect(hasSessionHint()).toBe(false);
  });
});
