import { DISTRICT_COUNTS, SEOUL_DISTRICTS } from './storeDistricts';

const industries = [
  { label: '전체', count: '1,234', active: true },
  { label: '음식점', count: '649' },
  { label: '카페/음료', count: '231' },
  { label: '소매/판매', count: '23' },
  { label: '미용/뷰티', count: '95' },
  { label: '헬스/스포츠', count: '23' },
  { label: '교육/학원', count: '54' },
  { label: '생활서비스', count: '12' },
];

interface StoreFilterSidebarProps {
  onOpenRevenueCalculator: () => void;
  onOpenSurvivalCalculator: () => void;
}

const StoreFilterSidebar = ({
  onOpenRevenueCalculator,
  onOpenSurvivalCalculator,
}: StoreFilterSidebarProps) => {
  return (
    <aside className="fixed left-0 top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] w-[184px] border-r border-[#e5e8eb] bg-white lg:block">
      <div className="scrollbar-hide h-full overflow-y-auto px-4 py-5">
        <div>
          <section>
            <h2 className="mb-3 flex items-center justify-between px-1 text-xs font-medium text-[#8b95a1]">
              업종별 <span>⌄</span>
            </h2>
            <div className="space-y-1">
              {industries.map((industry) => (
                <button
                  key={industry.label}
                  type="button"
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-xs font-medium ${
                    industry.active
                      ? 'bg-blue-300 text-blue-600'
                      : 'text-gray-46 hover:bg-gray-500'
                  }`}
                >
                  <span>{industry.label}</span>
                  <span>{industry.count}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-3 flex items-center justify-between px-1 text-xs font-medium text-[#8b95a1]">
              지역별 <span>⌄</span>
            </h2>
            <div className="scrollbar-hide max-h-[276px] space-y-1 overflow-y-auto">
              {SEOUL_DISTRICTS.map((district) => (
                <button
                  key={district}
                  type="button"
                  className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-xs font-medium text-gray-46 hover:bg-gray-500"
                >
                  <span>{district}</span>
                  {DISTRICT_COUNTS[district] && (
                    <span>{DISTRICT_COUNTS[district]}</span>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={onOpenRevenueCalculator}
            className="h-11 w-full rounded-lg bg-blue-600 text-xs font-extrabold text-white transition hover:bg-blue-700"
          >
            수익률 추정 계산기
          </button>
          <button
            type="button"
            onClick={onOpenSurvivalCalculator}
            className="h-11 w-full rounded-lg bg-blue-600 text-xs font-extrabold text-white transition hover:bg-blue-700"
          >
            생존율 측정 계산기
          </button>
        </div>
      </div>
    </aside>
  );
};

export default StoreFilterSidebar;
