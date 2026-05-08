const industries = [
  { icon: '🏪', label: '전체 업종', count: '1,284', active: true },
  { icon: '🍽️', label: '음식점', count: '412' },
  { icon: '☕', label: '카페/음료', count: '287' },
  { icon: '🛍️', label: '소매/판매', count: '198' },
  { icon: '💄', label: '미용/뷰티', count: '156' },
  { icon: '💪', label: '헬스/스포츠', count: '89' },
  { icon: '📚', label: '교육/학원', count: '74' },
  { icon: '🔧', label: '생활서비스', count: '68' },
];

const districts = [
  { label: '강남구', count: '234' },
  { label: '마포구', count: '187' },
  { label: '성동구', count: '143' },
  { label: '종로구', count: '121' },
  { label: '용산구', count: '98' },
  { label: '송파구', count: '89' },
];

const StoreFilterSidebar = () => {
  return (
    <aside className="fixed left-0 top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] w-[270px] border-r border-[#e5e8eb] bg-white lg:block">
      <div className="flex h-full flex-col justify-between px-4 py-6">
        <div>
          <section>
            <h2 className="mb-3 px-1 text-xs font-extrabold text-[#8b95a1]">
              업종별
            </h2>
            <div className="space-y-1">
              {industries.map((industry) => (
                <button
                  key={industry.label}
                  type="button"
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-bold ${
                    industry.active
                      ? 'bg-blue-300 text-blue-600'
                      : 'text-gray-46 hover:bg-gray-500'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span>{industry.icon}</span>
                    {industry.label}
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs">
                    {industry.count}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-3 px-1 text-xs font-extrabold text-[#8b95a1]">
              지역별
            </h2>
            <div className="space-y-1">
              {districts.map((district) => (
                <button
                  key={district.label}
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-bold text-gray-46 hover:bg-gray-500"
                >
                  <span className="flex items-center gap-3">
                    📍 {district.label}
                  </span>
                  <span className="rounded-full bg-gray-500 px-2 py-0.5 text-xs">
                    {district.count}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            className="h-11 w-full rounded-lg bg-blue-600 text-sm font-extrabold text-white"
          >
            🧮 수익률 추정 계산기
          </button>
          <button
            type="button"
            className="h-11 w-full rounded-lg bg-[#50c878] text-sm font-extrabold text-white"
          >
            🧬 생존율 측정 계산기
          </button>
        </div>
      </div>
    </aside>
  );
};

export default StoreFilterSidebar;
