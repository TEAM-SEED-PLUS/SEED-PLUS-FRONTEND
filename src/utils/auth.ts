const AUTH_STORAGE_KEY = 'seed-plus-authenticated';

export const setMockAuthenticated = (isAuthenticated: boolean) => {
  localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
};

export const getMockAuthenticated = () => {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
};
