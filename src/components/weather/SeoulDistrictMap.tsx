import type { WeatherGrade } from '@/api/weatherFeedTypes';
import {
  SEOUL_DISTRICT_PATHS,
  SEOUL_MAP_BACKGROUND,
  SEOUL_MAP_VIEWBOX,
} from './seoulMapPaths';
import { GRADE_FILL } from './weatherGradeStyle';

interface SeoulDistrictMapProps {
  grades: Record<string, { grade: WeatherGrade } | undefined>;
  selected: string;
  onSelect: (district: string) => void;
}

const SeoulDistrictMap = ({
  grades,
  selected,
  onSelect,
}: SeoulDistrictMapProps) => (
  <svg
    viewBox={SEOUL_MAP_VIEWBOX}
    className="h-auto w-full"
    role="group"
    aria-label="서울 자치구 상권날씨 지도"
  >
    {SEOUL_MAP_BACKGROUND.map((d, index) => (
      <path
        key={`bg-${index}`}
        d={d}
        fill="#eaf2ff"
        stroke="#cbd5e1"
        strokeWidth={0.5}
      />
    ))}

    {SEOUL_DISTRICT_PATHS.map(({ name, d }) => {
      const grade = grades[name]?.grade;
      const isSelected = name === selected;

      return (
        <path
          key={name}
          d={d}
          role="button"
          tabIndex={0}
          aria-label={`${name}${grade ? ` ${grade}` : ''}`}
          aria-pressed={isSelected}
          onClick={() => onSelect(name)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onSelect(name);
            }
          }}
          fill={grade ? GRADE_FILL[grade] : '#ffffff'}
          fillOpacity={isSelected ? 1 : 0.85}
          stroke={isSelected ? '#3182f6' : '#9fb3d1'}
          strokeWidth={isSelected ? 2.5 : 0.8}
          className="cursor-pointer outline-none transition-opacity hover:opacity-80 focus-visible:stroke-blue-600"
        />
      );
    })}

    {/* 자치구명은 클릭을 가로채지 않도록 pointer-events를 비운다 */}
    {SEOUL_DISTRICT_PATHS.map(({ name, labelX, labelY }) => (
      <text
        key={`label-${name}`}
        x={labelX}
        y={labelY}
        className="pointer-events-none select-none"
        fontSize={11}
        fontWeight={name === selected ? 700 : 500}
        fill={name === selected ? '#191f28' : '#4e5968'}
      >
        {name}
      </text>
    ))}
  </svg>
);

export default SeoulDistrictMap;
