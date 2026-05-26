import axios from 'axios';
import { apiClient, setAccessToken } from './httpClient';

export type LoginRequest = {
  phoneNumber: string;
  password: string;
};

export type SignupRequest = LoginRequest & {
  name: string;
  birthDate: string;
};

export type TokenResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

export type CsrfTokenResponse = {
  headerName: string;
  parameterName: string;
  token: string;
};

export type UserMeResponse = {
  name: string;
  role: 'OWNER' | 'GENERAL' | 'VISITOR' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
};

type ApiResponse<T> = {
  status: number;
  code: number;
  message: string;
  data: T;
};

type ApiErrorResponse = {
  message?: string;
};

const getCsrfHeaders = async () => {
  const response = await apiClient.get<ApiResponse<CsrfTokenResponse>>(
    '/api/v1/auth/csrf',
    { skipAuthRefresh: true }
  );

  return {
    [response.data.data.headerName]: response.data.data.token,
  };
};

export const login = async (payload: LoginRequest) => {
  const response = await apiClient.post<ApiResponse<TokenResponse>>(
    '/api/v1/auth/login',
    payload,
    {
      headers: await getCsrfHeaders(),
      skipAuthRefresh: true,
    }
  );

  setAccessToken(response.data.data.accessToken);
  return response.data.data;
};

export const signup = async (payload: SignupRequest) => {
  await apiClient.post('/api/v1/auth/signup', payload, {
    headers: await getCsrfHeaders(),
    skipAuthRefresh: true,
  });
};

export const reissue = async () => {
  const response = await apiClient.post<ApiResponse<TokenResponse>>(
    '/api/v1/auth/reissue',
    undefined,
    {
      headers: await getCsrfHeaders(),
      skipAuthRefresh: true,
    }
  );

  const token = response.data.data.accessToken;
  setAccessToken(token);
  return token;
};

export const logout = async () => {
  await apiClient.post('/api/v1/auth/logout', undefined, {
    headers: await getCsrfHeaders(),
    skipAuthRefresh: true,
  });
};

export const getMyProfile = async () => {
  const response =
    await apiClient.get<ApiResponse<UserMeResponse>>('/api/v1/users/me');
  return response.data.data;
};

export const clearAuthToken = () => {
  setAccessToken(null);
};

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.';
};
