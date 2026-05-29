import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  calculateProfitAnalysis,
  getApiErrorMessage,
  type IndustryResponse,
  type ProfitAnalysisResponse,
  type RegionResponse,
} from '@/api';

interface RevenueEstimateModalProps {
  industries: IndustryResponse[];
  districts: RegionResponse[];
  onClose: () => void;
}

type RevenueForm = {
  storeName: string;
  staff: string;
  industryCode: string;
  regionCode: string;
  area: string;
  invest: string;
  rent: string;
  premium: string;
};

const initialForm: RevenueForm = {
  storeName: '',
  staff: '2',
  industryCode: '',
  regionCode: '',
  area: '',
  invest: '',
  rent: '',
  premium: '',
};

const inputClass =
  'h-11 w-full rounded-md border border-[#d8dde5] bg-white px-3 text-sm text-[#191f28] outline-none placeholder:text-[#8b95a1] focus:border-blue-600';

const labelClass = 'mb-2 block text-sm font-medium text-[#333d4b]';
const toNumber = (value: string) => Number(value.trim());
const formatNumber = (value?: number, digits = 0) =>
  value === undefined || Number.isNaN(value)
    ? '-'
    : value.toLocaleString('ko-KR', {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
      });

const RevenueEstimateModal = ({
  industries,
  districts,
  onClose,
}: RevenueEstimateModalProps) => {
  const [form, setForm] = useState<RevenueForm>(initialForm);
  const [result, setResult] = useState<ProfitAnalysisResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setForm((current) => ({
      ...current,
      industryCode:
        current.industryCode || String(industries[0]?.industryCode ?? ''),
      regionCode: current.regionCode || String(districts[0]?.code ?? ''),
    }));
  }, [districts, industries]);

  const updateField = (field: keyof RevenueForm, value: string) => {
    setErrorMessage('');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.industryCode ||
      !form.regionCode ||
      !form.area ||
      !form.invest ||
      !form.rent ||
      !form.premium ||
      !form.staff
    ) {
      setErrorMessage('수익률 추정에 필요한 값을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await calculateProfitAnalysis({
        industryCode: form.industryCode,
        regionCode: form.regionCode,
        area: toNumber(form.area),
        invest: toNumber(form.invest),
        rent: toNumber(form.rent),
        premium: toNumber(form.premium),
        staff: Math.round(toNumber(form.staff)),
      });
      setResult(response);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-14 z-30 flex items-start justify-center overflow-y-auto bg-[#f5f6f8] pt-30 px-8 py-6">
      <section className="relative grid w-full max-w-[1120px] grid-cols-1 gap-8 lg:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl font-light text-[#6b7684] shadow-sm transition hover:bg-[#f2f4f6] hover:text-[#191f28]"
        >
          ×
        </button>

        <div className="rounded-lg border border-[#d8dde5] bg-white p-6">
          <div className="border-b border-[#e5e8eb] pb-4">
            <h2 className="text-xl font-bold text-[#191f28]">
              내 상가 수익률 추정
            </h2>
            <p className="mt-2 text-xs font-medium text-[#4e5968]">
              업종과 지역을 선택하면 예상 매출과 수익률을 계산합니다.
            </p>
          </div>

          <form
            className="mt-5 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <label className="block">
              <span className={labelClass}>상가명</span>
              <input
                type="text"
                value={form.storeName}
                onChange={(event) =>
                  updateField('storeName', event.target.value)
                }
                placeholder="예) 성수 스페셜티 카페"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>예상직원수</span>
              <input
                type="number"
                min="0"
                value={form.staff}
                onChange={(event) => updateField('staff', event.target.value)}
                placeholder="예) 2"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>업종선택</span>
              <select
                value={form.industryCode}
                onChange={(event) =>
                  updateField('industryCode', event.target.value)
                }
                className={inputClass}
              >
                {industries.map((industry) => (
                  <option
                    key={industry.industryId}
                    value={String(industry.industryCode)}
                  >
                    {industry.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>지역선택</span>
              <select
                value={form.regionCode}
                onChange={(event) =>
                  updateField('regionCode', event.target.value)
                }
                className={inputClass}
              >
                {districts.map((district) => (
                  <option key={district.regionId} value={String(district.code)}>
                    {district.sigungu}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>면적(m²)</span>
              <input
                type="number"
                min="0"
                value={form.area}
                onChange={(event) => updateField('area', event.target.value)}
                placeholder="예) 50"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>초기투자금(만원)</span>
              <input
                type="number"
                min="0"
                value={form.invest}
                onChange={(event) => updateField('invest', event.target.value)}
                placeholder="예) 5000"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>월 임대료(만원)</span>
              <input
                type="number"
                min="0"
                value={form.rent}
                onChange={(event) => updateField('rent', event.target.value)}
                placeholder="예) 300"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>권리금(만원)</span>
              <input
                type="number"
                min="0"
                value={form.premium}
                onChange={(event) => updateField('premium', event.target.value)}
                placeholder="예) 3000"
                className={inputClass}
              />
            </label>

            {errorMessage && (
              <p className="text-sm font-medium text-[#e5484d] md:col-span-2">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-12 rounded-md bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#b0c4f5] md:col-span-2"
            >
              {isSubmitting ? '수익률 추정 중...' : '수익률 추정'}
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-[#d8dde5] bg-white p-6">
          <div className="flex items-start gap-2 rounded-md border border-[#e5484d] bg-[#fffafa] px-3 py-3 text-xs font-medium leading-relaxed text-[#e5484d]">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#e5484d] text-[10px]">
              i
            </span>
            <p>
              본 추정치는 서울시 상권 데이터, 카드 매출 데이터, 국토교통부
              실거래가를 기반으로 산출된 참고용 수치입니다. 실제 수익은 운영
              역량, 시장 상황에 따라 달라질 수 있습니다.
            </p>
          </div>

          <div className="mt-4 rounded-lg bg-blue-600 p-5 text-white">
            <p className="text-lg font-bold">나의 예상 월 매출은?</p>
            <div className="mt-5 flex items-end gap-2">
              <strong className="text-3xl font-extrabold tracking-tight">
                {formatNumber(result?.result.monthlyRev)}
              </strong>
              <span className="mb-1 text-sm font-bold">만원</span>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">직원 2명 인건비</p>
                <p className="mt-2 text-xl font-extrabold">
                  {formatNumber(result?.result.staffCost)}만원 반영
                </p>
              </div>
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">업종 평균 대비</p>
                <p className="mt-2 text-xl font-extrabold">
                  {formatNumber(result?.assumptions.baseProfitRate, 1)}% 기준
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">예상 순이익률</p>
                <p className="mt-2 text-right text-xl font-extrabold">
                  {formatNumber(result?.result.profitRate, 1)}%
                </p>
              </div>
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">투자 회수 기간</p>
                <p className="mt-2 text-right text-xl font-extrabold">
                  {formatNumber(result?.result.paybackMonths, 1)}개월
                </p>
              </div>
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">Property Score</p>
                <p className="mt-2 text-right text-xl font-extrabold">
                  {formatNumber(result?.result.propertyScore, 0)}점
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-4 h-12 w-full rounded-md bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700"
          >
            내 상가 목록에 저장하기
          </button>
        </div>
      </section>
    </div>
  );
};

export default RevenueEstimateModal;
