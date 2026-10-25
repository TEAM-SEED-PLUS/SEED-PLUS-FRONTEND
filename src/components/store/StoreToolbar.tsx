import { useEffect, useRef, useState } from 'react';
import downChevron from '@/assets/icons/down-chevron-icon.svg';
import { CheckIcon, FilterIcon } from '@/components/ui/icons';
import type { StoreSortKey } from '@/pages/StoreBuilder/useStoreBuilderData';

const sortOptions: { key: StoreSortKey; label: string }[] = [
  { key: 'likes', label: '좋아요 많은 순' },
  { key: 'latest', label: '최신순' },
];

type StoreRangeFilterKey = 'area' | 'sales' | 'profit' | 'premium' | 'rent';

const filterButtons: { key: StoreRangeFilterKey; baseLabel: string }[] = [
  { key: 'area', baseLabel: '면적' },
  { key: 'sales', baseLabel: '예상매출' },
  { key: 'profit', baseLabel: '수익률' },
  { key: 'premium', baseLabel: '권리금' },
  { key: 'rent', baseLabel: '임대료' },
];

interface StoreToolbarProps {
  sortKey: StoreSortKey;
  onChangeSort: (key: StoreSortKey) => void;
  industryLabel: string;
  districtLabel: string;
  filterLabels: Record<StoreRangeFilterKey, string>;
  hasAnyFilter: boolean;
  onOpenRangeFilter: (key: StoreRangeFilterKey) => void;
  onResetFilters: () => void;
}

const StoreToolbar = ({
  sortKey,
  onChangeSort,
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

      <SortMenu sortKey={sortKey} onChangeSort={onChangeSort} />
    </div>
  );
};

interface SortMenuProps {
  sortKey: StoreSortKey;
  onChangeSort: (key: StoreSortKey) => void;
}

/** 정렬 선택 — 툴바 폭을 아끼려고 아이콘 버튼 하나로 접고, 누르면 옵션을 펼친다 */
const SortMenu = ({ sortKey, onChangeSort }: SortMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentLabel =
    sortOptions.find((option) => option.key === sortKey)?.label ?? '';

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative ml-auto">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`정렬: ${currentLabel}`}
        title={currentLabel}
        className={`flex h-[42px] w-[42px] items-center justify-center rounded-lg border bg-white transition ${
          isOpen
            ? 'border-blue-600 text-blue-600'
            : 'border-[#d8dde5] text-gray-46 hover:border-blue-600 hover:text-blue-600'
        }`}
      >
        <FilterIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <ul
          role="menu"
          className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-[#e5e8eb] bg-white p-1 shadow-[0_8px_24px_rgba(25,31,40,0.12)]"
        >
          {sortOptions.map((option) => (
            <li key={option.key}>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={sortKey === option.key}
                onClick={() => {
                  onChangeSort(option.key);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-bold transition hover:bg-[#f5f8ff] ${
                  sortKey === option.key ? 'text-blue-600' : 'text-gray-46'
                }`}
              >
                {option.label}
                {sortKey === option.key && <CheckIcon className="h-4 w-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StoreToolbar;
