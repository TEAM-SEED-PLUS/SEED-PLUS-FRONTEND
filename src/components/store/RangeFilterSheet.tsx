import { useState } from 'react';

export type RangeFilterValue = {
  label: string;
  min?: number;
  max?: number;
};

export type RangeFilterUnit = 'pyeong' | 'squareMeter' | 'manwon' | 'percent';

export type RangeFilterConfig = {
  id: string;
  title: string;
  unit: RangeFilterUnit;
  presets: RangeFilterValue[];
  directUnitOptions?: { label: string; value: RangeFilterUnit }[];
  directLabel?: string;
  maxWarningValue?: number;
  maxWarningMessage?: string;
};

interface RangeFilterSheetProps {
  config: RangeFilterConfig;
  currentFilter: RangeFilterValue;
  onClose: () => void;
  onApply: (filter: RangeFilterValue) => void;
  onReset: () => void;
}

const inputClass =
  'h-12 w-full rounded-lg border border-[#d8dde5] px-4 text-sm outline-none placeholder:text-[#8b95a1] focus:border-blue-600';

const convertValue = (
  value: number,
  unit: RangeFilterUnit,
  isMinimum: boolean
) => {
  if (unit !== 'pyeong') {
    return value;
  }
  const converted = value * 3.3058;
  return isMinimum ? Math.floor(converted) : Math.ceil(converted);
};

const formatUnitLabel = (unit: RangeFilterUnit) => {
  if (unit === 'pyeong') return '평';
  if (unit === 'squareMeter') return 'm²';
  if (unit === 'manwon') return '만원';
  return '%';
};

const findPresetFilter = (
  currentFilter: RangeFilterValue,
  presets: RangeFilterValue[]
) =>
  presets.find(
    (preset) =>
      preset.min === currentFilter.min && preset.max === currentFilter.max
  );

const RangeFilterSheet = ({
  config,
  currentFilter,
  onClose,
  onApply,
  onReset,
}: RangeFilterSheetProps) => {
  const matchingPreset = findPresetFilter(currentFilter, config.presets);
  const usesPreset = Boolean(matchingPreset);
  const [selectedLabel, setSelectedLabel] = useState(
    matchingPreset?.label ?? '직접 입력'
  );
  const [minimum, setMinimum] = useState(
    !usesPreset && currentFilter.min !== undefined
      ? String(currentFilter.min)
      : ''
  );
  const [maximum, setMaximum] = useState(
    !usesPreset && currentFilter.max !== undefined
      ? String(currentFilter.max)
      : ''
  );
  const [unit, setUnit] = useState<RangeFilterUnit>(
    config.directUnitOptions?.[0]?.value ?? config.unit
  );
  const [errorMessage, setErrorMessage] = useState('');

  const selectPreset = (preset: RangeFilterValue) => {
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
      const filter = config.presets.find(
        (preset) => preset.label === selectedLabel
      );
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
      setErrorMessage('최소값은 최대값보다 클 수 없습니다.');
      return;
    }

    const warningTarget = Math.max(minimumValue ?? 0, maximumValue ?? 0);
    if (
      config.maxWarningValue !== undefined &&
      warningTarget > config.maxWarningValue
    ) {
      setErrorMessage(
        config.maxWarningMessage ?? `${config.maxWarningValue}을 초과했습니다.`
      );
      return;
    }

    const unitLabel = formatUnitLabel(unit);
    const label = `${minimum || '0'}~${maximum || '이상'}${unitLabel}`;
    onApply({
      label,
      min:
        minimumValue === undefined
          ? undefined
          : convertValue(minimumValue, unit, true),
      max:
        maximumValue === undefined
          ? undefined
          : convertValue(maximumValue, unit, false),
    });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-30 flex items-end bg-black/20">
      <button
        type="button"
        aria-label={`${config.title} 닫기`}
        onClick={onClose}
        className="absolute inset-0"
      />
      <section className="relative z-10 w-full rounded-t-2xl bg-white px-5 pb-7 pt-4 shadow-[0_-8px_30px_rgba(25,31,40,0.14)] sm:mx-auto sm:mb-5 sm:max-w-[560px] sm:rounded-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d8dde5] sm:hidden" />
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#191f28]">
            {config.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="h-8 w-8 text-2xl leading-none text-[#4e5968]"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {config.presets.map((preset) => (
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
          <p className="mb-3 text-sm font-bold text-[#333d4b]">
            {config.directLabel ?? '직접 입력'}
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={minimum}
              onChange={(event) =>
                updateDirectValue(setMinimum, event.target.value)
              }
              placeholder="최소값"
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
              placeholder="최대값"
              className={inputClass}
            />
            {config.directUnitOptions && (
              <select
                value={unit}
                onChange={(event) =>
                  setUnit(event.target.value as RangeFilterUnit)
                }
                className="h-12 rounded-lg border border-[#d8dde5] px-3 text-sm text-[#333d4b] outline-none focus:border-blue-600"
              >
                {config.directUnitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
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

export default RangeFilterSheet;
