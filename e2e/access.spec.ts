import { test, expect } from '@playwright/test';
import { mockGuest } from './helpers/auth';

test('비회원이 상권날씨에 들어가면 로그인 페이지로 보내진다', async ({
  page,
}) => {
  await mockGuest(page);
  await page.goto('/weather');

  const loginInput = page.getByRole('textbox', { name: '아이디' });
  await expect(loginInput).toBeVisible();

  await expect(page).toHaveURL('/login');
});

test('운영환경에서 /feed로 이동하면 404 페이지가 올바르게 표시된다', async ({
  page,
}) => {
  await page.route('/env-config.js', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: `window.__ENV__ = ${JSON.stringify({
        VITE_APP_ENV: 'production',
        VITE_PROD_API_BASE_URL: 'https://api.example.com',
      })};`,
    })
  );

  await page.goto('/feed');

  // 404 화면이 보이는지 확인
  await expect(page.getByText('404')).toBeVisible();
});

test('로그인 확인이 느려도 랜딩의 로그인 버튼은 바로 보인다', async ({
  page,
}) => {
  await page.route('**/api/v1/auth/csrf', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await route.continue();
  });

  await page.goto('/');

  const loginButton = page.getByRole('link', { name: '로그인' });

  await expect(loginButton).toBeVisible({ timeout: 1000 });
});
