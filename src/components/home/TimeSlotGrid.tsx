import type { TimeSlotCard } from '@/api/homeMock';

interface TimeSlotGridProps {
  slots: TimeSlotCard[];
}

/** 선택 자치구의 시간대별 상권 흐름 카드 */
const TimeSlotGrid = ({ slots }: TimeSlotGridProps) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
    {slots.map((slot) => (
      <div
        key={slot.id}
        className={`rounded-md border px-4 py-3 ${
          slot.highlight
            ? 'border-blue-600 bg-[#f5f9ff]'
            : 'border-[#e5e8eb] bg-white'
        }`}
      >
        <p className="text-[11px] font-medium text-gray-46">
          {slot.band} {slot.range}
        </p>
        <p className="mt-1 text-sm font-bold text-[#191f28]">{slot.title}</p>
        <div className="mt-2 flex flex-wrap gap-4">
          {slot.metrics.map((metric) => (
            <span key={metric.label} className="text-[11px] text-gray-46">
              {metric.label}{' '}
              <strong
                className={metric.up ? 'text-[#e5484d]' : 'text-[#191f28]'}
              >
                {metric.up && <span aria-hidden>↑ </span>}
                {metric.value}
              </strong>
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default TimeSlotGrid;
