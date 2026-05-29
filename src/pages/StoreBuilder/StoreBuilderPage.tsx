import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { HeaderUser } from '@/components/layout';
import {
  AreaFilterSheet,
  CreateStoreModal,
  ExpertMatchSidebar,
  RevenueEstimateModal,
  StoreFilterSidebar,
  StoreGrid,
  StoreToolbar,
  SurvivalEstimateModal,
} from '@/components/store';
import { useAuth } from '@/auth';
import useStoreBuilderData from './useStoreBuilderData';

const StoreBuilderPage = () => {
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isCreateStoreModalOpen, setIsCreateStoreModalOpen] = useState(false);
  const [isSurvivalModalOpen, setIsSurvivalModalOpen] = useState(false);
  const [isAreaFilterOpen, setIsAreaFilterOpen] = useState(false);
  const { isAuthenticated, status } = useAuth();
  const {
    stores,
    industries,
    districts,
    totalStores,
    selectedIndustry,
    selectedDistrict,
    selectedIndustryId,
    selectedRegionId,
    areaFilter,
    isMetadataLoading,
    isStoreLoading,
    errorMessage,
    interactionError,
    pendingBookmarkIds,
    pendingLikeIds,
    selectIndustry,
    selectDistrict,
    applyAreaFilter,
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
      <HeaderUser activeNav="store" />
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
      <ExpertMatchSidebar />

      <main className="px-8 pb-10 pt-[calc(var(--header-height)+32px)] lg:ml-[184px] 2xl:mr-[264px]">
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
            areaLabel={areaFilter.label}
            hasAnyFilter={
              selectedIndustryId !== null ||
              selectedRegionId !== null ||
              areaFilter.minArea !== undefined ||
              areaFilter.maxArea !== undefined
            }
            onOpenAreaFilter={() => setIsAreaFilterOpen(true)}
            onResetFilters={resetFilters}
          />
          <button
            type="button"
            onClick={() => setIsCreateStoreModalOpen(true)}
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
          industries={industries}
          districts={districts}
          onClose={() => setIsRevenueModalOpen(false)}
        />
      )}

      {isCreateStoreModalOpen && (
        <CreateStoreModal
          industries={industries}
          districts={districts}
          onCreated={reloadStores}
          onClose={() => setIsCreateStoreModalOpen(false)}
        />
      )}

      {isSurvivalModalOpen && (
        <SurvivalEstimateModal
          industries={industries}
          districts={districts}
          onClose={() => setIsSurvivalModalOpen(false)}
        />
      )}

      {isAreaFilterOpen && (
        <AreaFilterSheet
          currentFilter={areaFilter}
          onClose={() => setIsAreaFilterOpen(false)}
          onReset={() => {
            resetFilters();
            setIsAreaFilterOpen(false);
          }}
          onApply={(filter) => {
            applyAreaFilter(filter);
            setIsAreaFilterOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default StoreBuilderPage;
