import { useEffect, useState } from 'react';
import { SpinnerIcon } from '@/components/ui/icons';

const formatElapsed = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}분 ${seconds}초 경과` : `${seconds}초 경과`;
};

interface CalculationLoadingOverlayProps {
  onCancel: () => void;
}

/**
 * 계산기 공통 로딩 오버레이.
 * 실시간 수집 기반 분석은 최대 5분까지 걸릴 수 있어, 화면을 덮고
 * 경과 시간과 취소 수단을 함께 제공해 오류로 오인하지 않게 한다.
 */
const CalculationLoadingOverlay = ({
  onCancel,
}: CalculationLoadingOverlayProps) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(
      () => setElapsedSeconds((current) => current + 1),
      1000
    );
    return () => window.clearInterval(timerId);
  }, []);

  return (
    <div
      role="status"
      className="fixed inset-0 z-50 flex touch-none flex-col items-center justify-center gap-4 overscroll-contain bg-[#191f28]/50 px-6 text-center"
    >
      <SpinnerIcon className="h-12 w-12 text-white" />
      <p className="text-sm leading-relaxed font-bold text-white">
        실시간 공공데이터 연동을 통해 계산 중입니다.
        <br />
        최대 5분이 소요될 수 있습니다.
      </p>
      <p className="text-xs font-medium text-white/80">
        {formatElapsed(elapsedSeconds)}
      </p>
      <button
        type="button"
        onClick={onCancel}
        className="mt-1 rounded-md border border-white/60 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10"
      >
        취소
      </button>
    </div>
  );
};

export default CalculationLoadingOverlay;
