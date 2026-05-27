import { useState } from 'react';

type AreaFilter = {
  label: string;
  minArea?: number;
  maxArea?: number;
};

interface AreaFilterSheetProps {
  currentFilter: AreaFilter;
  onClose: () => void;
  onApply: (filter: AreaFilter) => void;
  onReset: () => void;
}

type Unit = 'pyeong' | 'squareMeter';

const presets: AreaFilter[] = [
  { label: '전체' },
  { label: '10평 이하', maxArea: 33 },
  { label: '10~20평', minArea: 33, maxArea: 66 },
  { label: '20~30평', minArea: 66, maxArea: 99 },
  { label: '30~50평', minArea: 99, maxArea: 165 },
  { label: '50평 이상', minArea: 165 },
];

const inputClass =
  'h-12 w-full rounded-lg border border-[#d8dde5] px-4 text-sm outline-none placeholder:text-[#8b95a1] focus:border-blue-600';
const toSquareMeters = (value: number, unit: Unit, isMinimum: boolean) => {
  if (unit === 'squareMeter') {
    return value;
  }
  const converted = value * 3.3058;
  return isMinimum ? Math.floor(converted) : Math.ceil(converted);
};
const findPresetFilter = (currentFilter: AreaFilter) =>
  presets.find(
    (preset) =>
      preset.minArea === currentFilter.minArea &&
      preset.maxArea === currentFilter.maxArea
  );

const AreaFilterSheet = ({
  currentFilter,
  onClose,
  onApply,
  onReset,
}: AreaFilterSheetProps) => {
  const matchingPreset = findPresetFilter(currentFilter);
  const usesPreset = Boolean(matchingPreset);
  const [selectedLabel, setSelectedLabel] = useState(
    matchingPreset?.label ?? '직접 입력'
  );
  const [minimum, setMinimum] = useState(
    !usesPreset && currentFilter.minArea !== undefined
      ? String(currentFilter.minArea)
      : ''
  );
  const [maximum, setMaximum] = useState(
    !usesPreset && currentFilter.maxArea !== undefined
      ? String(currentFilter.maxArea)
      : ''
  );
  const [unit, setUnit] = useState<Unit>(usesPreset ? 'pyeong' : 'squareMeter');
  const [errorMessage, setErrorMessage] = useState('');

  const selectPreset = (preset: AreaFilter) => {
    setSelectedLabel(preset.label);
    setMinimum('');
    setMaximum('');
    setErrorMessage('');
  };

  const updateDirectValue = (
    setter: (value: string) => void,
    value: string
  ) => {
    setter(value);
    setSelectedLabel('직접 입력');
    setErrorMessage('');
  };

  const applyFilter = () => {
    if (selectedLabel !== '직접 입력') {
      const filter = presets.find((preset) => preset.label === selectedLabel);
      if (filter?.label === '전체') {
        onReset();
        return;
      }
      if (filter) {
        onApply(filter);
      }
      return;
    }

    if (!minimum && !maximum) {
      onReset();
      return;
    }

    const minimumValue = minimum ? Number(minimum) : undefined;
    const maximumValue = maximum ? Number(maximum) : undefined;

    if (
      minimumValue !== undefined &&
      maximumValue !== undefined &&
      minimumValue > maximumValue
    ) {
      setErrorMessage('최소 면적은 최대 면적보다 클 수 없습니다.');
      return;
    }

    const unitLabel = unit === 'pyeong' ? '평' : 'm²';
    const label = `${minimum || '0'}~${maximum || '이상'}${unitLabel}`;
    onApply({
      label,
      minArea:
        minimumValue === undefined
          ? undefined
          : toSquareMeters(minimumValue, unit, true),
      maxArea:
        maximumValue === undefined
          ? undefined
          : toSquareMeters(maximumValue, unit, false),
    });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-30 flex items-end bg-black/20">
      <button
        type="button"
        aria-label="면적 필터 닫기"
        onClick={onClose}
        className="absolute inset-0"
      />
      <section className="relative z-10 w-full rounded-t-2xl bg-white px-5 pb-7 pt-4 shadow-[0_-8px_30px_rgba(25,31,40,0.14)] sm:mx-auto sm:mb-5 sm:max-w-[560px] sm:rounded-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d8dde5] sm:hidden" />
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#191f28]">면적 필터</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="h-8 w-8 text-2xl leading-none text-[#4e5968]"
          >
            x
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {presets.map((preset) => (
            <button
              type="button"
              key={preset.label}
              onClick={() => selectPreset(preset)}
              className={`h-11 rounded-lg border text-sm font-bold transition ${
                selectedLabel === preset.label
                  ? 'border-blue-600 bg-[#edf3ff] text-blue-600'
                  : 'border-[#d8dde5] text-[#4e5968]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="mt-5 border-t border-[#e5e8eb] pt-5">
          <p className="mb-3 text-sm font-bold text-[#333d4b]">직접 입력</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={minimum}
              onChange={(event) =>
                updateDirectValue(setMinimum, event.target.value)
              }
              placeholder="최소 면적"
              className={inputClass}
            />
            <span className="text-sm text-[#8b95a1]">~</span>
            <input
              type="number"
              min="0"
              value={maximum}
              onChange={(event) =>
                updateDirectValue(setMaximum, event.target.value)
              }
              placeholder="최대 면적"
              className={inputClass}
            />
            <select
              value={unit}
              onChange={(event) => setUnit(event.target.value as Unit)}
              className="h-12 rounded-lg border border-[#d8dde5] px-3 text-sm text-[#333d4b] outline-none focus:border-blue-600"
            >
              <option value="pyeong">평</option>
              <option value="squareMeter">m²</option>
            </select>
          </div>
          {errorMessage && (
            <p className="mt-2 text-sm font-medium text-[#e5484d]">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onReset}
            className="h-12 flex-1 rounded-lg border border-[#d8dde5] bg-white text-sm font-bold text-[#4e5968]"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={applyFilter}
            className="h-12 flex-[2] rounded-lg bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            적용
          </button>
        </div>
      </section>
    </div>
  );
};

export default AreaFilterSheet;
