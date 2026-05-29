import { useState } from 'react';
import type { IndustryResponse, RegionResponse } from '@/api';
import DownChevronIcon from '@/assets/icons/down-chevron-icon.svg';
import LeftChevronIcon from '@/assets/icons/left-chevron-icon.svg';

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

const filterListClass = 'max-h-[246px] space-y-1 overflow-y-auto pr-1';

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <img
    src={isOpen ? DownChevronIcon : LeftChevronIcon}
    alt=""
    className="h-4 w-4"
  />
);

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
  const [isIndustryOpen, setIsIndustryOpen] = useState(true);
  const [isDistrictOpen, setIsDistrictOpen] = useState(true);

  return (
    <aside className="fixed left-0 top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] w-59 border-r border-[#e5e8eb] bg-white lg:block">
      <div className="scrollbar-hide h-full overflow-y-auto px-4 py-5">
        <div>
          <section>
            <button
              type="button"
              onClick={() => setIsIndustryOpen((current) => !current)}
              className="mb-3 flex w-full items-center justify-between px-1 text-xs font-medium text-[#8b95a1]"
            >
              <span>업종별</span>
              <ChevronIcon isOpen={isIndustryOpen} />
            </button>

            {isIndustryOpen && (
              <div className={filterListClass}>
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
                    className={`flex w-full items-start rounded-md px-3 py-2.5 text-xs font-medium ${
                      selectedIndustryId === industry.industryId
                        ? 'bg-blue-300 text-blue-600'
                        : 'text-gray-46 hover:bg-gray-500'
                    }`}
                  >
                    <span>{industry.name}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="mt-8">
            <button
              type="button"
              onClick={() => setIsDistrictOpen((current) => !current)}
              className="mb-3 flex w-full items-center justify-between px-1 text-xs font-medium text-[#8b95a1]"
            >
              <span>지역별</span>
              <ChevronIcon isOpen={isDistrictOpen} />
            </button>

            {isDistrictOpen && (
              <div className={filterListClass}>
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
            )}
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
