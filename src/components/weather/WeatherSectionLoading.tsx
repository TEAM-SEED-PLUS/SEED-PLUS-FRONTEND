import { useEffect, useState } from 'react';
import { SpinnerIcon } from '@/components/ui/icons';

const formatElapsed = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}분 ${seconds}초 경과` : `${seconds}초 경과`;
};

interface WeatherSectionLoadingProps {
  district: string;
}

/**
 * 상세 섹션 안에서만 도는 로딩 표시.
 * 화면을 막지 않아 조회 중에도 다른 구·시간대를 고를 수 있고(이전 요청은 자동 취소),
 * 응답이 수십 초 걸려 멈춘 것으로 오인하지 않도록 경과 시간을 함께 보여준다.
 * 요청이 바뀔 때 경과 시간을 0부터 다시 세도록 부모에서 key로 다시 마운트한다.
 */
const WeatherSectionLoading = ({ district }: WeatherSectionLoadingProps) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(
      () => setElapsedSeconds((current) => current + 1),
      1000
    );
    return () => window.clearInterval(timerId);
  }, []);

  return (
    <section
      role="status"
      className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-lg bg-white px-5 py-14 text-center shadow-sm"
    >
      <SpinnerIcon className="h-10 w-10 text-blue-600" />
      <p className="text-sm font-bold leading-relaxed text-[#191f28]">
        {district} 상권날씨를 분석 중입니다.
      </p>
      <p className="text-xs text-gray-46">
        실시간 공공데이터를 연동해 최대 1분이 소요될 수 있습니다.
      </p>
      <p className="text-xs font-medium text-[#8b95a1]">
        {formatElapsed(elapsedSeconds)}
      </p>
    </section>
  );
};

export default WeatherSectionLoading;
