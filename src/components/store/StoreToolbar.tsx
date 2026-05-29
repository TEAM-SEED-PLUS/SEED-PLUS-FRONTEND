import downChevron from '@/assets/icons/down-chevron-icon.svg';

type StoreRangeFilterKey = 'area' | 'sales' | 'profit' | 'premium' | 'rent';

const filterButtons: { key: StoreRangeFilterKey; baseLabel: string }[] = [
  { key: 'area', baseLabel: '면적' },
  { key: 'sales', baseLabel: '예상매출' },
  { key: 'profit', baseLabel: '수익률' },
  { key: 'premium', baseLabel: '권리금' },
  { key: 'rent', baseLabel: '임대료' },
];

interface StoreToolbarProps {
  industryLabel: string;
  districtLabel: string;
  filterLabels: Record<StoreRangeFilterKey, string>;
  hasAnyFilter: boolean;
  onOpenRangeFilter: (key: StoreRangeFilterKey) => void;
  onResetFilters: () => void;
}

const StoreToolbar = ({
  industryLabel,
  districtLabel,
  filterLabels,
  hasAnyFilter,
  onOpenRangeFilter,
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

      {filterButtons.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={() => onOpenRangeFilter(filter.key)}
          className={`flex min-w-20 items-center justify-between gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold transition ${
            filterLabels[filter.key] !== filter.baseLabel
              ? 'border-blue-600 bg-[#edf3ff] text-blue-600'
              : 'border-[#d8dde5] bg-white text-gray-46 hover:border-blue-600'
          }`}
        >
          {filterLabels[filter.key]}
          <img src={downChevron} alt="" />
        </button>
      ))}
    </div>
  );
};

export default StoreToolbar;
