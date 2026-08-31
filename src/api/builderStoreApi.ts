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
  uploadedAt?: string;
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

/** 저장=PRIVATE, 공유=PUBLIC. 서버 enum은 DELETED까지 포함하지만 FE에서는 쓰지 않는다. */
export type BuilderStoreVisibility = 'PUBLIC' | 'PRIVATE';

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
  visibilityStatus: BuilderStoreVisibility;
  imageUrls?: string[];
};

export const getBuilderStores = async (params: BuilderStoreListParams = {}) => {
  const response = await apiClient.get<ApiResponse<BuilderStoreListResponse>>(
    '/api/v1/builder-stores',
    { params }
  );
  return response.data.data;
};

// 마이페이지 '저장한 상가 리스트' = 내가 북마크한 상가 목록.
// TODO(BE): 2026-07-02 기준 '내 북마크 목록' 전용 엔드포인트 미구현.
//   요청 스펙(제안): GET /api/v1/users/me/bookmarks?page&size&sort
//   응답: ApiResponse<BuilderStoreListResponse> (content=BuilderStoreSummaryResponse[], 항목은 bookmarked=true)
//   엔드포인트 확정되면 아래 경로만 교체.
export const getMyBookmarkedStores = async (
  params: BuilderStoreListParams = {}
) => {
  const response = await apiClient.get<ApiResponse<BuilderStoreListResponse>>(
    '/api/v1/users/me/bookmarks',
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

  if (response.data.length > 0) {
    return response.data;
  }

  // 폴백: dev DB에 자치구(SIGUNGU)가 아직 시딩되지 않아 빈 배열이 온다(2026-09-01 기준).
  // 법정동 467건에는 구 정보가 있으므로 구별 첫 법정동을 대표로 삼아 25개 구를 유도한다.
  // 유도된 행의 regionId·code는 법정동 것이지만, 계산기의 구→법정동 코드 변환은
  // sigungu 이름 매칭이라 그대로 동작한다. SIGUNGU가 시딩되면 이 경로는 타지 않는다.
  const legalDongs = await getSeoulLegalDongs();
  const representativeBySigungu = new Map<string, RegionResponse>();
  for (const dong of legalDongs) {
    if (!representativeBySigungu.has(dong.sigungu)) {
      representativeBySigungu.set(dong.sigungu, dong);
    }
  }
  return [...representativeBySigungu.values()];
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
  const response = await apiClient.post<
    ApiResponse<BuilderStoreDetailResponse>
  >('/api/v1/builder-stores', payload, {
    headers: await getCsrfHeaders(),
  });
  return response.data.data;
};

/** 저장한 상가를 '내 상가 만들기' 목록에 공개(공유)한다. */
export const updateBuilderStoreVisibility = async (
  builderStoreId: number,
  visibilityStatus: BuilderStoreVisibility
) => {
  const response = await apiClient.patch<
    ApiResponse<BuilderStoreDetailResponse>
  >(
    `/api/v1/builder-stores/${builderStoreId}`,
    { visibilityStatus },
    { headers: await getCsrfHeaders() }
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
