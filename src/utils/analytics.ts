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
