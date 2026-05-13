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
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter, index) => (
        <button
          key={filter}
          type="button"
          className={`min-w-20 rounded-lg border px-4 py-2.5 text-sm font-bold ${
            index === 0
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-[#d8dde5] bg-white text-gray-46'
          }`}
        >
          {filter}⌄
        </button>
      ))}
    </div>
  );
};

export default StoreToolbar;
