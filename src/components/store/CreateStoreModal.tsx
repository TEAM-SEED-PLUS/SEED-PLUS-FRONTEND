import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  createBuilderStore,
  getCommercialAreas,
  type CommercialAreaResponse,
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
  name: string;
  industryId: string;
  regionId: string;
  commercialAreaId: string;
  address: string;
  area: string;
  expectedMonthlySales: string;
  expectedProfitRate: string;
  investmentAmount: string;
  investmentPaybackMonths: string;
  deposit: string;
  monthlyRent: string;
};

const initialForm: FormState = {
  name: '',
  industryId: '',
  regionId: '',
  commercialAreaId: '',
  address: '',
  area: '',
  expectedMonthlySales: '',
  expectedProfitRate: '',
  investmentAmount: '',
  investmentPaybackMonths: '',
  deposit: '',
  monthlyRent: '',
};

const inputClass =
  'h-12 w-full rounded-sm border border-[#d8dde5] bg-white px-4 text-sm text-[#191f28] outline-none placeholder:text-[#8b95a1] focus:border-blue-600';
const labelClass = 'mb-2 block text-sm font-medium text-[#4e5968]';
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
    label: '예상매출(만원)',
    placeholder: '예) 4600',
    minimum: 0,
  },
  {
    field: 'expectedProfitRate',
    label: '수익률(%)',
    placeholder: '예) 20',
    minimum: -100,
  },
  {
    field: 'investmentAmount',
    label: '투자금(만원)',
    placeholder: '예) 5000',
    minimum: 0,
  },
  {
    field: 'investmentPaybackMonths',
    label: '투자회수기간(개월)',
    placeholder: '예) 22',
    minimum: 0,
  },
  {
    field: 'deposit',
    label: '보증금(만원)',
    placeholder: '예) 3000',
    minimum: 0,
  },
  {
    field: 'monthlyRent',
    label: '임대료(만원)',
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
  const [commercialAreas, setCommercialAreas] = useState<
    CommercialAreaResponse[]
  >([]);
  const [isAreaLoading, setIsAreaLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const hasSelectedRegion = Boolean(form.regionId);
  const hasNoCommercialAreas =
    hasSelectedRegion && !isAreaLoading && commercialAreas.length === 0;

  useEffect(() => {
    if (!form.regionId) {
      return;
    }

    let active = true;

    getCommercialAreas(Number(form.regionId))
      .then((areas) => {
        if (active) {
          setCommercialAreas(areas);
        }
      })
      .catch(() => {
        if (active) {
          setCommercialAreas([]);
          setErrorMessage('상권 목록을 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (active) {
          setIsAreaLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [form.regionId]);

  const updateField = (field: keyof FormState, value: string) => {
    setErrorMessage('');
    if (field === 'regionId') {
      setCommercialAreas([]);
      setIsAreaLoading(Boolean(value));
    }

    setForm((previous) => ({
      ...previous,
      [field]: value,
      ...(field === 'regionId' ? { commercialAreaId: '' } : {}),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasNoCommercialAreas) {
      setErrorMessage('선택한 지역에 등록 가능한 상권이 없습니다.');
      return;
    }

    if (Object.values(form).some((value) => !value.trim())) {
      setErrorMessage('모든 항목을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await createBuilderStore({
        regionId: Number(form.regionId),
        commercialAreaId: Number(form.commercialAreaId),
        industryId: Number(form.industryId),
        name: form.name.trim(),
        building: { address: form.address.trim() },
        metrics: {
          area: Number(form.area),
          expectedMonthlySales: toWon(form.expectedMonthlySales),
          expectedProfitRate: Number(form.expectedProfitRate),
          investmentAmount: toWon(form.investmentAmount),
          investmentPaybackMonths: Number(form.investmentPaybackMonths),
          deposit: toWon(form.deposit),
          monthlyRent: toWon(form.monthlyRent),
        },
        visibilityStatus: 'PUBLIC',
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
    <div className="scrollbar-hide fixed inset-0 z-40 flex justify-center overflow-y-auto bg-white/70 px-6 pb-6 pt-[calc(var(--header-height)+16px)] backdrop-blur-[1px]">
      <section className="scrollbar-hide relative max-h-[calc(100vh-var(--header-height)-32px)] w-full max-w-[594px] overflow-y-auto bg-white px-6 pb-6 pt-6 shadow-[0_18px_60px_rgba(25,31,40,0.12)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-2 top-1 flex h-8 w-8 items-center justify-center text-3xl font-light text-[#4e5968] transition hover:text-[#191f28]"
        >
          x
        </button>

        <div>
          <h2 className="text-2xl font-extrabold text-[#191f28]">
            내 상가 만들기
          </h2>
          <p className="mt-5 text-base font-medium text-[#333d4b]">
            정보를 등록하면 상가가 리스트에 등록됩니다.
          </p>
        </div>

        <form
          className="mt-6 grid grid-cols-1 gap-5 border-t border-[#d8dde5] pt-6 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <label className="block sm:col-span-2">
            <span className={labelClass}>상가명</span>
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="예) 성수 스페셜티 카페"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className={labelClass}>업종</span>
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

          <label className="block sm:col-span-2">
            <span className={labelClass}>상권</span>
            <select
              value={form.commercialAreaId}
              onChange={(event) =>
                updateField('commercialAreaId', event.target.value)
              }
              disabled={!form.regionId || isAreaLoading || hasNoCommercialAreas}
              className={inputClass}
            >
              <option value="">
                {isAreaLoading
                  ? '상권을 불러오는 중입니다'
                  : hasNoCommercialAreas
                    ? '선택 가능한 상권이 없습니다'
                    : '상권을 선택하세요'}
              </option>
              {commercialAreas.map((area) => (
                <option
                  key={area.commercialAreaId}
                  value={area.commercialAreaId}
                >
                  {area.name}
                </option>
              ))}
            </select>
            {hasNoCommercialAreas && (
              <span className="mt-2 block text-sm font-medium text-[#e5484d]">
                선택한 지역에는 등록 가능한 상권 데이터가 없습니다.
              </span>
            )}
          </label>

          <label className="block sm:col-span-2">
            <span className={labelClass}>주소</span>
            <input
              value={form.address}
              onChange={(event) => updateField('address', event.target.value)}
              placeholder="예) 서울특별시 강남구 테헤란로 123"
              className={inputClass}
            />
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
            <p className="text-sm font-medium text-[#e5484d] sm:col-span-2">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isAreaLoading || hasNoCommercialAreas}
            className="mt-2 h-14 w-full rounded-lg bg-blue-600 text-lg font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#b0c4f5] sm:col-span-2"
          >
            {isSubmitting ? '등록 중...' : '확인'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default CreateStoreModal;
