import { getCsrfHeaders } from './authApi';
import { apiClient } from './httpClient';

type ApiResponse<T> = {
  status: number;
  code: number;
  message: string;
  data: T;
};

// 2026-09-01 계약: 분석이 정적 계산 → 실시간 외부 데이터 수집(B-10) 기반으로 전환됐다.
// - 두 요청 모두 storeName·staff가 필수가 됐다.
// - 생존율의 슬라이더 6종·보증금·창업형태·상권매출 '입력'은 제거됐고,
//   서버가 산출한 값이 응답 dynamicMetrics로 돌아온다.
// - 외부 수집 실패 시 502(code 9200)가 온다. collectionRunId는 그 재시도용.

export type ProfitAnalysisRequest = {
  storeName: string;
  industryCode: string;
  regionCode: string;
  area: number;
  invest: number;
  rent: number;
  premium: number;
  staff: number;
  /** 수집 실패 후 재시도할 실행 ID. 최초 요청에서는 생략 */
  collectionRunId?: number;
};

export type ProfitAnalysisResponse = {
  input: {
    storeName: string;
    industry: string;
    region: string;
    area: number;
    invest: number;
    rent: number;
    premium: number;
    staff: number;
  };
  assumptions: {
    baseRevenue: number;
    regionMultiplier: number;
    baseProfitRate: number;
    variableCostRate: number;
    fixedOverheadRate: number;
    staffCostPerPerson: number;
  };
  /** 실시간 수집 데이터로 산출된 상권 지표 */
  dynamicMetrics?: {
    baseRevenue: number;
    regionMultiplier: number;
    storeMarketFactor: number;
    avgSalesAmt: number;
    competitorCount: number;
    competitorDensity: number;
  };
  result: {
    monthlyRev: number;
    staffCost: number;
    fixedOverheadCost: number;
    fixedCost: number;
    variableCost: number;
    staffImpact: number;
    rentImpact: number;
    variableImpact: number;
    fixedOverheadImpact: number;
    profitRate: number;
    monthlyProfit: number;
    totalInvest: number;
    paybackMonths: number;
    propertyScore: number;
  };
  dataSources?: string[];
  warnings?: string[];
  fallbackUsed?: boolean;
};

export type SurvivalAnalysisRequest = {
  storeName: string;
  regionCode: string;
  industryCode: string;
  area: number;
  rent: number;
  invest: number;
  premium: number;
  staff: number;
  /** 수집 실패 후 재시도할 실행 ID. 최초 요청에서는 생략 */
  collectionRunId?: number;
};

/** 서버가 수집 데이터로 산출한 상권 변수 — 과거 슬라이더 입력값들이 여기로 이동했다 */
export type SurvivalDynamicMetrics = {
  avgSalesAmt: number;
  avgSales: number;
  salesGrowth: number;
  density: number;
  vacancy: number;
  traffic: number;
  churn: number;
  closureRate: number;
  newBusinessRate: number;
};

export type SurvivalAnalysisResponse = {
  input: {
    region: string;
    industry: string;
    area: number;
    rent: number;
    invest: number;
    premium: number;
    staff: number;
    startupType: string;
    storeName: string;
  };
  derived: {
    estMonthlyRevenue: number;
    competitionRatio: number;
    rentBurden: number;
    vitalityScore: number;
    stabilityIndex: number;
  };
  dynamicMetrics?: SurvivalDynamicMetrics;
  scoreBreakdown: {
    s1_salesStability: number;
    s2_salesGrowth: number;
    s3_competition: number;
    s4_vacancyRisk: number;
    s5_traffic: number;
    s6_rentBurden: number;
    s7_churn: number;
    s8_startupTypeBonus: number;
    rawScore: number;
    totalScore: number;
  };
  survival: {
    grade: string;
    survival1Year: string;
    survival3Year: string;
  };
  dataSources?: string[];
  warnings?: string[];
  fallbackUsed?: boolean;
};

export const calculateProfitAnalysis = async (
  payload: ProfitAnalysisRequest
) => {
  const response = await apiClient.post<ApiResponse<ProfitAnalysisResponse>>(
    '/api/v1/analysis/profit',
    payload,
    { headers: await getCsrfHeaders() }
  );
  return response.data.data;
};

export const calculateSurvivalAnalysis = async (
  payload: SurvivalAnalysisRequest
) => {
  const response = await apiClient.post<ApiResponse<SurvivalAnalysisResponse>>(
    '/api/v1/analysis/survival',
    payload,
    { headers: await getCsrfHeaders() }
  );
  return response.data.data;
};
