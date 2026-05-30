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
};

export const AuthContext = createContext<AuthContextValue | null>(null);
