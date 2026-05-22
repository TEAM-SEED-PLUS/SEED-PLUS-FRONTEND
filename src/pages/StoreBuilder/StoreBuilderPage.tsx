import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { HeaderUser } from '@/components/layout';
import {
  CreateStoreModal,
  ExpertMatchSidebar,
  RevenueEstimateModal,
  StoreFilterSidebar,
  StoreGrid,
  StoreToolbar,
} from '@/components/store';
import { getMockAuthenticated } from '@/utils/auth';

const StoreBuilderPage = () => {
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isCreateStoreModalOpen, setIsCreateStoreModalOpen] = useState(false);
  const isAuthenticated = getMockAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-500">
      <HeaderUser activeNav="store" />
      <StoreFilterSidebar
        onOpenRevenueCalculator={() => setIsRevenueModalOpen(true)}
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
          <StoreToolbar />
          <button
            type="button"
            onClick={() => setIsCreateStoreModalOpen(true)}
            className="hidden rounded-lg bg-blue-600 px-7 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700 md:block"
          >
            내 상가만들기
          </button>
        </div>

        <StoreGrid />
      </main>

      {isRevenueModalOpen && (
        <RevenueEstimateModal onClose={() => setIsRevenueModalOpen(false)} />
      )}

      {isCreateStoreModalOpen && (
        <CreateStoreModal onClose={() => setIsCreateStoreModalOpen(false)} />
      )}
    </div>
  );
};

export default StoreBuilderPage;
