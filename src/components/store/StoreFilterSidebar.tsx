import { Link } from 'react-router-dom';

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

const districts = [
  { label: '강남구', count: '649' },
  { label: '마포구', count: '434' },
  { label: '성동구', count: '23' },
  { label: '종로구', count: '95' },
  { label: '용산구', count: '23' },
  { label: '송파구', count: '54' },
];

interface StoreFilterSidebarProps {
  onOpenRevenueCalculator: () => void;
}

const StoreFilterSidebar = ({
  onOpenRevenueCalculator,
}: StoreFilterSidebarProps) => {
  return (
    <aside className="fixed left-0 top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] w-[184px] border-r border-[#e5e8eb] bg-white lg:block">
      <div className="flex h-full flex-col justify-between px-4 py-5">
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
            <div className="space-y-1">
              {districts.map((district) => (
                <button
                  key={district.label}
                  type="button"
                  className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-xs font-medium text-gray-46 hover:bg-gray-500"
                >
                  <span>{district.label}</span>
                  <span>{district.count}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={onOpenRevenueCalculator}
            className="h-11 w-full rounded-lg bg-blue-600 text-xs font-extrabold text-white transition hover:bg-blue-700"
          >
            수익률 추정 계산기
          </button>
          <Link
            to="/store-builder/survival-calculator"
            className="flex h-11 w-full items-center justify-center rounded-lg bg-green-600 text-xs font-extrabold text-white transition hover:bg-green-700"
          >
            생존율 측정 계산기
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default StoreFilterSidebar;
