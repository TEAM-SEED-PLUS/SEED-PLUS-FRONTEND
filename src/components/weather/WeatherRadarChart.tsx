export type RadarAxis = {
  label: string;
  /** 0~100. 미산출은 null — 중심(0)으로 그리고 라벨에서 구분한다 */
  value: number | null;
};

interface WeatherRadarChartProps {
  axes: RadarAxis[];
  size?: number;
}

const LEVELS = [0.25, 0.5, 0.75, 1];

/** 상권 지표 레이더 차트 (차트 라이브러리 없이 SVG로 그린다) */
const WeatherRadarChart = ({ axes, size = 180 }: WeatherRadarChartProps) => {
  const center = size / 2;
  const radius = size / 2 - 28;
  const angleOf = (index: number) =>
    (Math.PI * 2 * index) / axes.length - Math.PI / 2;
  const pointAt = (index: number, ratio: number) => {
    const angle = angleOf(index);
    return [
      center + Math.cos(angle) * radius * ratio,
      center + Math.sin(angle) * radius * ratio,
    ];
  };
  const polygon = (ratioOf: (index: number) => number) =>
    axes.map((_, index) => pointAt(index, ratioOf(index)).join(',')).join(' ');

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-auto w-full max-w-[200px]"
      role="img"
      aria-label={axes
        .map((axis) => `${axis.label} ${axis.value ?? '미산출'}`)
        .join(', ')}
    >
      {LEVELS.map((level) => (
        <polygon
          key={level}
          points={polygon(() => level)}
          fill="none"
          stroke="#c9d6ec"
          strokeWidth={1}
        />
      ))}
      {axes.map((axis, index) => {
        const [x, y] = pointAt(index, 1);
        return (
          <line
            key={`axis-${axis.label}`}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="#c9d6ec"
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={polygon((index) => (axes[index].value ?? 0) / 100)}
        fill="rgba(49,130,246,0.35)"
        stroke="#3182f6"
        strokeWidth={1.5}
      />
      {axes.map((axis, index) => {
        const [x, y] = pointAt(index, (axis.value ?? 0) / 100);
        return (
          <circle
            key={`dot-${axis.label}`}
            cx={x}
            cy={y}
            r={2.5}
            fill="#3182f6"
          />
        );
      })}
      {axes.map((axis, index) => {
        const [x, y] = pointAt(index, 1.22);
        return (
          <text
            key={`label-${axis.label}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[#4e5968] text-[8px] font-bold"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
};

export default WeatherRadarChart;
