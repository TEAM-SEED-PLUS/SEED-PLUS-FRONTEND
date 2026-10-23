import { apiClient } from './httpClient';
import type {
  CreateInquiryRequest,
  FaqItem,
  Notice,
  NoticeDetail,
} from '@/content/supportTypes';

// 고객지원 API(BE #55). 모두 비로그인 접근이 허용되고 CSRF 대상이 아니다.
type ApiResponse<T> = {
  status: number | string;
  code: number;
  message: string;
  data: T;
};

type PageResponse<T> = {
  content: T[];
  pageInfo: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    isLast: boolean;
  };
};

// 공지·FAQ는 수십 건 수준이라 한 번에 받아 카테고리 필터는 화면에서 처리한다.
// BE 허용 최대 size가 100이다.
const SUPPORT_PAGE_SIZE = 100;

/** 공지 목록 — 중요 공지 먼저, 그 안에서 최신 게시일 순으로 내려온다 */
export const fetchNotices = async () => {
  const response = await apiClient.get<ApiResponse<PageResponse<Notice>>>(
    '/api/v1/notices',
    { params: { size: SUPPORT_PAGE_SIZE } }
  );
  return response.data.data.content;
};

export const fetchNotice = async (noticeId: number) => {
  const response = await apiClient.get<ApiResponse<NoticeDetail>>(
    `/api/v1/notices/${noticeId}`
  );
  return response.data.data;
};

/** FAQ 목록 — displayOrder 순으로 내려온다 */
export const fetchFaqs = async () => {
  const response = await apiClient.get<ApiResponse<PageResponse<FaqItem>>>(
    '/api/v1/faqs',
    { params: { size: SUPPORT_PAGE_SIZE } }
  );
  return response.data.data.content;
};

/** 문의 접수 — BE가 운영 메일로 전달하고 문의자 이메일을 Reply-To로 둔다 */
export const createInquiry = async (payload: CreateInquiryRequest) => {
  await apiClient.post('/api/v1/inquiries', payload);
};
