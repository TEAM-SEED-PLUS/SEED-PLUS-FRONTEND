import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  calculateProfitAnalysis,
  createBuilderStore,
  getApiErrorMessage,
  type IndustryResponse,
  type ProfitAnalysisResponse,
  type RegionResponse,
  updateBuilderStoreVisibility,
} from '@/api';
import { useAuth } from '@/auth';
import Skeleton from '@/components/ui/Skeleton';
import { SpinnerIcon } from '@/components/ui/icons';

interface RevenueEstimateModalProps {
  industries: IndustryResponse[];
  districts: RegionResponse[];
  legalDongs: RegionResponse[];
  onClose: () => void;
  onCreated: () => void;
}

// 예상매출·수익률은 산출 전용(RPC-02) — 입력 필드로 두지 않는다.
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

const FIXED_COMMERCIAL_AREA_ID = 1;
const inputClass =
  'h-11 w-full rounded-md border border-[#d8dde5] bg-white px-3 text-sm text-[#191f28] outline-none placeholder:text-[#8b95a1] focus:border-blue-600';
const labelClass = 'mb-2 block text-sm font-medium text-[#333d4b]';

const toNumber = (value: string) => Number(value.trim());
const toWon = (value: number) => Math.round(value * 10000);
const formatNumber = (value?: number, digits = 0) =>
  value === undefined || Number.isNaN(value)
    ? '-'
    : value.toLocaleString('ko-KR', {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
      });

const getRepresentativeLegalDongCode = (
  districtCode: string,
  districts: RegionResponse[],
  legalDongs: RegionResponse[]
) => {
  const selectedDistrict = districts.find(
    (district) => String(district.code) === districtCode
  );

  return (
    legalDongs.find((dong) => dong.sigungu === selectedDistrict?.sigungu)
      ?.code ?? ''
  );
};

