import type { Page } from '@playwright/test';
import { corsHeaders, fulfillJson } from './auth';

// 계산기 응답. 값은 모두 지어낸 것이고, 화면에 찍히는 숫자를 테스트가 확인한다.
// mockLoggedIn 뒤에 불러야 적용된다.

/** 수익률 추정 계산 성공: 월 매출 1,234만원, 순이익률 18.5% */
export const mockProfitAnalysis = async (page: Page) => {
  await page.route('**/api/v1/analysis/profit', (route) =>
    fulfillJson(route, {
      input: {
        storeName: '테스트 상가',
        industry: '카페/음료',
        region: '역삼동',
        area: 50,
        invest: 5000,
        rent: 300,
        premium: 3000,
        staff: 2,
      },
      assumptions: {
        baseRevenue: 1100,
        regionMultiplier: 1.1,
        baseProfitRate: 15.2,
        variableCostRate: 0.35,
        fixedOverheadRate: 0.1,
        staffCostPerPerson: 250,
      },
      result: {
        monthlyRev: 1234,
        staffCost: 500,
        fixedOverheadCost: 120,
        fixedCost: 920,
        variableCost: 430,
        staffImpact: -5,
        rentImpact: -3,
        variableImpact: -2,
        fixedOverheadImpact: -1,
        profitRate: 18.5,
        monthlyProfit: 228,
        totalInvest: 8000,
        paybackMonths: 27.3,
        propertyScore: 82,
      },
    })
  );
};

/** 생존율 계산 성공: 1년 78~84%, 3년 52~60% */
export const mockSurvivalAnalysis = async (page: Page) => {
  await page.route('**/api/v1/analysis/survival', (route) =>
    fulfillJson(route, {
      input: {
        region: '역삼동',
        industry: '카페/음료',
        area: 50,
        rent: 300,
        invest: 5000,
        premium: 3000,
        staff: 2,
        startupType: 'NEW',
        storeName: '테스트 상가',
      },
      derived: {
        estMonthlyRevenue: 1234,
        competitionRatio: 1.2,
        rentBurden: 0.24,
        vitalityScore: 70,
        stabilityIndex: 65,
      },
      dynamicMetrics: {
        avgSalesAmt: 1100,
        avgSales: 60,
        salesGrowth: 55,
        density: 40,
        vacancy: 30,
        traffic: 75,
        churn: 35,
        closureRate: 20,
        newBusinessRate: 25,
      },
      scoreBreakdown: {
        s1_salesStability: 12,
        s2_salesGrowth: 10,
        s3_competition: 9,
        s4_vacancyRisk: 8,
        s5_traffic: 13,
        s6_rentBurden: 9,
        s7_churn: 8,
        s8_startupTypeBonus: 3,
        rawScore: 72,
        totalScore: 72,
      },
      survival: {
        grade: 'B',
        survival1Year: '78~84%',
        survival3Year: '52~60%',
      },
    })
  );
};

/** 외부 데이터 수집 실패(502): 서버가 준 안내 문구를 화면이 그대로 보여 줘야 한다 */
export const COLLECTION_FAILURE_MESSAGE =
  '상권 데이터를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.';

export const mockProfitAnalysisFailure = async (page: Page) => {
  await page.route('**/api/v1/analysis/profit', (route) => {
    if (route.request().method() === 'OPTIONS') {
      return fulfillJson(route, null);
    }

    return route.fulfill({
      status: 502,
      contentType: 'application/json',
      headers: corsHeaders,
      body: JSON.stringify({
        status: 502,
        code: 9200,
        message: COLLECTION_FAILURE_MESSAGE,
        data: null,
      }),
    });
  });
};
