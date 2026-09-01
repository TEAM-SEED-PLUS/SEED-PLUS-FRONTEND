import { useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  calculateSurvivalAnalysis,
  getApiErrorMessage,
  type IndustryResponse,
  type RegionResponse,
  type SurvivalAnalysisResponse,
  type SurvivalDynamicMetrics,
} from '@/api';
import WarningIcon from '@/assets/icons/warning-icon.svg';
import Skeleton from '@/components/ui/Skeleton';
import { SpinnerIcon } from '@/components/ui/icons';
import SurvivalPdfReport, {
  type PdfComparisonDistrict,
  type PdfScoreRow,
} from './SurvivalPdfReport';

interface SurvivalEstimateModalProps {
  industries: IndustryResponse[];
  districts: RegionResponse[];
  legalDongs: RegionResponse[];
  onClose: () => void;
}

// 신계약(2026-09-01): 상권 변수·보증금·창업형태 입력이 제거되고
// 초기투자금·권리금·직원수·상가명이 필수 입력이 됐다.
type SurvivalForm = {
  storeName: string;
  regionCode: string;
  /** 법정동 코드 — 서버 regionCode로 그대로 전송된다 */
  dongCode: string;
  industryCode: string;
  area: string;
  rent: string;
  invest: string;
  premium: string;
  staff: string;
};

type ScoreField =
  | 's1_salesStability'
  | 's2_salesGrowth'
  | 's3_competition'
  | 's4_vacancyRisk'
  | 's5_traffic'
  | 's6_rentBurden'
  | 's7_churn'
  | 's8_startupTypeBonus';

const initialForm: SurvivalForm = {
  storeName: '',
  regionCode: '',
  dongCode: '',
  industryCode: '',
  area: '',
  rent: '',
  invest: '',
  premium: '',
  staff: '2',
};

const inputClass =
  'h-10 w-full rounded-sm border border-[#e5e8eb] bg-white px-3 text-xs text-[#191f28] outline-none placeholder:text-[#b0b8c1] focus:border-blue-600';
const selectClass = `${inputClass} app-select`;
const labelClass = 'mb-2 block text-[11px] font-bold text-[#4e5968]';

const dataBadges = [
  '소상공인시장진흥공단 상권정보',
  '서울시 열린데이터광장',
  '국토교통부 실거래가',
  '여신금융협회 카드 매출',
  'KT 유동인구 데이터',
  '행정안전부 인허가 데이터',
];

const variableFactors: {
  field: keyof Pick<
    SurvivalDynamicMetrics,
    'avgSales' | 'salesGrowth' | 'density' | 'vacancy' | 'traffic' | 'churn'
  >;
  label: string;
}[] = [
  { field: 'avgSales', label: '상권 평균 매출 수준' },
  { field: 'salesGrowth', label: '최근 매출 성장률' },
  { field: 'density', label: '동일업종 점포 밀도' },
  { field: 'vacancy', label: '상권 공실률' },
  { field: 'traffic', label: '유동인구 수준' },
  { field: 'churn', label: '휴·폐업 변동 빈도' },
];

// description은 '무엇을 보는 지표인지'만 설명한다.
// 계산 전부터 '상권 평균 매출 상위권'·'임차부담도 53%'처럼 결과를 단정하던 문구는 제거했다.
const scoreRowMeta: {
  field: ScoreField;
  label: string;
  description: string;
}[] = [
  {
    field: 's1_salesStability',
    label: '매출 안정성',
    description: '상권 평균 매출 수준',
  },
  {
    field: 's2_salesGrowth',
    label: '상권 성장성',
    description: '최근 매출 성장률',
  },
  {
    field: 's3_competition',
    label: '경쟁 강도',
    description: '동일업종 점포 밀도',
  },
  {
    field: 's4_vacancyRisk',
    label: '공실 리스크',
    description: '상권 공실률',
  },
  {
    field: 's5_traffic',
    label: '유동인구',
    description: '유동인구 수준',
  },
  {
    field: 's6_rentBurden',
    label: '임차 부담',
    description: '월세 대비 상권평균매출 비중',
  },
  {
    field: 's7_churn',
    label: '상권 안정성',
    description: '휴·폐업 변동 빈도',
  },
  {
    field: 's8_startupTypeBonus',
    label: '창업 형태',
    description: '신규·양수 구분',
  },
];

