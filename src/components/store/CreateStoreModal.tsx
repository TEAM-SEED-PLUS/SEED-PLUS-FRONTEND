interface CreateStoreModalProps {
  onClose: () => void;
}

const inputClass =
  'h-15 w-full rounded-sm border border-[#d8dde5] bg-white px-5 text-base text-[#191f28] outline-none placeholder:text-[#8b95a1] focus:border-blue-600';

const labelClass = 'mb-3 block text-base font-medium text-[#4e5968]';

const CreateStoreModal = ({ onClose }: CreateStoreModalProps) => {
  return (
    <div className="fixed inset-0 z-40 flex justify-center overflow-y-auto bg-white/70 px-6 pb-6 pt-[calc(var(--header-height)+16px)] backdrop-blur-[1px]">
      <section className="relative max-h-[calc(100vh-var(--header-height)-32px)] w-full max-w-[594px] overflow-y-auto bg-white px-6 pb-6 pt-6 shadow-[0_18px_60px_rgba(25,31,40,0.12)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-2 top-1 flex h-8 w-8 items-center justify-center text-3xl font-light text-[#4e5968] transition hover:text-[#191f28]"
        >
          ×
        </button>

        <div>
          <h2 className="text-2xl font-extrabold text-[#191f28]">
            내 상가 만들기
          </h2>
          <p className="mt-5 text-base font-medium text-[#333d4b]">
            정보를 등록하면 상가가 리스트에 등록됩니다.
          </p>
        </div>

        <form className="mt-6 border-t border-[#d8dde5] pt-6">
          <label className="block">
            <span className={labelClass}>전체</span>
            <select defaultValue="음식점" className={inputClass}>
              <option>음식점</option>
              <option>카페/음료</option>
              <option>소매/판매</option>
              <option>미용/뷰티</option>
              <option>헬스/스포츠</option>
            </select>
          </label>

          {[
            ['지역', 'text'],
            ['면적(m²)', 'number'],
            ['예상매출', 'number'],
            ['수익률', 'number'],
            ['권리금', 'number'],
            ['임대료', 'number'],
          ].map(([label, type]) => (
            <label key={label} className="mt-6 block">
              <span className={labelClass}>{label}</span>
              <input
                type={type}
                placeholder="Placeholder"
                className={inputClass}
              />
            </label>
          ))}

          <button
            type="button"
            onClick={onClose}
            className="mt-7 h-16 w-full rounded-lg bg-blue-600 text-xl font-extrabold text-white transition hover:bg-blue-700"
          >
            확인
          </button>
        </form>
      </section>
    </div>
  );
};

export default CreateStoreModal;
