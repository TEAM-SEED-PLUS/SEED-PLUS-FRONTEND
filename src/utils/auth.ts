const AUTH_STORAGE_KEY = 'seed-plus-authenticated';

export const isMockAuthEnabled = () => {
  return import.meta.env.VITE_ENABLE_MOCK_AUTH !== 'false';
};

export const setMockAuthenticated = (isAuthenticated: boolean) => {
  if (!isMockAuthEnabled()) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
};

export const getMockAuthenticated = () => {
  if (!isMockAuthEnabled()) {
    return false;
  }

  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
};
