import { createContext } from 'react';
import type { LoginRequest, SignupRequest, UserMeResponse } from '@/api';

export type AuthStatus = 'loading' | 'authenticated' | 'guest';

export type AuthContextValue = {
  status: AuthStatus;
  isAuthenticated: boolean;
  user: UserMeResponse | null;
  login: (payload: LoginRequest) => Promise<void>;
  signup: (payload: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  /** 프로필 수정 후 전역 user 상태를 서버 기준으로 갱신한다 */
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
