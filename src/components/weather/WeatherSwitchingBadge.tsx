import { SpinnerIcon } from '@/components/ui/icons';
import { useElapsedSeconds } from '@/hooks';
import { formatElapsed } from '@/utils/formatElapsed';

interface WeatherSwitchingBadgeProps {
  district: string;
}

/**
 * 자치구·시간대를 바꾼 뒤 새 결과를 받는 동안, 흐리게 남겨둔 이전 결과 위에 띄우는 표시.
 * 섹션 전체를 스피너로 바꾸지 않아 화면이 깜빡이지 않는다.
 * 요청이 바뀔 때 경과 시간을 0부터 다시 세도록 부모에서 key로 다시 마운트한다.
 */
const WeatherSwitchingBadge = ({ district }: WeatherSwitchingBadgeProps) => {
  const elapsedSeconds = useElapsedSeconds();

  return (
    <div
      role="status"
      className="absolute left-1/2 top-16 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-bold text-[#191f28] shadow-[0_4px_16px_rgba(25,31,40,0.16)]"
    >
      <SpinnerIcon className="h-4 w-4 text-blue-600" />
      {district} 분석 중
      <span className="font-medium text-[#8b95a1]">
        {formatElapsed(elapsedSeconds)}
      </span>
    </div>
  );
};

export default WeatherSwitchingBadge;
