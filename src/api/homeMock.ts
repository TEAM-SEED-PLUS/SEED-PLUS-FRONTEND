// 홈 화면 Mock 데이터.
// 피그마 '홈화면'(686:680) 구성을 따르며, 상권날씨 외 영역은 아직 API가 없어 임시값이다.

/** 상단 실시간 신호 배너 */
export const mockSignalBanner = {
  label: '신호 감지',
  message:
    '실시간 상권 감지 | 종로구 익선동 저녁 유입 32% 상승했어요 · 카페/주점 소비 의도 상승',
  elapsed: '방금 전',
};

export type TimeSlotCard = {
  id: string;
  band: string;
  range: string;
  emoji: string;
  title: string;
  metrics: { label: string; value: string; up?: boolean }[];
  highlight?: boolean;
};

/** 선택 자치구의 시간대별 상권 흐름 */
export const mockTimeSlots: TimeSlotCard[] = [
  {
    id: 'morning',
    band: '아침',
    range: '08:00~10:59',
    emoji: '🏢',
    title: '광화문 오피스 유입',
    metrics: [
      { label: '유입', value: '12%', up: true },
      { label: '체류', value: '62분' },
    ],
  },
  {
    id: 'lunch',
    band: '점심',
    range: '11:00~13:59',
    emoji: '🍚',
    title: '종각 식음료 소비',
    metrics: [
      { label: '매출', value: '18%', up: true },
      { label: '결제', value: '21%', up: true },
    ],
    highlight: true,
  },
  {
    id: 'afternoon',
    band: '오후',
    range: '14:00~17:59',
    emoji: '📷',
    title: '인사동 관광 흐름',
    metrics: [
      { label: '유입', value: '9%', up: true },
      { label: '관광비중', value: '34%' },
    ],
  },
  {
    id: 'evening',
    band: '저녁',
    range: '18:00~22:00',
    emoji: '🍶',
    title: '익선동 체류시간 증가',
    metrics: [
      { label: '체류', value: '22%', up: true },
      { label: '재방문', value: '15%', up: true },
    ],
  },
];

/** 주간 브리핑 막대 그래프 */
export const mockWeeklyBriefing = {
  title: '주간 브리핑',
  subtitle: '이벤트 분석',
  bars: [
    { label: '1월', value: 20 },
    { label: '2월', value: 40 },
    { label: '3월', value: 35 },
    { label: '4월', value: 50, active: true },
    { label: '5월', value: 40 },
    { label: '6월', value: 32 },
  ],
  summary: [
    { label: '유입', value: '15%' },
    { label: '매출', value: '12%' },
  ],
};

/** 실시간 채팅 미리보기 */
export const mockChatMessages = [
  { id: 1, name: '독립문 행운이', text: '독립문역 근처 삼겹살 맛집 추천점요!' },
  {
    id: 2,
    name: '안국베이커리',
    text: '오늘 안국역 유동인구 역대급이네요 줄 대박...',
  },
  {
    id: 3,
    name: '안국베이커리',
    text: '오늘 안국역 유동인구 역대급이네요 줄 대박...',
  },
  {
    id: 4,
    name: '안국베이커리',
    text: '오늘 안국역 유동인구 역대급이네요 줄 대박...',
  },
];

/** 지금 뜨는 소식 (영상 콘텐츠) */
export const mockTrendingVideos = [
  { id: 'n1', title: '홍대 상권 뜨는 곳', views: '4.2만회' },
  { id: 'n2', title: '성수동 카페 매출 정보', views: '2.8만회' },
  { id: 'n3', title: '강남 맛집 분석', views: '5.1만회' },
  { id: 'n4', title: '이태원 주말 클럽 트렌드', views: '1.9만회' },
  { id: 'n5', title: '망원시장 숨은 맛집 투어', views: '3.4만회' },
  { id: 'n6', title: '대학로 공연가 실시간 상황', views: '1.2만회' },
];
