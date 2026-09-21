// 고객 지원(공지사항·FAQ) 화면 데이터 타입.
// 1차는 관리자 CMS 없이 기획팀이 작성한 내용을 개발 측에서 직접 등록하므로
// 별도 API 없이 src/content 안의 정적 데이터를 읽는다. 백엔드가 붙으면 같은 형태로 매핑한다.

export const NOTICE_CATEGORIES = [
  '서비스',
  '업데이트',
  '점검',
  '이벤트',
] as const;
export type NoticeCategory = (typeof NOTICE_CATEGORIES)[number];

export type Notice = {
  id: string;
  category: NoticeCategory;
  title: string;
  /** 게시일 (YYYY.MM.DD) */
  date: string;
  /** 중요 공지는 카테고리와 무관하게 목록 맨 위에 고정된다 */
  isImportant?: boolean;
  /** 본문 문단 */
  body: string[];
};

/** FAQ 대상 구분 — 시안의 두 칼럼 */
export type FaqAudience = 'general' | 'partner';

export const FAQ_AUDIENCE_LABEL: Record<FaqAudience, string> = {
  general: '일반 사용자',
  partner: '공인중개사·전문가·파트너',
};

export type FaqItem = {
  id: string;
  audience: FaqAudience;
  category: string;
  question: string;
  answer: string[];
};
