import { test, expect } from '@playwright/test';
import { mockLoggedIn } from './helpers/auth';
import { mockProductionEnv } from './helpers/env';
import { mockStoreMetadata } from './helpers/store';

// 모바일 헤더에는 메뉴 링크가 없고 '메뉴 열기' 버튼만 있다.
// 어느 화면에서 열어도 같은 메뉴가 나오고, 거기서 주요 기능으로 갈 수 있어야 한다.
// 시안: Figma '대시보드 - 메뉴' (node 404:2264) + 상권날씨 버튼
test.describe('모바일 메뉴', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!isMobile, '모바일 전용');
  });

  const openMenu = (page: import('@playwright/test').Page) =>
    page.getByRole('button', { name: '메뉴 열기' }).click();

  test('로그인한 사용자가 상권날씨에서 메뉴를 열어 내 상가 만들기로 이동한다', async ({
    page,
  }) => {
    await mockLoggedIn(page);
    await page.goto('/weather');

    await openMenu(page);
    await page.getByRole('link', { name: '내 상가 만들기' }).click();

    await expect(page).toHaveURL('/store-builder');
  });

  test('내 상가 만들기에서 메뉴를 열면 수익률·생존율 계산기 버튼이 보인다', async ({
    page,
  }) => {
    await mockLoggedIn(page);
    await page.goto('/store-builder');

    await openMenu(page);

    await expect(
      page.getByRole('button', { name: '수익률 추정 계산기' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: '생존율 측정 계산기' })
    ).toBeVisible();
  });

  test('상권날씨의 메뉴에서 수익률 추정 계산기를 누르면 계산기가 열린다', async ({
    page,
  }) => {
    await mockLoggedIn(page);
    await page.goto('/weather');

    await openMenu(page);
    await page.getByRole('button', { name: '수익률 추정 계산기' }).click();

    await expect(page).toHaveURL('/store-builder');
    await expect(
      page.getByRole('heading', { name: '내 상가 수익률 추정' })
    ).toBeVisible();
  });

  test('상권날씨의 메뉴에서 생존율 측정 계산기를 누르면 계산기가 열린다', async ({
    page,
  }) => {
    await mockLoggedIn(page);
    await page.goto('/weather');

    await openMenu(page);
    await page.getByRole('button', { name: '생존율 측정 계산기' }).click();

    await expect(page).toHaveURL('/store-builder');
    await expect(
      page.getByRole('heading', { name: '생존율 계산기' })
    ).toBeVisible();
  });

  test('상권날씨의 메뉴에서 업종을 고르면 그 업종이 선택된 내 상가 만들기가 열린다', async ({
    page,
  }) => {
    await mockLoggedIn(page);
    await mockStoreMetadata(page);
    await page.goto('/weather');

    await openMenu(page);
    await page.getByRole('button', { name: '카페/음료' }).click();

    await expect(page).toHaveURL('/store-builder');
    // 목록 위 필터 표시줄에 선택한 업종이 나온다.
    await expect(page.getByRole('main').getByText('카페/음료')).toBeVisible();
  });

  test('내 상가 만들기의 메뉴에서 상권날씨로 이동한다', async ({ page }) => {
    await mockLoggedIn(page);
    await page.goto('/store-builder');

    await openMenu(page);
    await page.getByRole('link', { name: '상권날씨' }).click();

    await expect(page).toHaveURL('/weather');
  });

  test('개발 환경에서는 메뉴의 피드로 이동할 수 있다', async ({ page }) => {
    await mockLoggedIn(page);
    await page.goto('/weather');

    await openMenu(page);
    await page.getByRole('link', { name: '피드' }).click();

    await expect(page).toHaveURL('/feed');
  });

  test('운영 환경에서는 메뉴에 피드가 보이지 않는다', async ({ page }) => {
    await mockProductionEnv(page);
    await mockLoggedIn(page);
    await page.goto('/weather');

    await openMenu(page);

    // 메뉴가 열린 것을 먼저 확인한 뒤, 피드가 없는지 본다.
    await expect(page.getByRole('link', { name: '상권날씨' })).toBeVisible();
    await expect(page.getByRole('link', { name: '피드' })).toHaveCount(0);
  });
});