const toNumber = (value: string) => Number(value.trim());
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const formatNumber = (value?: number, digits = 0) =>
  value === undefined || Number.isNaN(value)
    ? '-'
    : value.toLocaleString('ko-KR', {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
      });
const signedScore = (value: number | null) =>
  value === null ? '?' : `${value >= 0 ? '+' : ''}${value}`;
const getLevel = (score: number) => {
  if (score >= 90) return '높음';
  if (score >= 70) return '보통';
  if (score >= 50) return '주의';
  return '위험';
};

const sliderStatusLabels = ['매우 낮음', '낮음', '보통', '높음', '매우 높음'];

/**
 * 상권 변수 게이지 (읽기 전용).
 * 과거에는 1~5 슬라이더 '입력'이었지만, 신계약(2026-09-01)부터 서버가
 * 실시간 수집 데이터로 산출해 응답(dynamicMetrics)으로 내려준다.
 * 계산 전(null)에는 잠금 상태로 표시한다.
 * 서버 산출 스케일은 1~5 가정이며, 벗어나는 값은 반올림·클램프해 표시한다.
 */
const VariableGauge = ({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) => {
  const scaled = value === null ? null : clamp(Math.round(value), 1, 5);
  const ratio = scaled === null ? 0 : (scaled - 1) / 4;
  const left = `${ratio * 100}%`;

  return (
    <div className="rounded-md bg-[#f7f8fa] px-5 py-4">
      <div className="mb-4 text-center text-xs font-extrabold text-[#191f28]">
        {label}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-[#4e5968]">하위</span>
        <div className="relative h-12 min-w-0 flex-1">
          <div className="absolute left-0 right-0 top-6 h-2 rounded-full bg-[#e5e8eb]" />
          {scaled === null ? (
            <div className="absolute inset-x-0 top-1 text-center text-[10px] font-bold text-[#8b95a1]">
              계산 시 자동 산출
            </div>
          ) : (
            <>
              <div
                className="absolute left-0 top-6 h-2 rounded-full bg-blue-600"
                style={{ width: left }}
              />
              <div
                className="absolute -top-1 whitespace-nowrap rounded-sm bg-blue-600 px-2 py-0.5 text-center text-[10px] font-bold text-white"
                style={{ left, transform: `translateX(-${ratio * 100}%)` }}
              >
                {sliderStatusLabels[scaled - 1]}
              </div>
              <div
                className="absolute top-[19px] h-5 w-5 rounded-full border-2 border-white bg-blue-600 shadow"
                style={{ left: `calc(${left} - ${ratio * 20}px)` }}
              />
            </>
          )}
        </div>
        <span className="text-[11px] text-[#4e5968]">상위</span>
      </div>
    </div>
  );
};

// 시안(Figma 404:609)의 게이지: 3분할 호 + 점수 구간 강조 + 점수를 가리키는 바늘
const gaugeSegments = [
  { path: 'M 35 88 A 60 60 0 0 1 62.8 37.3', from: 0, to: 34 },
  { path: 'M 66.1 35.4 A 60 60 0 0 1 123.9 35.4', from: 34, to: 68 },
  { path: 'M 127.2 37.3 A 60 60 0 0 1 155 88', from: 68, to: 101 },
];

export const SurvivalGauge = ({ score }: { score: number | null }) => {
  const percent = score === null ? null : clamp(score, 0, 100);
  const needleAngle = percent === null ? 0 : (percent / 100) * 180 - 90;

  return (
    <svg viewBox="0 0 190 122" className="h-auto w-full max-w-[190px] shrink">
      {gaugeSegments.map((segment) => (
        <path
          key={segment.path}
          d={segment.path}
          fill="none"
          stroke={
            percent !== null && percent >= segment.from && percent < segment.to
              ? 'rgba(255,255,255,0.95)'
              : 'rgba(255,255,255,0.45)'
          }
          strokeLinecap="butt"
          strokeWidth="24"
        />
      ))}
      {percent !== null && (
        <path
          d="M 95 50 L 91.5 82 A 3.5 3.5 0 1 0 98.5 82 Z"
          fill="white"
          transform={`rotate(${needleAngle} 95 88)`}
        />
      )}
      <text
        x="102"
        y="116"
        fill="white"
        fontSize="34"
        fontWeight="800"
        textAnchor="end"
      >
        {percent === null ? '?' : formatNumber(percent)}
      </text>
      <text x="110" y="116" fill="white" fontSize="16" fontWeight="700">
        점
      </text>
    </svg>
  );
};

/**
 * 계산이 도는 동안 결과 영역을 덮는 스켈레톤.
 * 실제 결과(게이지 / 분해지표 / 지표카드 / 위험요인 / 유사상권)와 같은 골격을 써서
 * 계산이 끝났을 때 레이아웃이 튀지 않게 한다.
 */
const SurvivalResultSkeleton = () => (
  <div className="mt-4 space-y-4">
    <div className="rounded-lg bg-blue-600 p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(96px,120px)] gap-3 sm:grid-cols-[1fr_140px] sm:gap-4">
        <div className="min-w-0">
          <Skeleton tone="onDark" className="h-4 w-24" />
          <div className="mt-4 flex justify-center">
            <Skeleton tone="onDark" className="h-20 w-40 rounded-t-full" />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <Skeleton tone="onDark" className="h-14 rounded-sm" />
          <Skeleton tone="onDark" className="h-14 rounded-sm" />
        </div>
      </div>
    </div>

    <div>
      <Skeleton className="h-4 w-32" />
      <div className="mt-4 grid grid-cols-1 gap-x-7 gap-y-4 md:grid-cols-2">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index}>
            <Skeleton className="mb-2 h-3 w-40" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-20 rounded-md" />
        ))}
      </div>
    </div>

    <div className="rounded-md border border-[#e5e8eb] p-4">
      <Skeleton className="h-4 w-28" />
      <div className="mt-3 space-y-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-16 rounded-md" />
        ))}
      </div>
    </div>

    <div className="rounded-md border border-[#e5e8eb] p-4">
      <Skeleton className="h-4 w-32" />
      <div className="mt-3 grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-20 rounded-md" />
        ))}
      </div>
    </div>
  </div>
);

