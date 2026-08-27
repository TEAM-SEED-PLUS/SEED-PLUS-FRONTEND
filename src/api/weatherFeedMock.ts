// 상권날씨 Mock 데이터.
// AI/DATA 측 실제 API가 나오기 전까지 화면 개발·상태 검증용으로 사용한다.
// 값은 schema v1 예시를 따르며 production snapshot이 아니다.
import type { WeatherContentItem, WeatherFeed } from './weatherFeedTypes';

/** 정상 응답 */
export const mockWeatherFeed: WeatherFeed = {
  schema_version: '1.0',
  query: {
    district: '종로구',
    date: '2026-08-27',
    time: '13:00',
    time_band: '점심',
  },
  opportunity_score: 72,
  market_weather: { score: 72, grade: '구름', emoji: '⛅' },
  indicators: {
    inflow_pressure: 74,
    spending_intent: 66,
    competition_pressure: 48,
    operational_risk: 32,
  },
  decision_tags: ['진입 유리', '기회 구간'],
  narrative: {
    generation_mode: 'hybrid_llm',
    judgement_sentence:
      '오피스 유입이 견조해 점심 시간대 회전율을 높이기 좋은 구간입니다.',
    basis_sentence:
      '유입 압력 74점과 소비 의도 66점이 동시에 높고, 경쟁 압박은 48점으로 과열 구간에 도달하지 않았습니다.',
    recommended_actions: [
      '점심 회전형 단품 메뉴를 전면에 배치하세요.',
      '12~13시 대기 동선을 분리해 체류 시간을 줄이세요.',
      '오후 유입 감소에 대비해 테이크아웃 프로모션을 준비하세요.',
    ],
  },
  data_quality: {
    status: 'ok',
    data_insufficient: false,
    badges: [],
    fallback_sources: [],
    score_context: { basis: 'requested_time' },
  },
  sources: {
    weather: { source: 'weather', status: 'ok' },
    content: {
      festival: { source: 'festival', status: 'ok' },
      event: { source: 'event', status: 'ok' },
      performance: { source: 'performance', status: 'ok' },
      sports: { source: 'sports', status: 'ok' },
    },
    footfall: { source: 'oa21285', status: 'ok' },
    tourism: { source: 'tourapi', status: 'ok' },
    commercial_store: { source: 'commercial_store', status: 'complete' },
  },
  generated_at: '2026-08-27T13:05:00+09:00',
};

/** 일부 소스 결측 — 신뢰도 배지 노출 */
export const mockWeatherFeedPartial: WeatherFeed = {
  ...mockWeatherFeed,
  query: { ...mockWeatherFeed.query, district: '중랑구' },
  opportunity_score: 51,
  market_weather: { score: 51, grade: '흐림', emoji: '☁️' },
  indicators: {
    inflow_pressure: 48,
    spending_intent: 45,
    competition_pressure: 61,
    operational_risk: 44,
  },
  decision_tags: ['관망 권장'],
  narrative: {
    generation_mode: 'rule_fallback',
    judgement_sentence: '현재 시간대에는 보수적 운영이 적합한 구간입니다.',
    basis_sentence: '기회 점수와 네 지표를 종합했습니다.',
    recommended_actions: [
      '고정비 지출을 재점검하세요.',
      '재방문 고객 중심으로 운영하세요.',
      '데이터가 보강되는 시간대에 다시 확인하세요.',
    ],
  },
  data_quality: {
    status: 'partial',
    data_insufficient: true,
    badges: ['일부 데이터가 부족해 대체값 또는 기본값을 사용했습니다'],
    fallback_sources: ['footfall', 'tourism', 'realtime_commerce'],
    score_context: { basis: 'requested_time' },
  },
};

