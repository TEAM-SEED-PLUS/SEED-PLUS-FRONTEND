import { test, expect } from '@playwright/test';

test('비회원이 랜딩에 들어가면 로그인 버튼이 보인다', async ({ page }) => {
  await page.goto('/');

  const loginButton = page.getByRole('link', { name: '로그인' });

  await expect(loginButton).toBeVisible();
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
