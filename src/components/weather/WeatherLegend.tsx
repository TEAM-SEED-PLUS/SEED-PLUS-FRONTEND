import { GRADE_FILL, GRADE_ICON, LEGEND_GRADES } from './weatherGradeStyle';

interface WeatherLegendProps {
  className?: string;
}

/**
 * 상권날씨 범례.
 * Figma 404:1180 스펙 그대로: 흰 배경 + #e1e4eb 테두리, 항목 간격 21px,
 * 색상칩 18px(radius 6) + 아이콘 24px + Pretendard 16px(-0.64px 자간).
 */
const WeatherLegend = ({ className = '' }: WeatherLegendProps) => (
  <div
    className={`inline-flex items-center gap-[21px] rounded-[4px] border border-[#e1e4eb] bg-white p-[10px] ${className}`}
  >
    {LEGEND_GRADES.map((grade) => (
      <div key={grade} className="flex shrink-0 items-center gap-[4px]">
        <span
          aria-hidden
          className="h-[18px] w-[18px] shrink-0 rounded-[6px]"
          style={{ backgroundColor: GRADE_FILL[grade] }}
        />
        <span className="flex shrink-0 items-center gap-[2px]">
          <img src={GRADE_ICON[grade]} alt="" className="h-6 w-6 shrink-0" />
          <span className="text-[16px] tracking-[-0.64px] whitespace-nowrap text-[#222222]">
            {grade}
          </span>
        </span>
      </div>
    ))}
  </div>
);

export default WeatherLegend;
