import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { SpinnerIcon } from '@/components/ui/icons';

const formatElapsed = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}분 ${seconds}초 경과` : `${seconds}초 경과`;
};

interface LoadingOverlayProps {
  /** 무엇을 하는 중인지 (예: '실시간 공공데이터 연동을 통해 계산 중입니다.') */
  message: string;
  /** 예상 소요 시간 안내 (예: '최대 5분이 소요될 수 있습니다.') */
  description?: string;
  onCancel?: () => void;
}

/**
 * 실시간 수집 기반 요청 공통 로딩 오버레이.
 * 응답이 수십 초~수 분 걸려 정지 화면을 오류로 오인하기 쉬우므로,
 * 화면을 덮고 경과 시간과 취소 수단을 함께 제공한다.
 * 모달 컨테이너의 backdrop-filter가 fixed의 기준을 컨테이너로 바꿔
 * 스크롤 시 오버레이가 밀려나므로, body 포털로 뷰포트에 직접 붙인다.
 */
const LoadingOverlay = ({
  message,
  description,
  onCancel,
}: LoadingOverlayProps) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(
      () => setElapsedSeconds((current) => current + 1),
      1000
    );
    return () => window.clearInterval(timerId);
  }, []);

  return createPortal(
    <div
      role="status"
      className="fixed inset-0 z-50 flex touch-none flex-col items-center justify-center gap-4 overscroll-contain bg-[#191f28]/50 px-6 text-center"
    >
      <SpinnerIcon className="h-12 w-12 text-white" />
      <p className="text-sm leading-relaxed font-bold text-white">
        {message}
        {description && (
          <>
            <br />
            {description}
          </>
        )}
      </p>
      <p className="text-xs font-medium text-white/80">
        {formatElapsed(elapsedSeconds)}
      </p>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-1 rounded-md border border-white/60 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10"
        >
          취소
        </button>
      )}
    </div>,
    document.body
  );
};

export default LoadingOverlay;
