type RuntimeEnvKey =
  | 'VITE_GA_MEASUREMENT_ID'
  | 'VITE_APP_ENV'
  | 'VITE_PROD_API_BASE_URL'
  | 'VITE_DEV_API_BASE_URL'
  // 상권날씨 AI(FastAPI) 서비스. 백엔드를 경유하지 않고 FE가 직접 호출한다.
  | 'VITE_PROD_AI_API_BASE_URL'
  | 'VITE_DEV_AI_API_BASE_URL';

declare global {
  interface Window {
    __ENV__?: Partial<Record<RuntimeEnvKey, string>>;
  }
}

// Reads from window.__ENV__ (runtime, injected by docker-entrypoint.sh in deployed containers)
// and falls back to import.meta.env (build-time, used in local dev via .env files).
export function getEnv(key: RuntimeEnvKey): string | undefined {
  return (
    window.__ENV__?.[key]?.trim() || import.meta.env[key]?.trim() || undefined
  );
}
