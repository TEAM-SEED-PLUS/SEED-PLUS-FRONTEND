import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { HeaderUser } from '@/components/layout';
import {
  ExpertMatchSidebar,
  MobileStoreSidebar,
  RangeFilterSheet,
  RevenueEstimateModal,
  StoreFilterSidebar,
  StoreGrid,
  StoreToolbar,
  SurvivalEstimateModal,
} from '@/components/store';
import { useAuth } from '@/auth';
import { useDocumentTitle } from '@/hooks';
import useStoreBuilderData from './useStoreBuilderData';
import type { StoreRangeFilterKey } from './useStoreBuilderData';

const rangeFilterConfigs = {
  area: {
    id: 'area',
    title: '면적 필터',
    unit: 'squareMeter' as const,
    directUnitOptions: [
      { label: '평', value: 'pyeong' as const },
      { label: 'm²', value: 'squareMeter' as const },
    ],
    presets: [
      { label: '전체' },
      { label: '10평 이하', max: 33 },
      { label: '10~20평', min: 33, max: 66 },
      { label: '20~30평', min: 66, max: 99 },
      { label: '30~50평', min: 99, max: 165 },
      { label: '50평 이상', min: 165 },
    ],
  },
  sales: {
    id: 'sales',
    title: '예상매출 필터',
    unit: 'manwon' as const,
    directLabel: '예상매출 직접 입력',
    presets: [
      { label: '전체' },
      { label: '500만원 이하', max: 500 },
      { label: '500~1,000만원', min: 500, max: 1000 },
      { label: '1,000~3,000만원', min: 1000, max: 3000 },
      { label: '3,000~5,000만원', min: 3000, max: 5000 },
      { label: '5,000만원 이상', min: 5000 },
    ],
  },
  profit: {
    id: 'profit',
    title: '수익률 필터',
    unit: 'percent' as const,
    directLabel: '수익률 직접 입력',
    maxWarningValue: 100,
    maxWarningMessage: '수익률은 100% 이하로 입력해주세요.',
    presets: [
      { label: '전체' },
      { label: '5% 이하', max: 5 },
      { label: '5~10%', min: 5, max: 10 },
      { label: '10~20%', min: 10, max: 20 },
      { label: '20~30%', min: 20, max: 30 },
      { label: '30% 이상', min: 30 },
    ],
  },
  premium: {
    id: 'premium',
    title: '권리금 필터',
    unit: 'manwon' as const,
    directLabel: '권리금 직접 입력',
    presets: [
      { label: '전체' },
      { label: '권리금 없음', min: 0, max: 0 },
      { label: '1,000만원 이하', max: 1000 },
      { label: '1,000~3,000만원', min: 1000, max: 3000 },
      { label: '3,000~5,000만원', min: 3000, max: 5000 },
      { label: '5,000만원 이상', min: 5000 },
    ],
  },
  rent: {
    id: 'rent',
    title: '임대료 필터',
    unit: 'manwon' as const,
    directLabel: '임대료 직접 입력',
    presets: [
      { label: '전체' },
      { label: '50만원 이하', max: 50 },
      { label: '50~100만원', min: 50, max: 100 },
      { label: '100~300만원', min: 100, max: 300 },
      { label: '300~500만원', min: 300, max: 500 },
      { label: '500만원 이상', min: 500 },
    ],
  },
};

