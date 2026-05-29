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
import {
  clearMockAuthenticated,
  getMockAuthenticated,
  isMockAuthEnabled,
  setMockAuthenticated,
} from '@/utils/auth';
import { AuthContext } from './AuthContext';
import type { AuthContextValue, AuthStatus } from './AuthContext';
import type { UserMeResponse } from '@/api';

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const mockEnabled = isMockAuthEnabled();

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

    if (mockEnabled && getMockAuthenticated()) {
      setUser(null);
      setStatus('authenticated');
      return () => {
        active = false;
      };
    }

    void restoreSession();

    return () => {
      active = false;
    };
  }, [mockEnabled]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      isAuthenticated: status === 'authenticated',
      isMockLoginAvailable: mockEnabled,
      user,
      login: async (payload) => {
        try {
          await requestLogin(payload);
          const profile = await getMyProfile();
          clearMockAuthenticated();
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
      loginWithMock: () => {
        if (!mockEnabled) {
          return;
        }

        setMockAuthenticated(true);
        setUser(null);
        setStatus('authenticated');
      },
      logout: async () => {
        try {
          if (!getMockAuthenticated()) {
            await requestLogout();
          }
        } finally {
          clearAuthToken();
          clearMockAuthenticated();
          setUser(null);
          setStatus('guest');
        }
      },
    }),
    [mockEnabled, status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
