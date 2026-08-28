import type { WeatherGrade } from '@/api/weatherFeedTypes';
import { GRADE_FILL } from './weatherGradeStyle';
import {
  SEOUL_DISTRICT_PATHS,
  SEOUL_MAP_BACKGROUND,
  SEOUL_MAP_VIEWBOX,
} from './seoulMapPaths';

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
          className="cursor-pointer outline-none transition-[fill-opacity] hover:fill-opacity-100 focus-visible:stroke-blue-600"
        />
      );
    })}
  </svg>
);

export default SeoulDistrictMap;
