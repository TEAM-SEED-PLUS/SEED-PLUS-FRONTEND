import test, { expect } from '@playwright/test';
import { mockGuest, mockLoggedIn } from './helpers/auth';

test('랜딩의 로그인 버튼을 누르면 상권날씨 페이지로 이동된다', async ({
  page,
}) => {
  await mockLoggedIn(page);
  await page.goto('/');

  await page.getByRole('link', { name: '로그인' }).click();

  await expect(page).toHaveURL('/weather');
});

// 위 테스트의 짝. 버튼이 누구에게나 상권날씨로 보내는 버그가 생기면 여기서 잡힌다.
test('비회원이 랜딩의 로그인 버튼을 누르면 로그인 페이지로 간다', async ({
  page,
}) => {
  await mockGuest(page);
  await page.goto('/');

  await page.getByRole('link', { name: '로그인' }).click();

  await expect(page).toHaveURL('/login');
  await expect(page.getByRole('textbox', { name: '아이디' })).toBeVisible();
});