const StoreBuilderPage = () => {
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isSurvivalModalOpen, setIsSurvivalModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeRangeFilter, setActiveRangeFilter] =
    useState<StoreRangeFilterKey | null>(null);
  useDocumentTitle('상가 분석');
  // 로고·'내 상가 만들기' 내비는 같은 라우트로의 Link라 페이지가 리마운트되지
  // 않는다. 같은 경로여도 클릭마다 location.key는 바뀌므로 그때 오버레이를 닫는다.
  // (effect 대신 렌더 중 상태 조정 — react-hooks/set-state-in-effect 규칙 준수)
  const { key: locationKey } = useLocation();
  const [prevLocationKey, setPrevLocationKey] = useState(locationKey);
  if (locationKey !== prevLocationKey) {
    setPrevLocationKey(locationKey);
    setIsRevenueModalOpen(false);
    setIsSurvivalModalOpen(false);
    setIsMobileSidebarOpen(false);
    setActiveRangeFilter(null);
  }
  const { isAuthenticated, status } = useAuth();
  const {
    stores,
    industries,
    analysisIndustries,
    districts,
    legalDongs,
    totalStores,
    selectedIndustry,
    selectedDistrict,
    selectedIndustryId,
    selectedRegionId,
    rangeFilters,
    isMetadataLoading,
    isStoreLoading,
    errorMessage,
    interactionError,
    pendingBookmarkIds,
    pendingLikeIds,
    selectIndustry,
    selectDistrict,
    applyRangeFilter,
    resetRangeFilter,
    resetFilters,
    reloadStores,
    toggleBookmark,
    toggleLike,
  } = useStoreBuilderData(isAuthenticated);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-500 text-sm font-medium text-gray-46">
        인증 상태를 확인하고 있습니다.
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-500">
      <HeaderUser
        activeNav="store"
        onMenuClick={() => setIsMobileSidebarOpen((current) => !current)}
      />
      <StoreFilterSidebar
        onOpenRevenueCalculator={() => setIsRevenueModalOpen(true)}
        onOpenSurvivalCalculator={() => setIsSurvivalModalOpen(true)}
        industries={industries}
        districts={districts}
        totalStores={totalStores}
        selectedIndustryId={selectedIndustryId}
        selectedRegionId={selectedRegionId}
        isLoading={isMetadataLoading || isStoreLoading}
        onSelectIndustry={selectIndustry}
        onSelectDistrict={selectDistrict}
      />
      <MobileStoreSidebar
        isOpen={isMobileSidebarOpen}
        onOpenCreateStore={() => {
          setIsMobileSidebarOpen(false);
          setIsRevenueModalOpen(true);
        }}
        onOpenRevenueCalculator={() => {
          setIsMobileSidebarOpen(false);
          setIsRevenueModalOpen(true);
        }}
        onOpenSurvivalCalculator={() => {
          setIsMobileSidebarOpen(false);
          setIsSurvivalModalOpen(true);
        }}
        industries={industries}
        districts={districts}
        totalStores={totalStores}
        selectedIndustryId={selectedIndustryId}
        selectedRegionId={selectedRegionId}
        isLoading={isMetadataLoading || isStoreLoading}
        onSelectIndustry={selectIndustry}
        onSelectDistrict={selectDistrict}
      />
      <ExpertMatchSidebar />

      <main className="px-8 pb-10 pt-[calc(var(--header-height)+32px)] lg:ml-59 2xl:mr-[264px]">
        <div className="mb-7">
          <p className="text-2xl font-medium text-[#191f28]">
            내가 만든 상가 얼마나 성장할 수 있을까요?
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#191f28]">
            업종·지역별 예상매출과 수익률 분석을 시작하세요!
          </h1>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <StoreToolbar
            industryLabel={selectedIndustry?.name ?? '전체'}
            districtLabel={selectedDistrict?.sigungu ?? '지역'}
            filterLabels={{
              area: rangeFilters.area.label,
              sales: rangeFilters.sales.label,
              profit: rangeFilters.profit.label,
              premium: rangeFilters.premium.label,
              rent: rangeFilters.rent.label,
            }}
            hasAnyFilter={
              selectedIndustryId !== null ||
              selectedRegionId !== null ||
              Object.values(rangeFilters).some(
                (filter) => filter.min !== undefined || filter.max !== undefined
              )
            }
            onOpenRangeFilter={setActiveRangeFilter}
            onResetFilters={resetFilters}
          />
          <button
            type="button"
            onClick={() => setIsRevenueModalOpen(true)}
            className="hidden rounded-lg bg-blue-600 px-7 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700 md:block"
          >
            내 상가만들기
          </button>
        </div>

        {interactionError && (
          <p className="mb-4 rounded-md bg-[#fffafa] px-4 py-3 text-sm font-medium text-[#e5484d]">
            {interactionError}
          </p>
        )}

        <StoreGrid
          stores={stores}
          isLoading={isStoreLoading}
          errorMessage={errorMessage}
          pendingBookmarkIds={pendingBookmarkIds}
          onToggleBookmark={toggleBookmark}
          pendingLikeIds={pendingLikeIds}
          onToggleLike={toggleLike}
        />
      </main>

      {isRevenueModalOpen && (
        <RevenueEstimateModal
          industries={analysisIndustries}
          districts={districts}
          legalDongs={legalDongs}
          onCreated={reloadStores}
          onClose={() => setIsRevenueModalOpen(false)}
        />
      )}

      {isSurvivalModalOpen && (
        <SurvivalEstimateModal
          industries={analysisIndustries}
          districts={districts}
          legalDongs={legalDongs}
          onClose={() => setIsSurvivalModalOpen(false)}
        />
      )}

      {activeRangeFilter && (
        <RangeFilterSheet
          config={rangeFilterConfigs[activeRangeFilter]}
          currentFilter={rangeFilters[activeRangeFilter]}
          onClose={() => setActiveRangeFilter(null)}
          onReset={() => {
            resetRangeFilter(activeRangeFilter);
            setActiveRangeFilter(null);
          }}
          onApply={(filter) => {
            applyRangeFilter(activeRangeFilter, filter);
            setActiveRangeFilter(null);
          }}
        />
      )}
    </div>
  );
};

export default StoreBuilderPage;
