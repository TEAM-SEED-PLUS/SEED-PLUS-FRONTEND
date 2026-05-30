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

export type IndustryLevel = IndustryResponse['level'];

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
  monthlyRent: number;
  deposit: number;
  investmentAmount: number;
  likeCount: number;
  commentCount: number;
  region: RegionResponse;
  commercialArea: CommercialAreaResponse;
  industry: IndustryResponse;
  liked?: boolean;
  bookmarked?: boolean;
};

export type BuilderStoreDetailResponse = BuilderStoreSummaryResponse & {
  liked: boolean;
  bookmarked: boolean;
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
  minArea?: number;
  maxArea?: number;
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
    name?: string;
    floor?: number;
    totalArea?: number;
    latitude?: number;
    longitude?: number;
    locationComplete?: boolean;
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
  description?: string;
  visibilityStatus: 'PUBLIC';
  imageUrls?: string[];
};

export const getBuilderStores = async (params: BuilderStoreListParams = {}) => {
  const response = await apiClient.get<ApiResponse<BuilderStoreListResponse>>(
    '/api/v1/builder-stores',
    { params }
  );
  return response.data.data;
};

export const getIndustries = async (level: IndustryLevel = 'LARGE') => {
  const response = await apiClient.get<ApiResponse<IndustryResponse[]>>(
    '/api/v1/industries',
    { params: { level } }
  );
  return response.data.data;
};

const analysisIndustryCodes = [
  'G2',
  'I1',
  'I2',
  'L1',
  'M1',
  'N1',
  'P1',
  'Q1',
  'R1',
  'S2',
];

const analysisIndustryCodeSet = new Set(analysisIndustryCodes);

export const getAnalysisIndustries = async () => {
  const largeIndustries = await getIndustries('LARGE');
  return largeIndustries
    .filter((industry) => analysisIndustryCodeSet.has(industry.industryCode))
    .sort(
      (left, right) =>
        analysisIndustryCodes.indexOf(left.industryCode) -
        analysisIndustryCodes.indexOf(right.industryCode)
    );
};

export const getSeoulDistricts = async () => {
  const response = await apiClient.get<RegionResponse[]>('/api/v1/regions', {
    params: { sido: '서울특별시', codeType: 'SIGUNGU' },
  });
  return response.data;
};

export const getSeoulLegalDongs = async () => {
  const response = await apiClient.get<RegionResponse[]>('/api/v1/regions', {
    params: { sido: '서울특별시', codeType: 'LEGAL_DONG' },
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

export const getBuilderStoreDetail = async (builderStoreId: number) => {
  const response = await apiClient.get<ApiResponse<BuilderStoreDetailResponse>>(
    `/api/v1/builder-stores/${builderStoreId}`
  );
  return response.data.data;
};

export const bookmarkBuilderStore = async (builderStoreId: number) => {
  await apiClient.post(
    `/api/v1/builder-stores/${builderStoreId}/bookmarks`,
    undefined,
    { headers: await getCsrfHeaders() }
  );
};

export const unbookmarkBuilderStore = async (builderStoreId: number) => {
  await apiClient.delete(`/api/v1/builder-stores/${builderStoreId}/bookmarks`, {
    headers: await getCsrfHeaders(),
  });
};

export const likeBuilderStore = async (builderStoreId: number) => {
  await apiClient.post(
    `/api/v1/builder-stores/${builderStoreId}/likes`,
    undefined,
    { headers: await getCsrfHeaders() }
  );
};

export const unlikeBuilderStore = async (builderStoreId: number) => {
  await apiClient.delete(`/api/v1/builder-stores/${builderStoreId}/likes`, {
    headers: await getCsrfHeaders(),
  });
};
