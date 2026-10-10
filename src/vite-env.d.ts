/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV?: 'development' | 'production';
  readonly VITE_DEV_API_BASE_URL?: string;
  readonly VITE_PROD_API_BASE_URL?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  /** BM 1차 화면 로컬 확인용 (featureFlags.BM_PHASE1) */
  readonly VITE_ENABLE_BM_PAYWALL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
