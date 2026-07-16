import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  createBuilderStore,
  type IndustryResponse,
  type RegionResponse,
} from '@/api';

interface CreateStoreModalProps {
  industries: IndustryResponse[];
  districts: RegionResponse[];
  onClose: () => void;
  onCreated: () => void;
}

type FormState = {
  industryId: string;
  regionId: string;
  area: string;
  expectedMonthlySales: string;
  expectedProfitRate: string;
  deposit: string;
  monthlyRent: string;
};

const initialForm: FormState = {
  industryId: '',
  regionId: '',
  area: '',
  expectedMonthlySales: '',
  expectedProfitRate: '',
  deposit: '',
  monthlyRent: '',
};

const inputClass =
  'h-12 w-full rounded-sm border border-[#d8dde5] bg-white px-4 text-sm text-[#191f28] outline-none placeholder:text-[#8b95a1] focus:border-blue-600';
const labelClass = 'mb-2 block text-sm font-medium text-[#4e5968]';
const FIXED_COMMERCIAL_AREA_ID = 1;
const storeNamePlaceholder = '내 상가';
const toWon = (value: string) => Number(value) * 10000;
const metricFields: {
  field: keyof FormState;
  label: string;
  placeholder: string;
  minimum: number;
}[] = [
  { field: 'area', label: '면적(m²)', placeholder: '예) 65', minimum: 0 },
  {
    field: 'expectedMonthlySales',
    label: '예상매출',
    placeholder: '예) 4600',
    minimum: 0,
  },
  {
    field: 'expectedProfitRate',
    label: '수익률',
    placeholder: '예) 20',
    minimum: 0,
  },
  { field: 'deposit', label: '권리금', placeholder: '예) 3000', minimum: 0 },
  {
    field: 'monthlyRent',
    label: '임대료',
    placeholder: '예) 250',
    minimum: 0,
  },
];

const CreateStoreModal = ({
  industries,
  districts,
  onClose,
  onCreated,
}: CreateStoreModalProps) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const selectedDistrict = districts.find(
    (district) => String(district.regionId) === form.regionId
  );
  const selectedIndustry = industries.find(
    (industry) => String(industry.industryId) === form.industryId
  );

  const updateField = (field: keyof FormState, value: string) => {
    setErrorMessage('');

    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Object.values(form).some((value) => !value.trim())) {
      setErrorMessage('모든 항목을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const paybackMonths = Math.max(
        1,
        Math.round(
          (Number(form.deposit) || 0) /
            Math.max(Number(form.expectedMonthlySales) || 1, 1)
        )
      );

      await createBuilderStore({
        regionId: Number(form.regionId),
        commercialAreaId: FIXED_COMMERCIAL_AREA_ID,
        industryId: Number(form.industryId),
        name: `${selectedDistrict?.sigungu ?? ''} ${
          selectedIndustry?.name ?? storeNamePlaceholder
        }`.trim(),
        building: {
          address: selectedDistrict
            ? `${selectedDistrict.sido} ${selectedDistrict.sigungu}`
            : storeNamePlaceholder,
          name: 'Seed Building',
          floor: 15,
          totalArea: Number(form.area),
          locationComplete: true,
        },
        metrics: {
          area: Number(form.area),
          expectedMonthlySales: toWon(form.expectedMonthlySales),
          expectedProfitRate: Number(form.expectedProfitRate),
          investmentAmount: toWon(form.deposit),
          investmentPaybackMonths: paybackMonths,
          deposit: toWon(form.deposit),
          monthlyRent: toWon(form.monthlyRent),
        },
        description: '테스트 가상 점포',
        visibilityStatus: 'PUBLIC',
        imageUrls: [],
      });
      onCreated();
      onClose();
    } catch {
      setErrorMessage('상가를 등록하지 못했습니다. 입력값을 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="scrollbar-hide fixed inset-0 z-40 flex justify-center overflow-y-auto bg-white/75 px-6 pb-8 pt-[calc(var(--header-height)+24px)] backdrop-blur-[1px]">
      <section className="scrollbar-hide relative w-full max-w-[594px] overflow-y-auto bg-white px-6 pb-3 pt-6 shadow-[0_18px_60px_rgba(25,31,40,0.08)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-2xl font-light text-[#4e5968] transition hover:text-[#191f28]"
        >
          ×
        </button>

        <div>
          <h2 className="text-lg font-extrabold text-[#191f28]">
            내 상가 만들기
          </h2>
          <p className="mt-2 text-xs font-medium text-[#333d4b]">
            정보를 등록하면 상가가 리스트에 등록됩니다.
          </p>
        </div>

        <form
          className="mt-5 grid grid-cols-1 gap-4 border-t border-[#d8dde5] pt-4"
          onSubmit={handleSubmit}
        >
          <label className="block">
            <span className={labelClass}>전체</span>
            <select
              value={form.industryId}
              onChange={(event) =>
                updateField('industryId', event.target.value)
              }
              className={inputClass}
            >
              <option value="">업종을 선택하세요</option>
              {industries.map((industry) => (
                <option key={industry.industryId} value={industry.industryId}>
                  {industry.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={labelClass}>지역</span>
            <select
              value={form.regionId}
              onChange={(event) => updateField('regionId', event.target.value)}
              className={inputClass}
            >
              <option value="">지역을 선택하세요</option>
              {districts.map((district) => (
                <option key={district.regionId} value={district.regionId}>
                  {district.sigungu}
                </option>
              ))}
            </select>
          </label>

          {metricFields.map(({ field, label, placeholder, minimum }) => (
            <label key={field} className="block">
              <span className={labelClass}>{label}</span>
              <input
                type="number"
                min={minimum}
                value={form[field]}
                onChange={(event) => updateField(field, event.target.value)}
                placeholder={placeholder}
                className={inputClass}
              />
            </label>
          ))}

          {errorMessage && (
            <p className="text-sm font-medium text-[#e5484d]">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 h-12 w-full rounded-md bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#b0c4f5]"
          >
            {isSubmitting ? '생성 중...' : '생성하기'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default CreateStoreModal;
