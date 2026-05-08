interface RevenueEstimateModalProps {
  onClose: () => void;
}

const RevenueEstimateModal = ({ onClose }: RevenueEstimateModalProps) => {
  return (
    <div className="fixed inset-0 z-30 flex items-start justify-center bg-black/45 px-6 pt-7">
      <section className="w-full max-w-[900px] rounded-3xl bg-white px-11 py-11 shadow-[0_24px_70px_rgba(25,31,40,0.18)]">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-[#191f28]">
              🧮 내 상가 수익률 추정
            </h2>
            <p className="mt-3 text-lg font-medium text-gray-46">
              업종과 지역을 선택하면 예상 매출과 수익률을 계산해드립니다
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-4xl font-light text-gray-46"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <form className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-3 block text-lg font-extrabold text-[#191f28]">
              상가명
            </span>
            <input
              type="text"
              placeholder="예) 성수 스페셜티 카페"
              className="h-14 w-full rounded-xl border border-[#d8dde5] px-5 text-lg outline-none placeholder:text-gray-46 focus:border-blue-600"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-lg font-extrabold text-[#191f28]">
              예상 직원 수 (명)
            </span>
            <input
              type="number"
              defaultValue={2}
              className="h-14 w-full rounded-xl border border-[#d8dde5] px-5 text-lg outline-none focus:border-blue-600"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-lg font-extrabold text-[#191f28]">
              업종 선택
            </span>
            <select
              defaultValue="음식점"
              className="h-14 w-full rounded-xl border border-[#d8dde5] px-5 text-lg outline-none focus:border-blue-600"
            >
              <option>음식점</option>
              <option>카페/음료</option>
              <option>소매/판매</option>
              <option>미용/뷰티</option>
              <option>헬스/스포츠</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-3 block text-lg font-extrabold text-[#191f28]">
              지역 선택
            </span>
            <select
              defaultValue="강남구"
              className="h-14 w-full rounded-xl border border-[#d8dde5] px-5 text-lg outline-none focus:border-blue-600"
            >
              <option>강남구</option>
              <option>마포구</option>
              <option>성동구</option>
              <option>종로구</option>
              <option>용산구</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-3 block text-lg font-extrabold text-[#191f28]">
              면적 (m²)
            </span>
            <input
              type="number"
              defaultValue={50}
              className="h-14 w-full rounded-xl border border-[#d8dde5] px-5 text-lg outline-none focus:border-blue-600"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-lg font-extrabold text-[#191f28]">
              초기 투자금 (만원)
            </span>
            <input
              type="number"
              defaultValue={5000}
              className="h-14 w-full rounded-xl border border-[#d8dde5] px-5 text-lg outline-none focus:border-blue-600"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-lg font-extrabold text-[#191f28]">
              월 임대료 (만원)
            </span>
            <input
              type="number"
              defaultValue={300}
              className="h-14 w-full rounded-xl border border-[#d8dde5] px-5 text-lg outline-none focus:border-blue-600"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-lg font-extrabold text-[#191f28]">
              권리금 (만원)
            </span>
            <input
              type="number"
              defaultValue={3000}
              className="h-14 w-full rounded-xl border border-[#d8dde5] px-5 text-lg outline-none focus:border-blue-600"
            />
          </label>

          <button
            type="button"
            className="mt-4 h-16 rounded-xl bg-blue-600 text-xl font-extrabold text-white md:col-span-2"
          >
            📊 수익률 계산하기
          </button>
        </form>
      </section>
    </div>
  );
};

export default RevenueEstimateModal;
