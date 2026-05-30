import { useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  clearAuthToken,
  getAccessToken,
  getMyProfile,
  login as requestLogin,
  logout as requestLogout,
  reissue,
  setRefreshHandler,
  signup as requestSignup,
} from '@/api';
import { AuthContext } from './AuthContext';
import type { AuthContextValue, AuthStatus } from './AuthContext';
import type { UserMeResponse } from '@/api';

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<UserMeResponse | null>(null);

  useEffect(() => {
    let active = true;

    const refreshSession = async () => {
      try {
        const token = await reissue();
        const profile = await getMyProfile();
        if (active) {
          setUser(profile);
          setStatus('authenticated');
        }
        return token;
      } catch {
        clearAuthToken();
        if (active) {
          setUser(null);
          setStatus('guest');
        }
        return null;
      }
    };

    const restoreSession = async () => {
      const storedToken = getAccessToken();

      if (storedToken) {
        try {
          const profile = await getMyProfile(true);
          if (active) {
            setUser(profile);
            setStatus('authenticated');
          }
          return storedToken;
        } catch {
          clearAuthToken();
        }
      }

      return refreshSession();
    };

    setRefreshHandler(refreshSession);

    void restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      isAuthenticated: status === 'authenticated',
      user,
      login: async (payload) => {
        try {
          await requestLogin(payload);
          const profile = await getMyProfile();
          setUser(profile);
          setStatus('authenticated');
        } catch (error) {
          clearAuthToken();
          setUser(null);
          setStatus('guest');
          throw error;
        }
      },
      signup: async (payload) => {
        await requestSignup(payload);
      },
      logout: async () => {
        try {
          await requestLogout();
        } finally {
          clearAuthToken();
          setUser(null);
          setStatus('guest');
        }
      },
    }),
    [status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
