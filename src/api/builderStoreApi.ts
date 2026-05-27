import { apiClient } from './httpClient';
import { getCsrfHeaders } from './authApi';

type ApiResponse<T> = {
  status: number;
  code: number;
  message: string;
  data: T;
};

export type RegionResponse = {
  regionId: number;
  sido: string;
  sigungu: string;
  dong?: string;
  code: string;
  codeType: 'LEGAL_DONG' | 'ADMIN_DONG' | 'SIGUNGU';
};

export type IndustryResponse = {
  industryId: number;
  industryCode: string;
  name: string;
  parentIndustryId?: number;
  level: 'LARGE' | 'MEDIUM' | 'SMALL';
  children?: IndustryResponse[];
};

export type CommercialAreaResponse = {
  commercialAreaId: number;
  name: string;
};

export type BuilderStoreSummaryResponse = {
  builderStoreId: number;
  name: string;
  area: number;
  expectedMonthlySales: number;
  expectedProfitRate: number;
  investmentPaybackMonths: number;
  propertyScore: number;
  likeCount: number;
  commentCount: number;
  region: RegionResponse;
  commercialArea: CommercialAreaResponse;
  industry: IndustryResponse;
};

export type PageInfo = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  isLast: boolean;
};

export type BuilderStoreListParams = {
  page?: number;
  size?: number;
  sort?: string;
  regionId?: number;
  industryId?: number;
};

export type BuilderStoreListResponse = {
  content: BuilderStoreSummaryResponse[];
  pageInfo: PageInfo;
};

type PagedCommercialAreaResponse = {
  content: CommercialAreaResponse[];
  pageInfo: PageInfo;
};

export type CreateBuilderStoreRequest = {
  regionId: number;
  commercialAreaId: number;
  industryId: number;
  name: string;
  building: {
    address: string;
  };
  metrics: {
    area: number;
    expectedMonthlySales: number;
    expectedProfitRate: number;
    investmentPaybackMonths: number;
    monthlyRent: number;
    deposit: number;
    investmentAmount: number;
  };
  visibilityStatus: 'PUBLIC';
};

export const getBuilderStores = async (params: BuilderStoreListParams = {}) => {
  const response = await apiClient.get<ApiResponse<BuilderStoreListResponse>>(
    '/api/v1/builder-stores',
    { params }
  );
  return response.data.data;
};

export const getIndustries = async () => {
  const response = await apiClient.get<ApiResponse<IndustryResponse[]>>(
    '/api/v1/industries',
    { params: { level: 'LARGE' } }
  );
  return response.data.data;
};

export const getSeoulDistricts = async () => {
  const response = await apiClient.get<RegionResponse[]>('/api/v1/regions', {
    params: { sido: '서울특별시', codeType: 'SIGUNGU' },
  });
  return response.data;
};

export const getCommercialAreas = async (regionId: number) => {
  const response = await apiClient.get<
    ApiResponse<PagedCommercialAreaResponse>
  >('/api/v1/commercial-areas', {
    params: { page: 0, size: 100, regionId, status: 'ACTIVE' },
  });
  return response.data.data.content;
};

export const createBuilderStore = async (
  payload: CreateBuilderStoreRequest
) => {
  const response = await apiClient.post<ApiResponse<unknown>>(
    '/api/v1/builder-stores',
    payload,
    {
      headers: await getCsrfHeaders(),
    }
  );
  return response.data.data;
};
