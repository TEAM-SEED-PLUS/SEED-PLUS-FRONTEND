import { getCsrfHeaders } from './authApi';
import { apiClient } from './httpClient';

type ApiResponse<T> = {
  status: number;
  code: number;
  message: string;
  data: T;
};

export type ProfitAnalysisRequest = {
  industryCode: string;
  regionCode: string;
  area: number;
  invest: number;
  rent: number;
  premium: number;
  staff: number;
};

export type ProfitAnalysisResponse = {
  input: {
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
};

export type SurvivalAnalysisRequest = {
  regionCode: string;
  industryCode: string;
  area: number;
  rent: number;
  deposit: number;
  avgSales: number;
  salesGrowth: number;
  density: number;
  vacancy: number;
  traffic: number;
  churn: number;
  startupType: string;
  avgSalesAmt: number;
};

export type SurvivalAnalysisResponse = {
  input: {
    region: string;
    industry: string;
    area: number;
    rent: number;
    deposit: number;
    avgSales: number;
    salesGrowth: number;
    density: number;
    vacancy: number;
    traffic: number;
    churn: number;
    startupType: string;
    avgSalesAmt: number;
  };
  derived: {
    estMonthlyRevenue: number;
    competitionRatio: number;
    rentBurden: number;
    vitalityScore: number;
    stabilityIndex: number;
  };
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
