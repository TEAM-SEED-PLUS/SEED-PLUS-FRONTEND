import type { WeatherNarrative } from '@/api/weatherFeedTypes';
import WeatherNarrativeCard from './WeatherNarrativeCard';

interface WeatherNarrativeModalProps {
  district: string;
  narrative: WeatherNarrative;
  onClose: () => void;
}

/** 'AI 분석하기' — 판단·근거·추천 액션 전체를 모달로 보여준다 */
const WeatherNarrativeModal = ({
  district,
  narrative,
  onClose,
}: WeatherNarrativeModalProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
    role="dialog"
    aria-modal="true"
    aria-label={`${district} AI 분석`}
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-[520px]"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl font-light text-[#6b7684] shadow-sm transition hover:text-[#191f28]"
      >
        ×
      </button>
      <WeatherNarrativeCard narrative={narrative} />
    </div>
  </div>
);

export default WeatherNarrativeModal;
