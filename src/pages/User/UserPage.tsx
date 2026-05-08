import { HeaderUser } from '@/components/layout';
import {
  ExpertMatchSidebar,
  StoreFilterSidebar,
  StoreGrid,
  StoreToolbar,
} from '@/components/store';

const UserPage = () => {
  return (
    <div className="min-h-screen bg-gray-500">
      <HeaderUser activeNav="store" />
      <StoreFilterSidebar />
      <ExpertMatchSidebar />

      <main className="px-6 pb-10 pt-[calc(var(--header-height)+24px)] lg:ml-[270px] 2xl:mr-[360px]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#191f28]">
              내 상가 만들어보기
            </h1>
            <p className="mt-1 text-sm font-bold text-gray-46">
              업종·지역별 예상 매출과 수익률을 시뮬레이션해보세요
            </p>
          </div>
          <button
            type="button"
            className="hidden rounded-lg bg-blue-600 px-7 py-3 text-base font-extrabold text-white md:block"
          >
            + 내 상가 만들기
          </button>
        </div>

        <StoreToolbar />

        <div className="mt-5">
          <StoreGrid />
        </div>
      </main>
    </div>
  );
};

export default UserPage;
