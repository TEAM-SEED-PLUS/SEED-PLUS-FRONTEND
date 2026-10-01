interface CategoryChipsProps {
  /** '전체'를 포함한 전체 선택지 */
  options: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
  label: string;
}

/** 시안의 카테고리 칩 — 선택은 파란 배경, 나머지는 흰 배경에 테두리 */
const CategoryChips = ({
  options,
  selected,
  onSelect,
  label,
}: CategoryChipsProps) => (
  <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
    {options.map((option) => {
      const isSelected = option === selected;
      return (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={isSelected}
          onClick={() => onSelect(option)}
          className={`h-8 rounded-md px-3.5 text-xs font-bold transition ${
            isSelected
              ? 'bg-blue-600 text-white'
              : 'border border-[#e5e8eb] bg-white text-[#4e5968] hover:border-blue-600 hover:text-blue-600'
          }`}
        >
          {option}
        </button>
      );
    })}
  </div>
);

export default CategoryChips;
