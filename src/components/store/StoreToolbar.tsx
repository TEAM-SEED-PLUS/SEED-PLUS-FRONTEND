const filters = [
  '전체',
  '지역',
  '면적',
  '예상매출',
  '수익률',
  '권리금',
  '임대료',
];

const StoreToolbar = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="rounded-full border border-dashed border-blue-600 px-4 py-2 text-sm font-extrabold text-blue-600"
      >
        + 필터 추가
      </button>
      {filters.map((filter, index) => (
        <button
          key={filter}
          type="button"
          className={`rounded-full border px-4 py-2 text-sm font-bold ${
            index === 0
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-[#e5e8eb] bg-white text-gray-46'
          }`}
        >
          {filter}⌄
        </button>
      ))}
      <span className="text-sm font-bold text-gray-46">총 6개</span>
    </div>
  );
};

export default StoreToolbar;