/** 심야 — 직전 저녁 참고값 */
export const mockWeatherFeedLateNight: WeatherFeed = {
  ...mockWeatherFeed,
  query: {
    district: '종로구',
    date: '2026-08-27',
    time: '03:20',
    time_band: '심야',
  },
  opportunity_score: 58,
  market_weather: { score: 58, grade: '흐림', emoji: '☁️' },
  indicators: {
    inflow_pressure: 55,
    spending_intent: 52,
    competition_pressure: 50,
    operational_risk: 38,
  },
  decision_tags: ['관망 권장'],
  data_quality: {
    status: 'partial',
    data_insufficient: true,
    badges: [
      '심야 시간대는 데이터가 제한적입니다 (06시부터 갱신)',
      '일부 데이터가 부족해 대체값 또는 기본값을 사용했습니다',
    ],
    fallback_sources: ['tourism', 'realtime_commerce'],
    score_context: {
      basis: 'previous_evening_reference',
      reference_date: '2026-08-26',
      reference_time_band: '저녁',
      reference_start: '20:00',
      reference_end: '24:00',
      representative_time: '20:00',
    },
  },
};

/** 수집 실패 — 점수를 신뢰할 수 없는 상태 */
export const mockWeatherFeedNoData: WeatherFeed = {
  ...mockWeatherFeed,
  query: { ...mockWeatherFeed.query, district: '금천구' },
  data_quality: {
    status: 'no_data',
    data_insufficient: true,
    badges: ['데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요'],
    fallback_sources: ['footfall', 'tourism', 'realtime_commerce', 'weather'],
    score_context: { basis: 'requested_time' },
  },
};

/**
 * 행사·관광·영상 콘텐츠 Mock.
 * schema v1에는 목록 필드가 없어 임시 구조로 구성했다(협의 후 확정 예정).
 */
export const mockWeatherContents: WeatherContentItem[] = [
  {
    id: 'f1',
    type: 'festival',
    title: '광화문 가을 북페스티벌',
    period: '08.27 ~ 09.03',
    place: '광화문광장',
  },
  {
    id: 'p1',
    type: 'performance',
    title: '세종문화회관 기획 공연',
    period: '08.29 19:30',
    place: '세종문화회관 대극장',
  },
  {
    id: 's1',
    type: 'sports',
    title: '프로농구 홈경기',
    period: '08.30 17:00',
    place: '잠실실내체육관',
  },
  {
    id: 'v1',
    type: 'video',
    title: '종로 상권 뜨는 골목 리포트',
    viewCount: 42000,
  },
  {
    id: 'v2',
    type: 'video',
    title: '점심 회전율 높이는 매장 운영법',
    viewCount: 28000,
  },
];

/** 자치구별 날씨 등급 Mock — 지도 색상 표시용 */
export const mockDistrictGrades: Record<string, WeatherFeed['market_weather']> =
  {
    종로구: { score: 72, grade: '구름', emoji: '⛅' },
    중구: { score: 81, grade: '맑음', emoji: '☀️' },
    용산구: { score: 84, grade: '맑음', emoji: '☀️' },
    성동구: { score: 69, grade: '구름', emoji: '⛅' },
    광진구: { score: 63, grade: '흐림', emoji: '☁️' },
    동대문구: { score: 55, grade: '흐림', emoji: '☁️' },
    중랑구: { score: 51, grade: '흐림', emoji: '☁️' },
    성북구: { score: 58, grade: '흐림', emoji: '☁️' },
    강북구: { score: 47, grade: '비', emoji: '🌧️' },
    도봉구: { score: 44, grade: '비', emoji: '🌧️' },
    노원구: { score: 52, grade: '흐림', emoji: '☁️' },
    은평구: { score: 49, grade: '비', emoji: '🌧️' },
    서대문구: { score: 66, grade: '구름', emoji: '⛅' },
    마포구: { score: 83, grade: '맑음', emoji: '☀️' },
    양천구: { score: 57, grade: '흐림', emoji: '☁️' },
    강서구: { score: 61, grade: '흐림', emoji: '☁️' },
    구로구: { score: 53, grade: '흐림', emoji: '☁️' },
    금천구: { score: 33, grade: '폭풍', emoji: '🌪️' },
    영등포구: { score: 76, grade: '구름', emoji: '⛅' },
    동작구: { score: 60, grade: '흐림', emoji: '☁️' },
    관악구: { score: 56, grade: '흐림', emoji: '☁️' },
    서초구: { score: 79, grade: '구름', emoji: '⛅' },
    강남구: { score: 88, grade: '맑음', emoji: '☀️' },
    송파구: { score: 74, grade: '구름', emoji: '⛅' },
    강동구: { score: 64, grade: '흐림', emoji: '☁️' },
  };
