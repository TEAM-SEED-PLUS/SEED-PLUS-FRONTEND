import { getEnv } from '@/utils/env';

const gaMeasurementId = getEnv('VITE_GA_MEASUREMENT_ID');

let isGoogleAnalyticsLoaded = false;

export const isGoogleAnalyticsEnabled = Boolean(gaMeasurementId);

export const loadGoogleAnalytics = () => {
  if (
    !isGoogleAnalyticsEnabled ||
    isGoogleAnalyticsLoaded ||
    typeof window === 'undefined' ||
    typeof document === 'undefined'
  ) {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer!.push(args);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', gaMeasurementId);
  isGoogleAnalyticsLoaded = true;
};

export const trackPageView = (path: string) => {
  if (!isGoogleAnalyticsEnabled || !window.gtag) {
    return;
  }

  window.gtag('config', gaMeasurementId, {
    page_path: path,
  });
};

export const trackEvent = (
  action: string,
  params?: Record<string, string | number | boolean>
) => {
  if (!isGoogleAnalyticsEnabled || !window.gtag) {
    return;
  }

  window.gtag('event', action, params);
};

// GA4 회원 행동 분석(User-ID). 로그인 시 회원 식별자를 세팅, 로그아웃 시 null로 해제.
// config 재호출은 page_view가 재전송될 수 있고 undefined 값은 무시되어 해제가 안 되므로
// gtag('set')에 null을 명시해 전달한다.
// 식별자는 /users/me의 loginId(가명 ID)를 쓴다 — GA 정책상 이메일 등 PII는 금지.
// BE가 숫자 PK를 노출하면 그쪽으로 교체해도 된다.
export const setAnalyticsUserId = (userId: string | null) => {
  if (!isGoogleAnalyticsEnabled || !window.gtag) {
    return;
  }

  window.gtag('set', { user_id: userId });
};
