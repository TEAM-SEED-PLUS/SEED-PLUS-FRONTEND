import { mockWeeklyBriefing } from '@/api/homeMock';

/** 주간 브리핑 — 이벤트 분석 막대 그래프 */
const WeeklyBriefingCard = () => {
  const max = Math.max(...mockWeeklyBriefing.bars.map((bar) => bar.value));

  return (
    <section className="rounded-lg bg-white p-5 shadow-sm">
      <div className="flex items-baseline gap-2">
        <h3 className="border-b-2 border-[#191f28] pb-0.5 text-sm font-extrabold text-[#191f28]">
          {mockWeeklyBriefing.title}
        </h3>
        <span className="text-[11px] text-gray-46">
          {mockWeeklyBriefing.subtitle}
        </span>
      </div>

      <div className="mt-5 flex h-[140px] items-end justify-between gap-2 rounded-md bg-[#f7f8fa] px-3 pb-3 pt-4">
        {mockWeeklyBriefing.bars.map((bar) => (
          <div
            key={bar.label}
            className="flex flex-1 flex-col items-center gap-1"
          >
            <span className="text-[10px] font-bold text-[#191f28]">
              {bar.value}
            </span>
            <div
              className={`w-full rounded-t-sm ${
                bar.active ? 'bg-blue-600' : 'bg-[#d8dde5]'
              }`}
              style={{ height: `${(bar.value / max) * 90}px` }}
            />
            <span className="text-[10px] text-gray-46">{bar.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-4">
        {mockWeeklyBriefing.summary.map((item) => (
          <p key={item.label} className="text-sm font-bold text-[#191f28]">
            {item.label}{' '}
            <span className="text-[#e5484d]">
              <span aria-hidden>▲</span> {item.value}
            </span>
          </p>
        ))}
      </div>
    </section>
  );
};

export default WeeklyBriefingCard;
