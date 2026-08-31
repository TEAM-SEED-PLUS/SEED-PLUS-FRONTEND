import axios from 'axios';
import { apiClient, setAccessToken } from './httpClient';

export type LoginRequest = {
  /** 영문과 숫자로 구성된 로그인 ID */
  loginId: string;
  password: string;
};

export type SignupRequest = {
  loginId: string;
  email: string;
  /** 하이픈 없는 휴대폰 번호 */
  phoneNumber: string;
  /** 백엔드는 BCrypt 제한으로 8~72자 검증. FE는 명세 V-02(8~64자)로 더 좁게 검증한다 */
  password: string;
  name: string;
  /** YYYY-MM-DD */
  birthDate: string;
};

export type PasswordResetRequest = {
  email: string;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

export type UserUpdateRequest = {
  name?: string;
  password?: string;
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
  loginId?: string;
  email?: string;
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

export const getCsrfHeaders = async () => {
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

/** 비밀번호 변경 — 비로그인 상태에서 email+현재 비밀번호로 본인 확인 */
export const resetPassword = async (payload: PasswordResetRequest) => {
  await apiClient.post('/api/v1/auth/password/reset', payload, {
    headers: await getCsrfHeaders(),
    skipAuthRefresh: true,
  });
};

/** 내 정보 수정 (이름·비밀번호) */
export const updateMyProfile = async (payload: UserUpdateRequest) => {
  const response = await apiClient.patch<ApiResponse<UserMeResponse>>(
    '/api/v1/users/me',
    payload,
    { headers: await getCsrfHeaders() }
  );
  return response.data.data;
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

export const getMyProfile = async (skipAuthRefresh = false) => {
  const response = await apiClient.get<ApiResponse<UserMeResponse>>(
    '/api/v1/users/me',
    { skipAuthRefresh }
  );
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
