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
// 로컬 개발: FastAPI에 CORS 미들웨어가 없어 브라우저 직접 호출이 차단되므로
// vite.config.ts의 /ai-api 프록시를 경유한다(.env에서 상대 경로로 지정).
// 배포 환경: 절대 URL을 주입하면 프록시 없이 직접 호출하므로, 그때는
// AI 서버에 CORS 허용 오리진 설정이 선행돼야 한다.
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

const aiClient = axios.create({ timeout: 30000 });

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
