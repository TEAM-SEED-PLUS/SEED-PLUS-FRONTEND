import type { WeatherGrade } from '@/api/weatherFeedTypes';
import cloud01 from '@/assets/weather/cloud-01.svg';
import cloud02 from '@/assets/weather/cloud-02.svg';
import cloud04 from '@/assets/weather/cloud-04.svg';
import sun03 from '@/assets/weather/sun-03.svg';

// 색상·아이콘은 Figma 상권날씨 범례(404:1180)의 값을 그대로 사용한다.
// 맑음 state/yellow #ffbe55 / 구름 gray-300 #c4c7cb / 흐림 gray-700 #596170 / 비 primary-100 #d6e6fd

/** 등급별 지도 채움색 (지도와 범례가 공유) */
export const GRADE_FILL: Record<WeatherGrade, string> = {
  맑음: '#ffbe55',
  구름: '#c4c7cb',
  흐림: '#596170',
  비: '#d6e6fd',
  // 폭풍은 시안 범례에 없어 흐림보다 어두운 톤으로 확장했다.
  폭풍: '#3a4150',
};

/** 등급별 날씨 아이콘 (Figma 아이콘 컴포넌트) */
export const GRADE_ICON: Record<WeatherGrade, string> = {
  맑음: sun03,
  구름: cloud01,
  흐림: cloud02,
  비: cloud04,
  폭풍: cloud02,
};

/** 시안 범례에 노출되는 등급 (폭풍 제외) */
export const LEGEND_GRADES: WeatherGrade[] = ['맑음', '구름', '흐림', '비'];
