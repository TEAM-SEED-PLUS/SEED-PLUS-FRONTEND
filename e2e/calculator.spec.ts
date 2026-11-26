import { test, expect, type Page } from '@playwright/test';
import { mockLoggedIn } from './helpers/auth';
import {
  COLLECTION_FAILURE_MESSAGE,
  mockProfitAnalysis,
  mockProfitAnalysisFailure,
  mockSurvivalAnalysis,
} from './helpers/analysis';
import { mockStoreMetadata } from './helpers/store';

// 계산기에 값을 넣고 결과를 받는 흐름. 데스크톱과 모바일 화면 크기 모두에서 돈다.
// 모바일은 입력과 결과가 한 화면씩 번갈아 보이고, 데스크톱은 나란히 보인다.

/** 내 상가 만들기에서 계산기를 연다. 모바일은 메뉴 안에 버튼이 있다. */
const openCalculator = async (
  page: Page,
  isMobile: boolean,
  buttonName: string
) => {
  await page.goto('/store-builder');
  if (isMobile) {
    await page.getByRole('button', { name: '메뉴 열기' }).click();
  }
  await page.getByRole('button', { name: buttonName }).click();
};

/** 두 계산기가 함께 쓰는 입력값을 채운다. */
const fillCommonFields = async (page: Page) => {
  await page.getByLabel('상가명').fill('테스트 상가');
  await page.getByLabel('업종 선택').selectOption({ label: '카페/음료' });
  await page.getByLabel('자치구 선택').selectOption({ label: '강남구' });
  await page.getByLabel('법정동 선택').selectOption({ label: '역삼동' });
  await page.getByLabel('면적(m²)').fill('50');
  await page.getByLabel('초기 투자금(만원)').fill('5000');
  await page.getByLabel('월 임대료(만원)').fill('300');
  await page.getByLabel('권리금(만원)').fill('3000');
  await page.getByLabel('예상 직원 수(명)').fill('2');
};

test.beforeEach(async ({ page }) => {
  await mockLoggedIn(page);
  await mockStoreMetadata(page);
});

test('수익률 계산기에 값을 넣고 계산하면 결과가 보인다', async ({
  page,
  isMobile,
}) => {
  await mockProfitAnalysis(page);
  await openCalculator(page, isMobile, '수익률 추정 계산기');
  await fillCommonFields(page);

  const requestPromise = page.waitForRequest(
    (request) =>
      request.url().includes('/api/v1/analysis/profit') &&
      request.method() === 'POST'
  );
  await page.getByRole('button', { name: '수익률 추정', exact: true }).click();

  // 서버에는 구가 아니라 고른 동의 코드가 지역으로 간다.
  const request = await requestPromise;
  expect(request.postDataJSON()).toEqual({
    storeName: '테스트 상가',
    industryCode: 'I1',
    regionCode: '1168010100',
    area: 50,
    invest: 5000,
    rent: 300,
    premium: 3000,
    staff: 2,
  });

  await expect(page.getByText('1,234', { exact: true })).toBeVisible();
  await expect(page.getByText('18.5%', { exact: true })).toBeVisible();
  await expect(page.getByText('27.3개월')).toBeVisible();
  await expect(page.getByText('82점')).toBeVisible();
  await expect(
    page.getByRole('button', { name: '내 상가 목록에 저장하기' })
  ).toBeEnabled();
});

test('생존율 계산기에 값을 넣고 계산하면 결과가 보인다', async ({
  page,
  isMobile,
}) => {
  await mockSurvivalAnalysis(page);
  await openCalculator(page, isMobile, '생존율 측정 계산기');

  const submitButton = page.getByRole('button', { name: '생존율 계산하기' });
  // 값을 다 넣기 전에는 계산 버튼을 누를 수 없다.
  await expect(submitButton).toBeDisabled();

  await fillCommonFields(page);
  await submitButton.click();

  // 같은 값이 인쇄용 PDF 영역에도 한 번 더 있어, 화면의 결과 카드로 범위를 좁힌다.
  const resultPanel = page.locator('section[aria-busy]');
  await expect(resultPanel.getByText('78~84%')).toBeVisible();
  await expect(resultPanel.getByText('52~60%')).toBeVisible();
});

test('수익률 계산이 실패하면 안내 문구가 보이고 입력 화면에 머문다', async ({
  page,
  isMobile,
}) => {
  await mockProfitAnalysisFailure(page);
  await openCalculator(page, isMobile, '수익률 추정 계산기');
  await fillCommonFields(page);

  await page.getByRole('button', { name: '수익률 추정', exact: true }).click();

  await expect(page.getByText(COLLECTION_FAILURE_MESSAGE)).toBeVisible();
  // 입력값이 남아 있어 바로 다시 시도할 수 있다.
  await expect(page.getByLabel('상가명')).toHaveValue('테스트 상가');
});

test.describe('모바일 계산기 화면 전환', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!isMobile, '모바일 전용');
  });

  test('결과 화면에서 입력으로 돌아가면 넣었던 값이 남아 있다', async ({
    page,
    isMobile,
  }) => {
    await mockProfitAnalysis(page);
    await openCalculator(page, isMobile, '수익률 추정 계산기');
    await fillCommonFields(page);
    await page
      .getByRole('button', { name: '수익률 추정', exact: true })
      .click();

    // 모바일은 결과가 나오면 입력 화면이 가려진다.
    await expect(
      page.getByRole('heading', { name: '수익률 계산 결과' })
    ).toBeVisible();
    await expect(page.getByLabel('상가명')).toBeHidden();

    await page.getByRole('button', { name: '입력으로 돌아가기' }).click();

    await expect(page.getByLabel('상가명')).toHaveValue('테스트 상가');
    await expect(page.getByLabel('월 임대료(만원)')).toHaveValue('300');
  });
});
