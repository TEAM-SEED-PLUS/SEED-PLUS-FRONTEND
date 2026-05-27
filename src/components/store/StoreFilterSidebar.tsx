import type { IndustryResponse, RegionResponse } from '@/api';

interface StoreFilterSidebarProps {
  onOpenRevenueCalculator: () => void;
  onOpenSurvivalCalculator: () => void;
  industries: IndustryResponse[];
  districts: RegionResponse[];
  totalStores: number;
  selectedIndustryId: number | null;
  selectedRegionId: number | null;
  isLoading: boolean;
  onSelectIndustry: (industryId: number | null) => void;
  onSelectDistrict: (regionId: number | null) => void;
}

const StoreFilterSidebar = ({
  onOpenRevenueCalculator,
  onOpenSurvivalCalculator,
  industries,
  districts,
  totalStores,
  selectedIndustryId,
  selectedRegionId,
  isLoading,
  onSelectIndustry,
  onSelectDistrict,
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
              <button
                type="button"
                onClick={() => onSelectIndustry(null)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-xs font-medium ${
                  selectedIndustryId === null
                    ? 'bg-blue-300 text-blue-600'
                    : 'text-gray-46 hover:bg-gray-500'
                }`}
              >
                <span>전체</span>
                {selectedRegionId === null && (
                  <span>
                    {isLoading ? '-' : totalStores.toLocaleString('ko-KR')}
                  </span>
                )}
              </button>
              {industries.map((industry) => (
                <button
                  key={industry.industryId}
                  type="button"
                  onClick={() => onSelectIndustry(industry.industryId)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-xs font-medium ${
                    selectedIndustryId === industry.industryId
                      ? 'bg-blue-300 text-blue-600'
                      : 'text-gray-46 hover:bg-gray-500'
                  }`}
                >
                  <span>{industry.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-3 flex items-center justify-between px-1 text-xs font-medium text-[#8b95a1]">
              지역별 <span>⌄</span>
            </h2>
            <div className="scrollbar-hide max-h-[276px] space-y-1 overflow-y-auto">
              <button
                type="button"
                onClick={() => onSelectDistrict(null)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-xs font-medium ${
                  selectedRegionId === null
                    ? 'bg-blue-300 text-blue-600'
                    : 'text-gray-46 hover:bg-gray-500'
                }`}
              >
                <span>전체</span>
              </button>
              {districts.map((district) => (
                <button
                  key={district.regionId}
                  type="button"
                  onClick={() => onSelectDistrict(district.regionId)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-xs font-medium ${
                    selectedRegionId === district.regionId
                      ? 'bg-blue-300 text-blue-600'
                      : 'text-gray-46 hover:bg-gray-500'
                  }`}
                >
                  <span>{district.sigungu}</span>
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
