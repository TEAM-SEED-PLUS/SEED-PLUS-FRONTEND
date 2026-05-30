import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { getEnv } from '@/utils/env';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    skipAuthRefresh?: boolean;
    hasRetriedAuth?: boolean;
  }

  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
    hasRetriedAuth?: boolean;
  }
}

type AppEnv = 'development' | 'production';

const accessTokenStorageKey = 'seed_plus_access_token';

const readStoredAccessToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage.getItem(accessTokenStorageKey);
};

const getAppEnv = (): AppEnv => {
  const appEnv = getEnv('VITE_APP_ENV') || 'development';

  if (appEnv !== 'development' && appEnv !== 'production') {
    throw new Error(
      `VITE_APP_ENV must be either development or production. Current value: ${appEnv}`
    );
  }

  return appEnv;
};

const getApiBaseUrl = () => {
  const appEnv = getAppEnv();
  const apiBaseUrl =
    appEnv === 'production'
      ? getEnv('VITE_PROD_API_BASE_URL')
      : getEnv('VITE_DEV_API_BASE_URL');

  if (!apiBaseUrl) {
    throw new Error(
      `${appEnv === 'production' ? 'VITE_PROD_API_BASE_URL' : 'VITE_DEV_API_BASE_URL'} is not configured. Add the API server URL to the environment variables.`
    );
  }

  return apiBaseUrl;
};

let accessToken: string | null = readStoredAccessToken();
let refreshHandler: (() => Promise<string | null>) | null = null;
let refreshRequest: Promise<string | null> | null = null;

const apiBaseUrl = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAccessToken = (token: string | null) => {
  accessToken = token;

  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    window.sessionStorage.setItem(accessTokenStorageKey, token);
  } else {
    window.sessionStorage.removeItem(accessTokenStorageKey);
  }
};

export const getAccessToken = () => accessToken;

export const setRefreshHandler = (handler: () => Promise<string | null>) => {
  refreshHandler = handler;
};

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const config = error.config as InternalAxiosRequestConfig | undefined;
    const canRefresh =
      error.response?.status === 401 &&
      Boolean(accessToken) &&
      Boolean(refreshHandler) &&
      !config?.skipAuthRefresh &&
      !config?.hasRetriedAuth;

    if (!canRefresh || !config) {
      return Promise.reject(error);
    }

    config.hasRetriedAuth = true;
    refreshRequest ??= refreshHandler!().finally(() => {
      refreshRequest = null;
    });

    const renewedToken = await refreshRequest;
    if (!renewedToken) {
      return Promise.reject(error);
    }

    config.headers.Authorization = `Bearer ${renewedToken}`;
    return apiClient(config);
  }
);
