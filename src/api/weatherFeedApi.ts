import axios from 'axios';
import { apiClient } from './httpClient';
import type {
  ApiContentItem,
  TimeBand,
  WeatherContentItem,
  WeatherFeed,
  WeatherOverviewResponse,
} from './weatherFeedTypes';

// 상권날씨는 Spring 백엔드가 같은 호스트의 AI(FastAPI)를 대신 호출해 준다(BE #49).
// 응답 본문은 FastAPI Public Feed Schema v1 그대로이고 Spring 공통 응답으로 감싸져 온다.
type ApiResponse<T> = {
  status: number | string;
  code: number;
  message: string;
  data: T;
};

type ApiErrorResponse = {
  status?: number | string;
  code?: number;
  message?: string;
};

/** BE가 FastAPI 연결 실패·타임아웃·오류 응답을 502로 바꿔 줄 때의 코드 */
const WEATHER_UPSTREAM_ERROR_CODE = 9600;

// 상세는 캐시가 없으면 AI 분석에 25초 이상 걸린다.
// BE가 FastAPI를 기다리는 시간보다 FE가 먼저 끊으면 정상 응답을 버리게 되므로 넉넉히 둔다.
// v1에서는 자동 재시도를 두지 않는다(AI/Data 권고).
const WEATHER_FEED_TIMEOUT_MS = 120000;

export type WeatherFeedParams = {
  district: string;
  /** YYYY-MM-DD. 생략하면 서버가 오늘로 처리한다 */
  date?: string;
  /** HH:MM (Asia/Seoul) */
  time?: string;
  timeBand?: TimeBand;
};

export const getWeatherFeed = async (
  { district, date, time, timeBand }: WeatherFeedParams,
  signal?: AbortSignal
) => {
  const response = await apiClient.get<ApiResponse<WeatherFeed>>(
    '/api/v1/weather-feeds',
    {
      params: { district, date, time, time_band: timeBand },
      signal,
      timeout: WEATHER_FEED_TIMEOUT_MS,
    }
  );
  return response.data.data;
};

export const getWeatherOverview = async (
  params: { date?: string; time?: string; timeBand?: TimeBand } = {},
  signal?: AbortSignal
) => {
  const response = await apiClient.get<ApiResponse<WeatherOverviewResponse>>(
    '/api/v1/weather-feeds/overview',
    {
      params: {
        date: params.date,
        time: params.time,
        time_band: params.timeBand,
      },
      signal,
    }
  );
  return response.data.data;
};

/** 서버 content.items를 화면용 카드 타입으로 변환한다 */
// 외부 수집 데이터라 javascript: 등이 섞여도 링크로 쓰지 않도록 http(s)만 통과시킨다.
export const toSafeLinkUrl = (value: string | null | undefined) => {
  if (!value) return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
};

export const toWeatherContentItems = (
  items: ApiContentItem[] | undefined
): WeatherContentItem[] =>
  (items ?? []).map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    period: item.period ?? undefined,
    place: item.place ?? undefined,
    thumbnailUrl: item.thumbnail_url ?? undefined,
    linkUrl: toSafeLinkUrl(item.link_url),
  }));

export const getWeatherApiErrorMessage = (error: unknown) => {
  if (axios.isCancel(error)) {
    return '';
  }

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.code === 'ECONNABORTED') {
      return '상권날씨 분석이 지연되고 있습니다. 잠시 후 다시 시도해주세요.';
    }

    if (!error.response) {
      return '상권날씨 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
    }

    const { status, data } = error.response;

    if (status === 502 || data?.code === WEATHER_UPSTREAM_ERROR_CODE) {
      return '상권날씨 분석 서버가 응답하지 않습니다. 잠시 후 다시 시도해주세요.';
    }

    if (status === 400 || status === 422) {
      return '조회 조건이 올바르지 않습니다. 지역과 시간대를 확인해주세요.';
    }

    return '상권날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '상권날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
};
