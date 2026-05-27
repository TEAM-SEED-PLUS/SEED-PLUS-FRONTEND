import downChevron from '@/assets/icons/down-chevron.svg';

const unavailableFilters = ['예상매출', '수익률', '권리금', '임대료'];

interface StoreToolbarProps {
  industryLabel: string;
  districtLabel: string;
  areaLabel: string;
  hasAnyFilter: boolean;
  onOpenAreaFilter: () => void;
  onResetFilters: () => void;
}

const StoreToolbar = ({
  industryLabel,
  districtLabel,
  areaLabel,
  hasAnyFilter,
  onOpenAreaFilter,
  onResetFilters,
}: StoreToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onResetFilters}
        className={`rounded-lg border px-4 py-2.5 text-sm font-bold transition ${
          !hasAnyFilter
            ? 'border-blue-600 bg-blue-600 text-white'
            : 'border-[#d8dde5] bg-white text-gray-46 hover:border-blue-600'
        }`}
      >
        전체
      </button>

      {industryLabel !== '전체' && (
        <span className="rounded-lg border border-blue-600 bg-[#edf3ff] px-4 py-2.5 text-sm font-bold text-blue-600">
          {industryLabel}
        </span>
      )}
      {districtLabel !== '지역' && (
        <span className="rounded-lg border border-blue-600 bg-[#edf3ff] px-4 py-2.5 text-sm font-bold text-blue-600">
          {districtLabel}
        </span>
      )}

      <button
        type="button"
        onClick={onOpenAreaFilter}
        className={`flex min-w-20 items-center justify-between gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold transition ${
          areaLabel !== '면적'
            ? 'border-blue-600 bg-[#edf3ff] text-blue-600'
            : 'border-[#d8dde5] bg-white text-gray-46 hover:border-blue-600'
        }`}
      >
        {areaLabel}
        <img src={downChevron} alt="" />
      </button>

      {unavailableFilters.map((filter) => (
        <button
          key={filter}
          type="button"
          disabled
          title="API 준비 중"
          aria-label={`${filter} 필터, API 준비 중`}
          className="flex min-w-20 cursor-not-allowed items-center justify-between gap-2 rounded-lg border border-[#d8dde5] bg-white px-4 py-2.5 text-sm font-bold text-gray-46 opacity-55"
        >
          {filter}
          <img src={downChevron} alt="" />
        </button>
      ))}
    </div>
  );
};

export default StoreToolbar;
