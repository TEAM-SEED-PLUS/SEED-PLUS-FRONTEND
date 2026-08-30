// 상권날씨 Public Feed Schema v1
// 출처: SEED-PLUS-AI 레포 docs/weather_feed_schema_v1.md
// 이 타입은 AI 엔진이 Backend에 전달하는 단일 public 계약을 그대로 옮긴 것이다.
// 실제 API 연동 시 이 타입을 그대로 사용하고 mock만 교체하면 된다.

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
  district: string;
  date: string;
  time: string;
  time_band: TimeBand;
};

export type MarketWeather = {
  score: number;
  grade: WeatherGrade;
  emoji: string;
};

/** rule engine이 확정한 4대 지표 (0~100) */
export type WeatherIndicators = {
  inflow_pressure: number;
  spending_intent: number;
  competition_pressure: number;
  operational_risk: number;
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
  basis: 'requested_time' | 'previous_evening_reference';
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

export type WeatherFeed = {
  schema_version: string;
  query: WeatherFeedQuery;
  opportunity_score: number;
  market_weather: MarketWeather;
  indicators: WeatherIndicators;
  decision_tags: DecisionTag[];
  narrative: WeatherNarrative;
  data_quality: WeatherDataQuality;
  sources: WeatherSources;
  generated_at: string;
};

// ─────────────────────────────────────────────────────────────
// 아래는 아직 public schema에 없는 임시 계약이다.
// 업무지시 ⑤(행사·축제·공연·스포츠 카드 + 기획팀 제작 영상)를 그리려면
// 제목·기간·장소·이미지가 필요한데 schema v1의 sources.content에는 상태값만 있다.
// AI/DATA 담당자와 협의해 확정되면 이 블록을 schema 쪽으로 옮긴다.
// ─────────────────────────────────────────────────────────────

export type ContentItemType = 'festival' | 'performance' | 'sports' | 'video';

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
