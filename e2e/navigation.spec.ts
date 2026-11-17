import { test, expect } from '@playwright/test';

test('비회원이 랜딩 페이지에서 회사 소개 링크를 클릭하면 회사 소개 페이지로 이동한다', async ({
  page,
}) => {
  // 1. 이동
  await page.goto('/');

  // 2. 찾아서 누르기
  await page.getByRole('link', { name: '회사 소개' }).click();

  // 3. 확인 ①: 주소가 바뀌었는가
  await expect(page).toHaveURL('/company');

  // 3. 확인 ②: 회사 소개 페이지가 실제로 떴는가
  await expect(
    page.getByRole('heading', {
      name: '더 나은 선택이',
    })
  ).toBeVisible();
});
