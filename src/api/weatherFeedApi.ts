import axios from 'axios';
import { getEnv } from '@/utils/env';
import type {
  ApiContentItem,
  TimeBand,
  WeatherContentItem,
  WeatherFeed,
  WeatherOverviewResponse,
} from './weatherFeedTypes';

// 상권날씨 데이터는 백엔드를 거치지 않고 AI(FastAPI) 서비스를 FE가 직접 호출한다.
// 인증·CSRF가 없는 별개 서비스라 httpClient(apiClient)를 재사용하지 않는다.
//
// 배포 환경의 base URL은 인프라가 주입한다(2026-09-16 기준).
//   dev  VITE_DEV_AI_API_BASE_URL  = http://<dev-host>:8000/
//   prod VITE_PROD_AI_API_BASE_URL = https://www.seedplusai.com/ai/  (Nginx 프록시 → same-origin)
// 로컬 개발: FastAPI에 CORS 미들웨어가 없어 브라우저 직접 호출이 차단되므로
// vite.config.ts의 /ai 프록시를 경유한다(.env에서 상대 경로로 지정).
const getAiBaseUrl = () => {
  const appEnv = getEnv('VITE_APP_ENV') || 'development';
  const baseUrl =
    appEnv === 'production'
      ? getEnv('VITE_PROD_AI_API_BASE_URL')
      : getEnv('VITE_DEV_AI_API_BASE_URL');

  if (!baseUrl) {
    throw new Error(
      `상권날씨 AI 서버 주소가 설정되지 않았습니다. ${
        appEnv === 'production'
          ? 'VITE_PROD_AI_API_BASE_URL'
          : 'VITE_DEV_AI_API_BASE_URL'
      }를 확인해주세요.`
    );
  }

  return baseUrl.replace(/\/+$/, '');
};

// 상권날씨 분석은 실측 25초 이상 걸리고 인프라(Nginx)도 read 600초로 열어두었다.
// 기본 타임아웃(30초)이면 부하 시 정상 응답을 끊어버리므로 여유 있게 잡는다.
// v1에서는 자동 재시도를 두지 않는다(AI/Data 권고).
const aiClient = axios.create({ timeout: 600000 });

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
  const response = await aiClient.get<WeatherFeed>(
    `${getAiBaseUrl()}/api/v1/weather-feeds`,
    {
      params: { district, date, time, time_band: timeBand },
      signal,
    }
  );
  return response.data;
};

export const getWeatherOverview = async (
  params: { date?: string; time?: string; timeBand?: TimeBand } = {},
  signal?: AbortSignal
) => {
  const response = await aiClient.get<WeatherOverviewResponse>(
    `${getAiBaseUrl()}/api/v1/weather-feeds/overview`,
    {
      params: {
        date: params.date,
        time: params.time,
        time_band: params.timeBand,
      },
      signal,
    }
  );
  return response.data;
};

/** 서버 content.items를 화면용 카드 타입으로 변환한다 */
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
  }));

export const getWeatherApiErrorMessage = (error: unknown) => {
  if (axios.isCancel(error)) {
    return '';
  }

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return '상권날씨 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
    }

    if (error.response.status === 422) {
      return '조회 조건이 올바르지 않습니다. 지역과 시간대를 확인해주세요.';
    }

    return '상권날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '상권날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
};
