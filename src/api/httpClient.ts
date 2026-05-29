import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

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

const accessTokenStorageKey = 'seed_plus_access_token';

const readStoredAccessToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage.getItem(accessTokenStorageKey);
};

let accessToken: string | null = readStoredAccessToken();
let refreshHandler: (() => Promise<string | null>) | null = null;
let refreshRequest: Promise<string | null> | null = null;

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

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
  if (!apiBaseUrl) {
    throw new Error(
      'VITE_API_BASE_URL이 설정되지 않았습니다. API 서버 주소를 환경변수에 추가해주세요.'
    );
  }

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
