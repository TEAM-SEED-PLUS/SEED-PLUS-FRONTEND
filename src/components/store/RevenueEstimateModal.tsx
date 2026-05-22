interface RevenueEstimateModalProps {
  onClose: () => void;
}

const inputClass =
  'h-11 w-full rounded-md border border-[#d8dde5] bg-white px-3 text-sm text-[#191f28] outline-none placeholder:text-[#8b95a1] focus:border-blue-600';

const labelClass = 'mb-2 block text-sm font-medium text-[#333d4b]';

const RevenueEstimateModal = ({ onClose }: RevenueEstimateModalProps) => {
  return (
    <div className="fixed inset-x-0 bottom-0 top-[64px] z-30 flex items-start justify-center overflow-y-auto bg-[#f5f6f8] px-8 py-6">
      <section className="relative grid w-full max-w-[1120px] grid-cols-1 gap-8 lg:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl font-light text-[#6b7684] shadow-sm transition hover:bg-[#f2f4f6] hover:text-[#191f28]"
        >
          ×
        </button>

        <div className="rounded-lg border border-[#d8dde5] bg-white p-6">
          <div className="border-b border-[#e5e8eb] pb-4">
            <h2 className="text-xl font-bold text-[#191f28]">
              내 상가 수익률 추정
            </h2>
            <p className="mt-2 text-xs font-medium text-[#4e5968]">
              업종과 지역을 선택하면 예상 매출과 수익률을 계산합니다.
            </p>
          </div>

          <form className="mt-5 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
            <label className="block">
              <span className={labelClass}>상가명</span>
              <input
                type="text"
                placeholder="예) 성수 스페셜티 카페"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>예상직원수</span>
              <input
                type="number"
                defaultValue={2}
                placeholder="예) 2"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>업종선택</span>
              <select defaultValue="음식점" className={inputClass}>
                <option>음식점</option>
                <option>카페/음료</option>
                <option>소매/판매</option>
                <option>미용/뷰티</option>
                <option>헬스/스포츠</option>
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>지역선택</span>
              <select defaultValue="강남구" className={inputClass}>
                <option>강남구</option>
                <option>마포구</option>
                <option>성동구</option>
                <option>종로구</option>
                <option>용산구</option>
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>면적(m²)</span>
              <input
                type="number"
                placeholder="예) 50"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>초기투자금(만원)</span>
              <input
                type="number"
                placeholder="예) 5000"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>월 임대료(만원)</span>
              <input
                type="number"
                placeholder="예) 300"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>권리금(만원)</span>
              <input
                type="number"
                placeholder="예) 3000"
                className={inputClass}
              />
            </label>

            <button
              type="button"
              className="mt-1 h-12 rounded-md bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700 md:col-span-2"
            >
              수익률 추정
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-[#d8dde5] bg-white p-6">
          <div className="flex items-start gap-2 rounded-md border border-[#e5484d] bg-[#fffafa] px-3 py-3 text-xs font-medium leading-relaxed text-[#e5484d]">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#e5484d] text-[10px]">
              i
            </span>
            <p>
              본 추정치는 서울시 상권 데이터, 카드 매출 데이터, 국토교통부
              실거래가를 기반으로 산출된 참고용 수치입니다. 실제 수익은 운영
              역량, 시장 상황에 따라 달라질 수 있습니다.
            </p>
          </div>

          <div className="mt-4 rounded-lg bg-blue-600 p-5 text-white">
            <p className="text-lg font-bold">나의 예상 월 매출은?</p>
            <div className="mt-5 flex items-end gap-2">
              <strong className="text-3xl font-extrabold tracking-tight">
                5,200
              </strong>
              <span className="mb-1 text-sm font-bold">만원</span>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">직원 2명 인건비</p>
                <p className="mt-2 text-xl font-extrabold">500만원 반영</p>
              </div>
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">업종 평균 대비</p>
                <p className="mt-2 text-xl font-extrabold">30% 수준</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">예상 순이익률</p>
                <p className="mt-2 text-right text-xl font-extrabold">7%</p>
              </div>
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">투자 회수 기간</p>
                <p className="mt-2 text-right text-xl font-extrabold">19개월</p>
              </div>
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">Property Score</p>
                <p className="mt-2 text-right text-xl font-extrabold">77점</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-4 h-12 w-full rounded-md bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700"
          >
            내 상가 목록에 저장하기
          </button>
        </div>
      </section>
    </div>
  );
};

export default RevenueEstimateModal;
