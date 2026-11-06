// 고객 지원(공지사항·FAQ·문의하기) 화면 데이터 타입.
// 백엔드 enum 값을 그대로 쓰고, 화면에 보이는 한글은 아래 라벨 표로 바꾼다.

export const NOTICE_CATEGORIES = [
  'SERVICE',
  'UPDATE',
  'MAINTENANCE',
  'EVENT',
] as const;
export type NoticeCategory = (typeof NOTICE_CATEGORIES)[number];

export const NOTICE_CATEGORY_LABEL: Record<NoticeCategory, string> = {
  SERVICE: '서비스',
  UPDATE: '업데이트',
  MAINTENANCE: '점검',
  EVENT: '이벤트',
};

export type Notice = {
  id: number;
  category: NoticeCategory;
  title: string;
  /** 중요 공지는 카테고리와 무관하게 목록 맨 위에 고정된다 */
  pinned: boolean;
  /** ISO 8601 게시 시각 */
  publishedAt: string;
};

export type NoticeDetail = Notice & {
  /** 줄바꿈이 포함된 본문 */
  content: string;
};

/** FAQ 대상 구분 — 시안의 두 칼럼 */
export const FAQ_GROUPS = ['GENERAL', 'PARTNER'] as const;
export type FaqGroup = (typeof FAQ_GROUPS)[number];

export const FAQ_GROUP_LABEL: Record<FaqGroup, string> = {
  GENERAL: '일반 사용자',
  PARTNER: '공인중개사·전문가·파트너',
};

export const FAQ_CATEGORIES = [
  'SERVICE_USE',
  'ANALYSIS',
  'ACCOUNT_AND_OTHER',
  'COOPERATION',
] as const;
export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export const FAQ_CATEGORY_LABEL: Record<FaqCategory, string> = {
  SERVICE_USE: '서비스 이용',
  ANALYSIS: '분석 기능',
  ACCOUNT_AND_OTHER: '계정 및 기타',
  COOPERATION: '제휴·협력',
};

export type FaqItem = {
  id: number;
  group: FaqGroup;
  category: FaqCategory;
  question: string;
  /** 줄바꿈이 포함된 답변 */
  answer: string;
  displayOrder: number;
};

export const INQUIRY_TYPES = [
  'SERVICE_USE',
  'PARTNERSHIP',
  'SERVICE_ERROR',
  'OTHER',
] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const INQUIRY_TYPE_LABEL: Record<InquiryType, string> = {
  SERVICE_USE: '서비스 이용',
  PARTNERSHIP: '제휴·협력',
  SERVICE_ERROR: '서비스 오류',
  OTHER: '기타',
};

export type CreateInquiryRequest = {
  type: InquiryType;
  name: string;
  email: string;
  title: string;
  content: string;
  personalInformationConsent: boolean;
};

const publishedDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** 게시 시각을 시안 표기(YYYY.MM.DD, 한국 시간)로 바꾼다 */
export const formatPublishedDate = (publishedAt: string) => {
  const parts = publishedDateFormatter.formatToParts(new Date(publishedAt));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}.${get('month')}.${get('day')}`;
};
