interface CategoryTabsProps {
  categories: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd?: () => void;
  className?: string;
}

const CategoryTabs = ({
  categories,
  activeIndex,
  onSelect,
  onAdd,
  className = '',
}: CategoryTabsProps) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {onAdd && (
      <button
        type="button"
        onClick={onAdd}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
      >
        카테고리 추가하기
      </button>
    )}
    {categories.map((category, index) => (
      <button
        key={category}
        type="button"
        onClick={() => onSelect(index)}
        className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
          activeIndex === index
            ? 'border-blue-600 bg-blue-300 text-blue-600'
            : 'border-[#e5e8eb] bg-white text-gray-46 hover:border-blue-600 hover:text-blue-600'
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);

export default CategoryTabs;
