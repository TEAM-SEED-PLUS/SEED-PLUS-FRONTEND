import { useEffect } from 'react';

/**
 * 한 화면 높이 섹션으로 이뤄진 페이지(랜딩·회사 소개)의 세로 스냅.
 * 스냅은 그 페이지에서만 동작해야 하므로 머무는 동안만 html에 붙인다(index.css .landing-snap).
 */
export function useLandingSnap() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('landing-snap');
    return () => root.classList.remove('landing-snap');
  }, []);
}
