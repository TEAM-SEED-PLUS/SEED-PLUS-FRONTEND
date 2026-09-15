// 상권날씨 Public Feed Schema v1
// 출처: SEED-PLUS-AI 레포 app/models.py (2026-09-15 기준 실제 응답 계약)
// 지표류는 수집 실패 시 null이 올 수 있어 nullable로 둔다. 화면에서는
// null을 0이 아니라 '미산출'로 표기해야 한다.

export type WeatherGrade = '맑음' | '구름' | '흐림' | '비' | '폭풍';

/** 기획 확정 시간대. 심야(00~06)는 직전 저녁 참고값으로 표기된다. */
export type TimeBand = '아침' | '점심' | '오후' | '저녁' | '심야';

export type DecisionTag =
  | '진입 유리'
  | '관망 권장'
  | '기회 구간'
  | '과열 상태'
  | '리스크 주의'
  | '특정 업종만 유리';

export type DataQualityStatus = 'ok' | 'partial' | 'fallback' | 'no_data';

export type SourceStatus = 'ok' | 'complete' | 'partial' | 'no_data' | 'failed';

export type WeatherFeedQuery = {
  district: string | null;
  date: string | null;
  time: string | null;
  time_band: TimeBand | string | null;
};

export type MarketWeather = {
  score: number | null;
  /** 서버가 등급 문자열을 확장할 수 있어 union으로 좁히지 않는다 */
  grade: WeatherGrade | string | null;
  emoji: string | null;
};

/** rule engine이 확정한 4대 지표 (0~100) */
export type WeatherIndicators = {
  inflow_pressure: number | null;
  spending_intent: number | null;
  competition_pressure: number | null;
  operational_risk: number | null;
};

export type WeatherNarrative = {
  /** LLM 호출 성공 여부. 실패해도 문장은 항상 존재한다. */
  generation_mode: 'rule_fallback' | 'hybrid_llm';
  judgement_sentence: string;
  basis_sentence: string;
  recommended_actions: string[];
};

export type ScoreContext = {
  /** 심야에는 previous_evening_reference로 직전 저녁 값을 참고 표기한다. */
  basis?: 'requested_time' | 'previous_evening_reference' | string | null;
  reference_date?: string;
  reference_time_band?: string;
  reference_start?: string;
  reference_end?: string;
  representative_time?: string;
};

export type WeatherDataQuality = {
  status: DataQualityStatus;
  data_insufficient: boolean;
  /** UI에 그대로 노출할 확정 문구 (예: 심야 안내, 데이터 부족 안내) */
  badges: string[];
  fallback_sources: string[];
  no_data_sources?: string[];
  stale_sources?: string[];
  skipped_sources?: string[];
  failed_sources?: string[];
  empty_sources?: string[];
  score_context: ScoreContext;
};

export type SourceInfo = {
  source: string;
  status: SourceStatus;
  fallback?: boolean;
  [key: string]: unknown;
};

export type WeatherSources = {
  weather?: SourceInfo;
  content?: Record<string, SourceInfo>;
  special_day?: SourceInfo;
  footfall?: SourceInfo;
  tourism?: SourceInfo;
  commercial_store?: SourceInfo;
  consumption_baseline?: SourceInfo;
  realtime_commerce?: SourceInfo;
  competition_sdot?: SourceInfo;
};

/** 서버가 내려주는 행사·공연·축제 카드 (schema v1의 content 블록) */
export type ApiContentItem = {
  id: string;
  type: 'festival' | 'event' | 'performance' | 'sports';
  title: string;
  period: string | null;
  place: string | null;
  thumbnail_url: string | null;
};

export type WeatherFeed = {
  schema_version: string;
  query: WeatherFeedQuery;
  opportunity_score: number | null;
  market_weather: MarketWeather;
  indicators: WeatherIndicators;
  /** 서버가 태그를 확장할 수 있어 string으로 받는다 */
  decision_tags: (DecisionTag | string)[];
  narrative: WeatherNarrative;
  data_quality: WeatherDataQuality;
  sources: WeatherSources;
  content?: { items: ApiContentItem[] };
  generated_at: string;
};

/** GET /api/v1/weather-feeds/overview — 자치구별 등급 일괄 조회 */
export type WeatherOverviewDistrict = {
  district: string;
  opportunity_score: number | null;
  grade: string | null;
  emoji: string | null;
};

export type WeatherOverviewResponse = {
  schema_version: string;
  query: {
    date: string | null;
    time?: string | null;
    time_band?: string | null;
  };
  status: 'ok' | 'partial' | 'failed' | 'no_data' | 'stale';
  districts: WeatherOverviewDistrict[];
  generated_at: string;
  source_time: string | null;
  age_minutes: number | null;
  fresh_ttl_minutes: number;
  is_fresh: boolean;
};

// ─────────────────────────────────────────────────────────────
// 화면 전용 표현 타입.
// 서버 content.items(ApiContentItem)를 화면용으로 변환해 쓴다.
// 'video'(기획팀 제작 영상)와 linkUrl·viewCount는 아직 서버 계약에 없어
// 화면에서만 존재한다. AI 쪽에 추가되면 매퍼에서 채우면 된다.
// ─────────────────────────────────────────────────────────────

export type ContentItemType =
  | 'festival'
  | 'event'
  | 'performance'
  | 'sports'
  | 'video';

export type WeatherContentItem = {
  id: string;
  type: ContentItemType;
  title: string;
  /** 기간 또는 일시 표기 문자열 */
  period?: string;
  place?: string;
  thumbnailUrl?: string;
  linkUrl?: string;
  /** 영상 콘텐츠에만 사용 */
  viewCount?: number;
};
