const legends = [
  { label: '음식점', color: '#5b82f6' },
  { label: '카페', color: '#50c878' },
  { label: '소매', color: '#f2992e' },
  { label: '서비스', color: '#e55757' },
];

const SalesTrendChart = () => {
  return (
    <section className="rounded-xl border border-[#e5e8eb] bg-white">
      <div className="flex items-center justify-between border-b border-[#e5e8eb] px-6 py-5">
        <h2 className="text-lg font-extrabold text-[#191f28]">
          📈 업종별 월별 매출 추이
        </h2>
        <div className="flex gap-2 text-xs font-bold">
          {['1개월', '3개월', '6개월', '1년'].map((period, index) => (
            <button
              key={period}
              className={`rounded-full border px-3 py-1.5 ${
                index === 0
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-[#e5e8eb] text-gray-46'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="mb-4 flex gap-4">
          {legends.map((legend) => (
            <div
              key={legend.label}
              className="flex items-center gap-2 text-xs font-bold text-gray-46"
            >
              <span
                className="h-1 w-4 rounded-full"
                style={{ backgroundColor: legend.color }}
              />
              {legend.label}
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-[#eef5ff] px-4 py-6">
          <svg viewBox="0 0 900 160" className="h-44 w-full">
            <polyline
              points="0 70 280 74 560 64 900 58"
              fill="none"
              stroke="#5b82f6"
              strokeWidth="3"
            />
            <polyline
              points="0 84 280 79 560 69 900 63"
              fill="none"
              stroke="#50c878"
              strokeWidth="3"
            />
            <polyline
              points="0 55 280 58 560 66 900 78"
              fill="none"
              stroke="#f2992e"
              strokeWidth="3"
            />
            <polyline
              points="0 100 280 94 560 84 900 73"
              fill="none"
              stroke="#e55757"
              strokeWidth="3"
            />
          </svg>
        </div>
        <div className="mt-2 grid grid-cols-4 text-xs text-[#b0b8c1]">
          <span>1주</span>
          <span className="text-center">2주</span>
          <span className="text-center">3주</span>
          <span className="text-right">4주</span>
        </div>
      </div>
    </section>
  );
};

export default SalesTrendChart;