const RevenueEstimateModal = ({
  industries,
  districts,
  legalDongs,
  onClose,
  onCreated,
}: RevenueEstimateModalProps) => {
  const [form, setForm] = useState<RevenueForm>(initialForm);
  const [result, setResult] = useState<ProfitAnalysisResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [mobileStep, setMobileStep] = useState<'input' | 'result'>('input');
  // 저장 완료 → 공유 제안 → 공유 완료 2단계 모달(RPC-05)
  const [shareStep, setShareStep] = useState<'ask' | 'done' | null>(null);
  const [savedStoreId, setSavedStoreId] = useState<number | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useAuth();
  const displayName = user?.name?.trim() || '회원';

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const selectedDistrict = districts.find(
    (district) => String(district.code) === form.regionCode
  );
  const selectedIndustry = industries.find(
    (industry) => String(industry.industryCode) === form.industryCode
  );

  const updateField = (field: keyof RevenueForm, value: string) => {
    setErrorMessage('');
    setSaveMessage('');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // storeName은 신계약(2026-09-01)에서 계산 요청 필수값이 됐다.
    if (
      !form.storeName.trim() ||
      !form.industryCode ||
      !form.regionCode ||
      !form.area ||
      !form.invest ||
      !form.rent ||
      !form.premium ||
      !form.staff
    ) {
      setErrorMessage(
        '상가명 포함, 수익률 추정에 필요한 값을 모두 입력해주세요.'
      );
      return;
    }

    const legalDongCode = getRepresentativeLegalDongCode(
      form.regionCode,
      districts,
      legalDongs
    );

    if (!legalDongCode) {
      setErrorMessage('선택한 구에 해당하는 법정동 코드를 찾을 수 없습니다.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await calculateProfitAnalysis({
        storeName: form.storeName.trim(),
        industryCode: form.industryCode,
        regionCode: legalDongCode,
        area: toNumber(form.area),
        invest: toNumber(form.invest),
        rent: toNumber(form.rent),
        premium: toNumber(form.premium),
        staff: Math.round(toNumber(form.staff)),
      });

      setResult(response);
      setMobileStep('result');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveStore = async () => {
    setErrorMessage('');
    setSaveMessage('');

    // 예상매출·수익률은 계산 결과로만 저장한다(RPC-02).
    if (!result) {
      setSaveMessage('수익률 추정을 먼저 완료해주세요.');
      return;
    }

    if (
      !form.storeName.trim() ||
      !selectedIndustry ||
      !selectedDistrict ||
      !form.area ||
      !form.invest ||
      !form.rent ||
      !form.premium
    ) {
      setSaveMessage('상가명과 저장에 필요한 값을 모두 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const expectedMonthlySales = result.result.monthlyRev;
      const expectedProfitRate = result.result.profitRate;
      const investmentPaybackMonths = result.result.paybackMonths;

      const created = await createBuilderStore({
        regionId: selectedDistrict.regionId,
        commercialAreaId: FIXED_COMMERCIAL_AREA_ID,
        industryId: selectedIndustry.industryId,
        name: form.storeName.trim(),
        building: {
          address: `${selectedDistrict.sido} ${selectedDistrict.sigungu}`,
          name: 'Seed Building',
          floor: 15,
          totalArea: toNumber(form.area),
          locationComplete: true,
        },
        metrics: {
          area: toNumber(form.area),
          expectedMonthlySales: toWon(expectedMonthlySales),
          expectedProfitRate,
          investmentAmount: toWon(toNumber(form.invest)),
          investmentPaybackMonths: Math.round(investmentPaybackMonths),
          monthlyRent: toWon(toNumber(form.rent)),
          deposit: toWon(toNumber(form.premium)),
        },
        description: '수익률 추정 계산기로 생성한 가상 점포',
        // 저장은 비공개가 기본. 공유에 동의해야 PUBLIC으로 전환한다(RPC-05).
        visibilityStatus: 'PRIVATE',
        imageUrls: [],
      });

      setSavedStoreId(created?.builderStoreId ?? null);
      setShareStep('ask');
    } catch (error) {
      setSaveMessage(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  /** 저장된 상가를 목록에 공개한다. */
  const handleShare = async () => {
    if (savedStoreId === null) {
      setSaveMessage(
        '공유에 필요한 상가 정보를 확인하지 못했습니다. 마이페이지에서 공개로 변경해주세요.'
      );
      setShareStep(null);
      return;
    }

    setIsSharing(true);
    try {
      await updateBuilderStoreVisibility(savedStoreId, 'PUBLIC');
      setShareStep('done');
    } catch (error) {
      setSaveMessage(getApiErrorMessage(error));
      setShareStep(null);
    } finally {
      setIsSharing(false);
    }
  };

  /** 모달을 닫고 '내 상가 만들기' 목록으로 돌아간다. */
  const closeAfterSave = () => {
    setShareStep(null);
    onCreated();
    onClose();
  };

  return (
    <div className="scrollbar-hide fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-white/75 px-8 py-6 pt-[calc(var(--header-height)+24px)] backdrop-blur-[1px]">
      <section className="relative grid w-full max-w-[1120px] grid-cols-1 gap-8 lg:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl font-light text-[#6b7684] shadow-sm transition hover:bg-[#f2f4f6] hover:text-[#191f28]"
        >
          ×
        </button>

        <div
          className={`rounded-lg border border-[#d8dde5] bg-white p-6 lg:block ${
            mobileStep === 'result' ? 'hidden' : 'block'
          }`}
        >
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
              <span className={labelClass}>예상 직원 수(명)</span>
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
              <span className={labelClass}>업종 선택</span>
              <select
                value={form.industryCode}
                onChange={(event) =>
                  updateField('industryCode', event.target.value)
                }
                className={inputClass}
              >
                <option value="" disabled>
                  업종을 선택하세요
                </option>
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
              <span className={labelClass}>지역 선택</span>
              <select
                value={form.regionCode}
                onChange={(event) =>
                  updateField('regionCode', event.target.value)
                }
                className={inputClass}
              >
                <option value="" disabled>
                  지역을 선택하세요
                </option>
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
              <span className={labelClass}>초기 투자금(만원)</span>
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
              className="mt-1 flex h-12 items-center justify-center gap-2 rounded-md bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#b0c4f5] md:col-span-2"
            >
              {isSubmitting && <SpinnerIcon className="h-5 w-5" />}
              {isSubmitting ? '수익률 추정 중...' : '수익률 추정'}
            </button>
          </form>
        </div>

        <div
          aria-busy={isSubmitting}
          className={`rounded-lg border border-[#d8dde5] bg-white p-6 lg:block ${
            mobileStep === 'input' ? 'hidden' : 'block'
          }`}
        >
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <h2 className="text-lg font-extrabold text-[#191f28]">
              수익률 계산 결과
            </h2>
            <button
              type="button"
              onClick={() => setMobileStep('input')}
              className="rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white"
            >
              입력으로 돌아가기
            </button>
          </div>

          <div className="flex items-start gap-2 rounded-md border border-[#e5484d] bg-[#fffafa] px-3 py-3 text-xs font-medium leading-relaxed text-[#e5484d]">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#e5484d] text-[10px]">
              i
            </span>
            <p>
              본 추정치는 서울시 상권 데이터, 카드 매출 데이터, 국토교통부
              실거래가를 기반으로 산출한 참고 수치입니다. 실제 수익은 운영 역량,
              시장 상황에 따라 달라질 수 있습니다.
            </p>
          </div>

          {result?.fallbackUsed && (
            <div className="mt-4 rounded-md border border-[#f5c518] bg-[#fff8e1] px-3 py-2 text-xs font-bold text-[#8a6d00]">
              실시간 수집에 실패해 최근 캐시 데이터 기반으로 산출된 결과입니다.
            </div>
          )}

          {(result?.warnings?.length ?? 0) > 0 && (
            <ul className="mt-4 space-y-1 rounded-md bg-[#f7f8fa] px-3 py-2 text-xs font-medium text-[#4e5968]">
              {result?.warnings?.map((warning) => (
                <li key={warning}>· {warning}</li>
              ))}
            </ul>
          )}

          <div className="mt-4 rounded-lg bg-blue-600 p-5 text-white">
            <p className="text-lg font-bold">나의 예상 월 매출은?</p>
            <div className="mt-5 flex items-end gap-2">
              {isSubmitting ? (
                <Skeleton tone="onDark" className="h-9 w-40" />
              ) : (
                <strong className="text-3xl font-extrabold tracking-tight">
                  {formatNumber(result?.result.monthlyRev)}
                </strong>
              )}
              <span className="mb-1 text-sm font-bold">만원</span>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">
                  직원 {form.staff || '-'}명 인건비
                </p>
                {isSubmitting ? (
                  <Skeleton tone="onDark" className="mt-2 h-7 w-28" />
                ) : (
                  <p className="mt-2 text-xl font-extrabold">
                    {formatNumber(result?.result.staffCost)}만원 반영
                  </p>
                )}
              </div>
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">업종 평균 대비</p>
                {isSubmitting ? (
                  <Skeleton tone="onDark" className="mt-2 h-7 w-24" />
                ) : (
                  <p className="mt-2 text-xl font-extrabold">
                    {formatNumber(result?.assumptions.baseProfitRate, 1)}% 기준
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">예상 순이익률</p>
                {isSubmitting ? (
                  <Skeleton tone="onDark" className="mt-2 ml-auto h-7 w-16" />
                ) : (
                  <p className="mt-2 text-right text-xl font-extrabold">
                    {formatNumber(result?.result.profitRate, 1)}%
                  </p>
                )}
              </div>
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">투자 회수 기간</p>
                {isSubmitting ? (
                  <Skeleton tone="onDark" className="mt-2 ml-auto h-7 w-20" />
                ) : (
                  <p className="mt-2 text-right text-xl font-extrabold">
                    {formatNumber(result?.result.paybackMonths, 1)}개월
                  </p>
                )}
              </div>
              <div className="rounded-md border border-white/25 bg-white/15 p-3">
                <p className="text-xs text-white/80">Property Score</p>
                {isSubmitting ? (
                  <Skeleton tone="onDark" className="mt-2 ml-auto h-7 w-16" />
                ) : (
                  <p className="mt-2 text-right text-xl font-extrabold">
                    {formatNumber(result?.result.propertyScore, 0)}점
                  </p>
                )}
              </div>
            </div>
          </div>

          {saveMessage && (
            <p className="mt-3 text-sm font-medium text-[#e5484d]">
              {saveMessage}
            </p>
          )}

          <button
            type="button"
            onClick={handleSaveStore}
            disabled={isSaving || isSubmitting || !result}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#b0c4f5]"
          >
            {isSaving && <SpinnerIcon className="h-5 w-5" />}
            {isSaving ? '저장 중...' : '내 상가 목록에 저장하기'}
          </button>
          <p className="mt-2 text-center text-xs font-medium text-[#8b95a1]">
            저장한 상가는 나만 볼 수 있어요. 저장 후 공유 여부를 선택할 수
            있습니다.
          </p>
        </div>
      </section>

      {shareStep === 'ask' && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-0 md:items-center md:px-6"
          role="dialog"
          aria-modal="true"
          aria-label="상가 저장 완료"
        >
          <div className="w-full max-w-[420px] rounded-t-2xl bg-white px-6 py-6 shadow-[0_18px_60px_rgba(25,31,40,0.18)] md:rounded-lg">
            <p className="text-base font-bold leading-relaxed text-[#191f28]">
              {displayName}님의 마이페이지에 상가가 성공적으로 저장되었어요!
            </p>
            <p className="mt-3 text-sm font-medium leading-relaxed text-[#4e5968]">
              저장한 상가를 &lsquo;내 상가 만들기&rsquo;에 공유할까요? 공유하면
              다른 사용자에게도 공개됩니다.
            </p>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={closeAfterSave}
                disabled={isSharing}
                className="h-11 flex-1 rounded-md border border-[#d8dde5] bg-white text-sm font-extrabold text-[#4e5968] transition hover:bg-[#f2f4f6] disabled:opacity-50"
              >
                아니요
              </button>
              <button
                type="button"
                onClick={handleShare}
                disabled={isSharing}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:bg-[#b0c4f5]"
              >
                {isSharing && <SpinnerIcon className="h-4 w-4" />}
                {isSharing ? '공유 중...' : '네'}
              </button>
            </div>
          </div>
        </div>
      )}

      {shareStep === 'done' && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-0 md:items-center md:px-6"
          role="dialog"
          aria-modal="true"
          aria-label="상가 공유 완료"
        >
          <div className="w-full max-w-[420px] rounded-t-2xl bg-white px-6 py-6 shadow-[0_18px_60px_rgba(25,31,40,0.18)] md:rounded-lg">
            <p className="text-base font-bold leading-relaxed text-[#191f28]">
              내 상가 만들기에 {displayName}님의 상가가 성공적으로
              공유되었습니다!
            </p>
            <button
              type="button"
              onClick={closeAfterSave}
              className="mt-6 h-11 w-full rounded-md bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueEstimateModal;
