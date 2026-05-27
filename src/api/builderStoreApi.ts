import { apiClient } from './httpClient';

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

type CommercialAreaResponse = {
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
