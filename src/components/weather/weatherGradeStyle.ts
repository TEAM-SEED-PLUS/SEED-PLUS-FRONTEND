import type { WeatherGrade } from '@/api/weatherFeedTypes';

/** 날씨 등급별 지도 채움색 (지도와 범례가 공유) */
export const GRADE_FILL: Record<WeatherGrade, string> = {
  맑음: '#f8b64c',
  구름: '#d8dde5',
  흐림: '#8b95a1',
  비: '#c9e0ff',
  폭풍: '#5b6472',
};
