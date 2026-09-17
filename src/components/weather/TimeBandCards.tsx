import type { TimeBand, WeatherOverviewDistrict } from '@/api/weatherFeedTypes';
import { formatTimeBandRange } from '@/utils/timeBand';
import { GRADE_ICON, resolveGrade } from './weatherGradeStyle';

const CARD_BANDS: TimeBand[] = ['아침', '점심', '오후', '저녁'];

interface TimeBandCardsProps {
  district: string;
  selected: TimeBand;
  /** 시간대별 overview 스냅샷의 자치구 목록. 스냅샷이 없는 시간대는 빈 배열 */
  overviewByBand: Partial<Record<TimeBand, WeatherOverviewDistrict[]>>;
  onSelect: (band: TimeBand) => void;
}

/**
 * 선택 자치구의 시간대별 상권날씨.
 * overview 스냅샷은 서버가 현재 시간대만 생성하므로, 아직 집계되지 않은
 * 시간대는 값을 지어내지 않고 '집계 전'으로 표시한다.
 */
const TimeBandCards = ({
  district,
  selected,
  overviewByBand,
  onSelect,
}: TimeBandCardsProps) => (
  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
    {CARD_BANDS.map((band) => {
      const item = overviewByBand[band]?.find(
        (entry) => entry.district === district
      );
      const grade = resolveGrade(item?.grade);
      const isSelected = band === selected;

      return (
        <button
          key={band}
          type="button"
          onClick={() => onSelect(band)}
          aria-pressed={isSelected}
          className={`rounded-md border px-3 py-2.5 text-left transition ${
            isSelected
              ? 'border-blue-600 bg-[#f5f9ff]'
              : 'border-[#e5e8eb] bg-white hover:border-blue-600'
          }`}
        >
          <p className="text-[11px] font-medium text-gray-46">
            {band} {formatTimeBandRange(band)}
          </p>
          {item && item.opportunity_score !== null ? (
            <p className="mt-1 flex items-center gap-1 text-sm font-bold text-[#191f28]">
              {grade && (
                <img
                  src={GRADE_ICON[grade]}
                  alt=""
                  aria-hidden
                  className="h-4 w-4"
                />
              )}
              {item.grade ?? '미산출'}
              <span className="text-xs font-bold text-blue-600">
                · {item.opportunity_score}점
              </span>
            </p>
          ) : (
            <p className="mt-1 text-sm font-bold text-[#b0b8c1]">집계 전</p>
          )}
        </button>
      );
    })}
  </div>
);

export default TimeBandCards;
