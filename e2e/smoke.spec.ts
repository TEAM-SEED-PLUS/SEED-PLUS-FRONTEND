import { test, expect } from '@playwright/test';

test('비회원이 랜딩에 들어가면 로그인 버튼이 보인다', async ({ page }) => {
  await page.goto('/');

  const loginButton = page.getByRole('link', { name: '로그인' });

  await expect(loginButton).toBeVisible();
});