const SurvivalEstimateModal = ({
  industries,
  districts,
  legalDongs,
  onClose,
}: SurvivalEstimateModalProps) => {
  const [form, setForm] = useState<SurvivalForm>(initialForm);
  const [result, setResult] = useState<SurvivalAnalysisResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mobileStep, setMobileStep] = useState<'input' | 'result'>('input');
  const [isStale, setIsStale] = useState(false);
  const [pdfNotice, setPdfNotice] = useState('');

  const hasResult = result !== null;

  const selectedDistrict = useMemo(
    () =>
      districts.find((district) => String(district.code) === form.regionCode),
    [districts, form.regionCode]
  );

  const updateField = (field: keyof SurvivalForm, value: string) => {
    setErrorMessage('');
    setPdfNotice('');
    if (result) {
      setIsStale(true);
    }
    setForm((current) => ({ ...current, [field]: value }));
  };

  /** 구가 바뀌면 동 선택을 초기화한다 */
  const handleDistrictChange = (value: string) => {
    setErrorMessage('');
    setPdfNotice('');
    if (result) {
      setIsStale(true);
    }
    setForm((current) => ({ ...current, regionCode: value, dongCode: '' }));
  };

  const dongOptions = useMemo(
    () =>
      legalDongs
        .filter((dong) => dong.sigungu === selectedDistrict?.sigungu)
        .sort((left, right) =>
          (left.dong ?? '').localeCompare(right.dong ?? '', 'ko-KR')
        ),
    [legalDongs, selectedDistrict?.sigungu]
  );

  const isFormComplete = Boolean(
    form.storeName.trim() &&
    form.regionCode &&
    form.dongCode &&
    form.industryCode &&
    form.area &&
    form.rent &&
    form.invest &&
    form.premium &&
    form.staff
  );

  // 계산 전에는 폴백 수치를 채우지 않고 null로 둔다(SVC-02: 미산출은 '?').
  const displayScoreRows: PdfScoreRow[] = useMemo(
    () =>
      scoreRowMeta.map((row) => {
        const value = result?.scoreBreakdown[row.field] ?? null;
        return { ...row, score: value, positive: value !== null && value >= 0 };
      }),
    [result]
  );

  const topRisks = useMemo(
    () =>
      displayScoreRows
        .filter((row) => row.score !== null && row.score < 0)
        .sort((left, right) => (left.score ?? 0) - (right.score ?? 0))
        .slice(0, 3),
    [displayScoreRows]
  );

  const totalScore = result
    ? Math.round(result.scoreBreakdown.totalScore)
    : null;

  const resolvedTopRisks =
    topRisks.length > 0 ? topRisks : displayScoreRows.slice(0, 3);

  const metricCards: [string, string, string][] = [
    [
      '경쟁강도',
      '동일업종 점포수 / 전체 점포수',
      result ? `${formatNumber(result.derived.competitionRatio, 0)}%` : '?',
    ],
    [
      '임차부담도',
      '월세 / 상권평균매출',
      result ? `${formatNumber(result.derived.rentBurden, 0)}%` : '?',
    ],
    [
      '상권활력도',
      '유동인구증가율 + 매출증가율',
      result ? `${formatNumber(result.derived.vitalityScore, 0)}점` : '?',
    ],
    [
      '안정성지수',
      '1 - 공실률',
      result ? `${formatNumber(result.derived.stabilityIndex, 0)}점` : '?',
    ],
  ];

  const selectedIndustryName = industries.find(
    (industry) => String(industry.industryCode) === form.industryCode
  )?.name;

  const inputSummary: [string, string][] = [
    ['상가명', form.storeName.trim() || '-'],
    [
      '지역',
      selectedDistrict
        ? `${selectedDistrict.sigungu} ${
            dongOptions.find((dong) => String(dong.code) === form.dongCode)
              ?.dong ?? ''
          }`.trim()
        : '-',
    ],
    ['업종', selectedIndustryName ?? '-'],
    ['면적', form.area ? `${form.area}m²` : '-'],
    ['월 임대료', form.rent ? `${form.rent}만원` : '-'],
    ['초기투자금', form.invest ? `${form.invest}만원` : '-'],
    ['권리금', form.premium ? `${form.premium}만원` : '-'],
    ['직원 수', form.staff ? `${form.staff}명` : '-'],
  ];

  const pdfReportRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const reportDateStamp = `${today.getFullYear()}${String(
    today.getMonth() + 1
  ).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  const printPdfReport = useReactToPrint({
    contentRef: pdfReportRef,
    documentTitle: `SEEDplus_생존율리포트_${form.storeName.trim() || '미지정'}_${reportDateStamp}`,
    pageStyle:
      '@page { size: A4; margin: 0; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }',
  });

  const handlePdfClick = () => {
    if (!hasResult) {
      setPdfNotice('계산을 먼저 완료해주세요.');
      return;
    }
    setPdfNotice('');
    printPdfReport();
  };

  // 유사 상권 비교값은 아직 API(SVC-04 peers[])가 제공하지 않는다.
  // 임의로 가감한 숫자를 실제 비교치처럼 노출하지 않도록, 내 상권만 산출값을 쓰고
  // 나머지 두 칸은 계산 전과 동일하게 '?'로 둔다.
  const comparisonDistricts: PdfComparisonDistrict[] = useMemo(
    () => [
      { name: '유사 상권', score: null, active: false },
      {
        name: selectedDistrict?.sigungu ?? '내 상권',
        score: totalScore,
        active: true,
      },
      { name: '유사 상권', score: null, active: false },
    ],
    [selectedDistrict?.sigungu, totalScore]
  );

  const submitSurvival = async () => {
    if (
      !form.storeName.trim() ||
      !form.regionCode ||
      !form.dongCode ||
      !form.industryCode ||
      !form.area ||
      !form.rent ||
      !form.invest ||
      !form.premium ||
      !form.staff
    ) {
      setErrorMessage('생존율 분석에 필요한 값을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await calculateSurvivalAnalysis({
        storeName: form.storeName.trim(),
        regionCode: form.dongCode,
        industryCode: form.industryCode,
        area: toNumber(form.area),
        rent: toNumber(form.rent),
        invest: toNumber(form.invest),
        premium: toNumber(form.premium),
        staff: Math.round(toNumber(form.staff)),
      });
      setResult(response);
      setIsStale(false);
      setMobileStep('result');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitSurvival();
  };

  return (
    <div className="scrollbar-hide fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-white/75 px-8 py-6 pt-[calc(var(--header-height)+24px)] backdrop-blur-[1px]">
      <section className="relative grid w-full max-w-[1120px] grid-cols-1 gap-8 lg:grid-cols-[500px_1fr]">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl font-light text-[#6b7684] shadow-sm transition hover:bg-[#f2f4f6] hover:text-[#191f28]"
        >
          ×
        </button>

        <section
          className={`rounded-lg border border-[#d8dde5] bg-white p-6 lg:block ${mobileStep === 'result' ? 'hidden' : 'block'}`}
        >
          <div className="border-b border-[#e5e8eb] pb-4">
            <h2 className="text-base font-extrabold text-[#191f28]">
              생존율 계산기
            </h2>
            <p className="mt-2 text-[11px] leading-relaxed text-[#4e5968]">
              소상공인시장진흥공단 상권정보와 공공데이터 기반으로 창업 전 생존
              가능성을 점수화합니다.
              <br />
              6개 핵심 변수와 Survival Score로 현실적인 1년·3년 생존 확률 구간을
              제시합니다.
            </p>
          </div>

          <form className="mt-5" onSubmit={handleSubmit}>
            <h3 className="text-sm font-extrabold text-[#191f28]">
              창업 정보 입력
            </h3>
            <p className="mt-1 text-[11px] text-[#4e5968]">
              사용자 입력 + 공공데이터 자동 반영
            </p>

            <div className="mt-4 rounded-md bg-[#e8f1ff] px-4 py-3 text-[11px] leading-relaxed text-blue-600">
              <strong>공공데이터 자동 연동</strong>
              <p className="mt-1">
                지역·업종 선택 시 소상공인시장진흥공단 상권정보, 서울시
                열린데이터광장, 국토교통부 실거래가 데이터가 자동 반영됩니다.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <label className="col-span-2 block">
                <span className={labelClass}>상가명</span>
                <input
                  type="text"
                  value={form.storeName}
                  onChange={(event) =>
                    updateField('storeName', event.target.value)
                  }
                  placeholder="예) 세드분식 강남점"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#4e5968]">
                    지역
                  </span>
                  <span className="rounded-full bg-[#edf4ff] px-2 py-1 text-[10px] font-bold text-blue-600">
                    공공데이터 연동
                  </span>
                </div>
                <div className="flex gap-2">
                  <select
                    value={form.regionCode}
                    onChange={(event) =>
                      handleDistrictChange(event.target.value)
                    }
                    aria-label="자치구 선택"
                    className={selectClass}
                  >
                    <option value="" disabled>
                      구 선택
                    </option>
                    {districts.map((district) => (
                      <option
                        key={district.regionId}
                        value={String(district.code)}
                      >
                        {district.sigungu}
                      </option>
                    ))}
                  </select>
                  <select
                    value={form.dongCode}
                    onChange={(event) =>
                      updateField('dongCode', event.target.value)
                    }
                    disabled={!form.regionCode}
                    aria-label="법정동 선택"
                    className={`${selectClass} disabled:bg-[#f2f4f6] disabled:text-[#b0b8c1]`}
                  >
                    <option value="" disabled>
                      동 선택
                    </option>
                    {dongOptions.map((dong) => (
                      <option key={dong.code} value={String(dong.code)}>
                        {dong.dong}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="block">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#4e5968]">
                    업종 선택
                  </span>
                  <span className="rounded-full bg-[#edf4ff] px-2 py-1 text-[10px] font-bold text-blue-600">
                    공공데이터 연동
                  </span>
                </div>
                <select
                  value={form.industryCode}
                  onChange={(event) =>
                    updateField('industryCode', event.target.value)
                  }
                  className={selectClass}
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
                <span className={labelClass}>면적(m²)</span>
                <input
                  type="number"
                  min="0"
                  value={form.area}
                  onChange={(event) => updateField('area', event.target.value)}
                  placeholder="전용면적 기준"
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
                  placeholder="예) 250"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className={labelClass}>초기 투자금(만원)</span>
                <input
                  type="number"
                  min="0"
                  value={form.invest}
                  onChange={(event) =>
                    updateField('invest', event.target.value)
                  }
                  placeholder="예) 5000"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className={labelClass}>권리금(만원)</span>
                <input
                  type="number"
                  min="0"
                  value={form.premium}
                  onChange={(event) =>
                    updateField('premium', event.target.value)
                  }
                  placeholder="예) 3000"
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
            </div>

            <div className="mt-5 border-t border-[#e5e8eb] pt-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h4 className="text-xs font-extrabold text-[#191f28]">
                  공공데이터 기반 변수
                </h4>
                <span className="flex items-center gap-1 text-[10px] font-medium text-[#e5484d]">
                  <img src={WarningIcon} alt="" className="h-3 w-3" />
                  계산 시 실시간 상권 데이터로 자동 산출됩니다.
                </span>
              </div>
              <div className="space-y-3">
                {variableFactors.map((factor) => (
                  <VariableGauge
                    key={factor.field}
                    label={factor.label}
                    value={result?.dynamicMetrics?.[factor.field] ?? null}
                  />
                ))}
              </div>
            </div>

            {errorMessage && (
              <p className="mt-4 text-xs font-bold text-[#e5484d]">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !isFormComplete}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#b0c4f5]"
            >
              {isSubmitting && <SpinnerIcon className="h-4 w-4" />}
              {isSubmitting ? '생존율 계산 중...' : '생존율 계산하기'}
            </button>
          </form>
        </section>

        <section
          aria-busy={isSubmitting}
          className={`rounded-lg border border-[#d8dde5] bg-white p-5 lg:block ${
            mobileStep === 'input' ? 'hidden' : 'block'
          }`}
        >
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <h2 className="text-lg font-extrabold text-[#191f28]">
              생존율 계산 결과
            </h2>
            <button
              type="button"
              onClick={() => setMobileStep('input')}
              className="rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white"
            >
              입력으로 돌아가기
            </button>
          </div>

          <h3 className="text-sm font-extrabold text-[#191f28]">
            데이터 출처 및 API 연동 현황
          </h3>
          <p className="mt-1 text-[11px] text-[#4e5968]">
            본 계산기에 반영된 공공데이터
          </p>

          <div className="mt-4 border-t border-[#e5e8eb] pt-4">
            <div className="flex flex-wrap gap-2">
              {dataBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-[#e8f1ff] px-2.5 py-1 text-[10px] font-bold text-blue-600"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2 rounded-md border border-[#e5484d] bg-[#fffafa] px-3 py-3 text-[11px] leading-relaxed text-[#e5484d]">
            <img src={WarningIcon} alt="" className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              본 생존율은 공공데이터 기반 점수 모델로 산출된 참고용
              추정치입니다. 실제 생존율은 운영 역량, 마케팅, 경기 변동 등 다양한
              요인에 따라 달라질 수 있습니다.
            </p>
          </div>

          {hasResult && isStale && (
            <div className="mt-4 rounded-md border border-[#f5c518] bg-[#fff8e1] px-3 py-2 text-[11px] font-bold text-[#8a6d00]">
              재계산 필요 — 입력값이 변경되었습니다. [생존율 계산하기]를 다시
              눌러주세요.
            </div>
          )}

          {hasResult && (result.warnings?.length ?? 0) > 0 && (
            <ul className="mt-4 space-y-1 rounded-md bg-[#f7f8fa] px-3 py-2 text-[11px] font-medium text-[#4e5968]">
              {result.warnings?.map((warning) => (
                <li key={warning}>· {warning}</li>
              ))}
            </ul>
          )}

          {isSubmitting ? (
            <SurvivalResultSkeleton />
          ) : (
            <>
              <div className="mt-4 rounded-lg bg-blue-600 p-4 text-white">
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(96px,120px)] gap-3 sm:grid-cols-[1fr_140px] sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold">Survival Score</p>
                    <div className="mt-2 flex justify-center overflow-hidden px-1">
                      <SurvivalGauge score={totalScore} />
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-col justify-center gap-3">
                    <div className="rounded-sm bg-white/20 px-2 py-3 text-right ring-1 ring-white/20 sm:px-3">
                      <p className="text-[10px] text-white/80">
                        1년 생존 가능성
                      </p>
                      <p className="mt-1 whitespace-nowrap text-base font-extrabold sm:text-lg">
                        {result?.survival.survival1Year ?? '?'}
                      </p>
                    </div>
                    <div className="rounded-sm bg-white/20 px-2 py-3 text-right ring-1 ring-white/20 sm:px-3">
                      <p className="text-[10px] text-white/80">
                        3년 생존 가능성
                      </p>
                      <p className="mt-1 whitespace-nowrap text-base font-extrabold sm:text-lg">
                        {result?.survival.survival3Year ?? '?'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-sm font-extrabold text-[#191f28]">
                  Survival Score 분해
                </h3>
                <p className="mt-1 text-[11px] text-[#4e5968]">
                  6개 변수별 점수 기여도
                </p>
                <div className="mt-4 grid grid-cols-1 gap-x-7 gap-y-4 md:grid-cols-2">
                  {displayScoreRows.map((item) => (
                    <div key={item.label}>
                      <p className="mb-1 text-[10px] font-bold text-[#191f28]">
                        {item.label}{' '}
                        <span className="font-medium text-[#8b95a1]">
                          {item.description}
                        </span>
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="h-2 min-w-0 flex-1 rounded-full bg-[#e5e8eb]">
                          {item.score !== null && (
                            <div
                              className={`h-2 rounded-full ${
                                item.positive ? 'bg-blue-600' : 'bg-[#e5484d]'
                              }`}
                              style={{
                                width: `${clamp(Math.abs(item.score) * 5, 4, 100)}%`,
                              }}
                            />
                          )}
                        </div>
                        <span
                          className={`text-[10px] ${
                            item.score === null
                              ? 'text-[#8b95a1]'
                              : item.positive
                                ? 'text-blue-600'
                                : 'text-[#e5484d]'
                          }`}
                        >
                          {signedScore(item.score)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {metricCards.map(([label, description, value]) => (
                    <div key={label} className="rounded-md bg-[#f2f6ff] p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-[#4e5968]">
                          {label}
                        </p>
                        <p className="text-[10px] text-[#8b95a1]">
                          {description}
                        </p>
                      </div>
                      <p className="mt-1 text-right text-xl font-extrabold text-blue-600">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-md border border-[#e5e8eb] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-extrabold text-[#191f28]">
                    위험 요인 TOP 3
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] text-[#e5484d]">
                    <img src={WarningIcon} alt="" className="h-3 w-3" />
                    생존율에 가장 큰 영향을 미치는 요인
                  </span>
                </div>
                <div className="space-y-3">
                  {resolvedTopRisks.map((item, index) => (
                    <div
                      key={item.label}
                      className="rounded-md bg-[#f7f8fa] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="flex items-center gap-1 text-xs text-[#191f28]">
                          {item.score !== null && index === 0 && (
                            <img src={WarningIcon} alt="" className="h-3 w-3" />
                          )}
                          {index + 1}위 {item.score === null ? '?' : item.label}
                        </strong>
                        <span
                          className={`text-lg font-extrabold ${
                            item.score === null
                              ? 'text-[#8b95a1]'
                              : item.score < 0
                                ? 'text-[#e5484d]'
                                : 'text-blue-600'
                          }`}
                        >
                          {signedScore(item.score)}점
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] leading-relaxed text-[#4e5968]">
                        {item.score === null
                          ? '생존율 계산 후 위험 요인이 표시됩니다.'
                          : `${item.description} 항목이 생존 가능성 산정에 반영됩니다. 수익성 악화 위험이 높을수록 감점 폭이 커집니다.`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-md border border-[#e5e8eb] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-extrabold text-[#191f28]">
                    유사 상권 대비 위치
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] text-[#e5484d]">
                    <img src={WarningIcon} alt="" className="h-3 w-3" />
                    동일 업종 기준 상권별 생존율 비교
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {comparisonDistricts.map((district, index) => (
                    <div
                      key={`comparison-${index}`}
                      className={`rounded-md border p-3 text-center ${
                        district.active
                          ? 'border-blue-600 bg-[#eef4ff]'
                          : 'border-transparent bg-[#f2f6ff]'
                      }`}
                    >
                      {district.active && (
                        <div className="mx-auto mb-1 w-fit rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-bold text-white">
                          내 상권
                        </div>
                      )}
                      <p className="text-[11px] font-bold text-[#4e5968]">
                        {district.name}
                      </p>
                      <p
                        className={`mt-1 text-xl font-extrabold ${
                          district.score === null
                            ? 'text-[#8b95a1]'
                            : 'text-blue-600'
                        }`}
                      >
                        {district.score === null
                          ? '?점'
                          : `${district.score}점`}
                      </p>
                      <p className="mt-1 text-[10px] text-[#4e5968]">
                        {district.score === null
                          ? '?'
                          : getLevel(district.score)}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-[#8b95a1]">
                  유사 상권 비교 데이터는 준비 중입니다. 연동 완료 후 실제
                  상권명과 점수가 표시됩니다.
                </p>
              </div>
            </>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                // 현재 입력값 그대로 즉시 재계산한다. 계산 중에는 결과 영역이
                // 스켈레톤으로 덮이고, 완료되면 새 결과로 교체된다.
                setPdfNotice('');
                void submitSurvival();
              }}
              className="h-11 rounded-md border border-blue-600 bg-white text-sm font-extrabold text-blue-600 transition hover:bg-[#e8f1ff] disabled:cursor-not-allowed disabled:opacity-50"
            >
              다시 계산하기
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handlePdfClick}
              className={`h-11 rounded-md text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                hasResult ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#b0c4f5]'
              }`}
            >
              PDF로 출력하기
            </button>
          </div>
          {pdfNotice && (
            <p className="mt-2 text-right text-xs font-bold text-[#e5484d]">
              {pdfNotice}
            </p>
          )}
        </section>
      </section>

      <div aria-hidden className="fixed top-0 -left-[9999px]">
        <SurvivalPdfReport
          ref={pdfReportRef}
          dataBadges={dataBadges}
          inputSummary={inputSummary}
          totalScore={totalScore}
          survival1Year={result?.survival.survival1Year ?? '?'}
          survival3Year={result?.survival.survival3Year ?? '?'}
          scoreRows={displayScoreRows}
          topRisks={resolvedTopRisks}
          comparisonDistricts={comparisonDistricts}
          metricCards={metricCards}
        />
      </div>
    </div>
  );
};

export default SurvivalEstimateModal;
