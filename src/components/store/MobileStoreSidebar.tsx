import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { IndustryResponse, RegionResponse } from '@/api';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import DownChevronIcon from '@/assets/icons/down-chevron-icon.svg';
import LeftChevronIcon from '@/assets/icons/left-chevron-icon.svg';

interface MobileStoreSidebarProps {
  isOpen: boolean;
  /** 메뉴 안의 링크로 이동할 때 메뉴를 닫는다 */
  onClose: () => void;
  /** 내 상가 만들기 버튼 동작. 다른 화면에서는 대신 createStoreHref로 이동한다 */
  onOpenCreateStore?: () => void;
  createStoreHref?: string;
  /** 업종·지역 필터와 계산기(로그인 회원용)를 보여줄지 */
  showStoreTools?: boolean;
  onOpenRevenueCalculator: () => void;
  onOpenSurvivalCalculator: () => void;
  industries: IndustryResponse[];
  districts: RegionResponse[];
  /** 전체 상가 수. 내 상가 만들기 밖에서는 알 수 없어 null을 넘긴다 */
  totalStores: number | null;
  selectedIndustryId: number | null;
  selectedRegionId: number | null;
  isLoading: boolean;
  onSelectIndustry: (industryId: number | null) => void;
  onSelectDistrict: (regionId: number | null) => void;
}

const filterListClass = 'max-h-[246px] space-y-1 overflow-y-auto pr-1';
const navButtonClass =
  'flex h-10 w-full items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white transition hover:bg-blue-700';

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <img
    src={isOpen ? DownChevronIcon : LeftChevronIcon}
    alt=""
    className="h-4 w-4"
  />
);

const MobileStoreSidebar = ({
  isOpen,
  onClose,
  onOpenCreateStore,
  createStoreHref,
  showStoreTools = true,
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
}: MobileStoreSidebarProps) => {
  const [isIndustryOpen, setIsIndustryOpen] = useState(true);
  const [isDistrictOpen, setIsDistrictOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-20 overflow-y-auto bg-white px-3 py-3 md:hidden">
      <div className="space-y-2">
        <Link to="/weather" onClick={onClose} className={navButtonClass}>
          상권날씨
        </Link>
        {FEATURE_FLAGS.FEED && (
          <Link to="/feed" onClick={onClose} className={navButtonClass}>
            피드
          </Link>
        )}
        {showStoreTools &&
          (createStoreHref ? (
            <Link
              to={createStoreHref}
              onClick={onClose}
              className={navButtonClass}
            >
              내 상가 만들기
            </Link>
          ) : (
            <button
              type="button"
              onClick={onOpenCreateStore}
              className={navButtonClass}
            >
              내 상가 만들기
            </button>
          ))}
      </div>

      {showStoreTools && (
        <>
          <section className="mt-4">
            <button
              type="button"
              onClick={() => setIsIndustryOpen((current) => !current)}
              className="mb-2 flex w-full items-center justify-between px-1 text-xs font-medium text-[#8b95a1]"
            >
              <span>업종별</span>
              <ChevronIcon isOpen={isIndustryOpen} />
            </button>

            {isIndustryOpen && (
              <div className={filterListClass}>
                <button
                  type="button"
                  onClick={() => onSelectIndustry(null)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-xs font-medium ${
                    selectedIndustryId === null
                      ? 'bg-blue-300 text-blue-600'
                      : 'text-gray-46 hover:bg-gray-500'
                  }`}
                >
                  <span>전체</span>
                  {selectedRegionId === null && totalStores !== null && (
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
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-xs font-medium ${
                      selectedIndustryId === industry.industryId
                        ? 'bg-blue-300 text-blue-600'
                        : 'text-gray-46 hover:bg-gray-500'
                    }`}
                  >
                    <span className="flex-1 text-left">{industry.name}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="mt-4">
            <button
              type="button"
              onClick={() => setIsDistrictOpen((current) => !current)}
              className="mb-2 flex w-full items-center justify-between px-1 text-xs font-medium text-[#8b95a1]"
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

          <div className="mt-5 space-y-2 pb-4">
            <button
              type="button"
              onClick={onOpenRevenueCalculator}
              className="h-10 w-full rounded-md bg-blue-600 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              수익률 추정 계산기
            </button>
            <button
              type="button"
              onClick={onOpenSurvivalCalculator}
              className="h-10 w-full rounded-md bg-blue-600 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              생존율 측정 계산기
            </button>
          </div>
        </>
      )}
    </aside>
  );
};

export default MobileStoreSidebar;
