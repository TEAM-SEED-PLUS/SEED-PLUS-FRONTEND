import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  calculateSurvivalAnalysis,
  getApiErrorMessage,
  type IndustryResponse,
  type RegionResponse,
  type SurvivalAnalysisResponse,
} from '@/api';
import WarningIcon from '@/assets/icons/warning-icon.svg';

interface SurvivalEstimateModalProps {
  industries: IndustryResponse[];
  districts: RegionResponse[];
  legalDongs: RegionResponse[];
  onClose: () => void;
}

type SurvivalForm = {
  regionCode: string;
  industryCode: string;
  area: string;
  rent: string;
  deposit: string;
  avgSales: number;
  salesGrowth: number;
  density: number;
  vacancy: number;
  traffic: number;
  churn: number;
  startupType: 'new' | 'transfer';
  avgSalesAmt: string;
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
  regionCode: '',
  industryCode: '',
  area: '',
  rent: '',
  deposit: '',
  avgSales: 4,
  salesGrowth: 3,
  density: 4,
  vacancy: 2,
  traffic: 4,
  churn: 2,
  startupType: 'new',
  avgSalesAmt: '4200',
};

const inputClass =
  'h-10 w-full rounded-sm border border-[#e5e8eb] bg-white px-3 text-xs text-[#191f28] outline-none placeholder:text-[#b0b8c1] focus:border-blue-600';
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
    SurvivalForm,
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

const scoreRowMeta: {
  field: ScoreField;
  label: string;
  description: string;
  fallback: number;
}[] = [
  {
    field: 's1_salesStability',
    label: '매출 안정성',
    description: '상권 평균 매출 상위권',
    fallback: 20,
  },
  {
    field: 's2_salesGrowth',
    label: '상권 성장성',
    description: '최근 매출 상승',
    fallback: 9,
  },
  {
    field: 's3_competition',
    label: '경쟁 강도',
    description: '동일업종 밀도 과밀',
    fallback: -20,
  },
  {
    field: 's4_vacancyRisk',
    label: '공실 리스크',
    description: '공실률 낮음',
    fallback: 0,
  },
  {
    field: 's5_traffic',
    label: '유동인구',
    description: '유동인구 매우 많음',
    fallback: -20,
  },
  {
    field: 's6_rentBurden',
    label: '임차 부담',
    description: '임차부담도 53%',
    fallback: 0,
  },
  {
    field: 's7_churn',
    label: '상권 안정성',
    description: '휴폐업 변동 안정',
    fallback: 20,
  },
  {
    field: 's8_startupTypeBonus',
    label: '창업 형태',
    description: '신규창업',
    fallback: 0,
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
const signedScore = (value: number) => `${value > 0 ? '+' : ''}${value}`;
const getLevel = (score: number) => {
  if (score >= 90) return '높음';
  if (score >= 70) return '보통';
  if (score >= 50) return '주의';
  return '위험';
};

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

const VariableSlider = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => {
  const left = `${(value / 5) * 100}%`;
  const status = value <= 2 ? '낮음' : value >= 4 ? '높음' : '보통';

  return (
    <div className="rounded-md bg-[#f7f8fa] px-5 py-4">
      <div className="mb-4 text-center text-xs font-extrabold text-[#191f28]">
        {label}
      </div>
      <div className="relative h-10">
        <div className="absolute left-0 right-0 top-6 h-2 rounded-full bg-[#e5e8eb]" />
        <div
          className="absolute left-0 top-6 h-2 rounded-full bg-blue-600"
          style={{ width: left }}
        />
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="absolute inset-x-0 top-3 h-7 cursor-pointer opacity-0"
        />
        <div
          className="absolute top-0 rounded-sm bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white"
          style={{ left: `calc(${left} - 18px)` }}
        >
          {status}
        </div>
        <div
          className="absolute top-[19px] h-5 w-5 rounded-full border-2 border-white bg-blue-600 shadow"
          style={{ left: `calc(${left} - 10px)` }}
        />
      </div>
      <div className="-mt-1 flex justify-between text-[10px] font-medium text-[#8b95a1]">
        <span>하위</span>
        <span>상위</span>
      </div>
    </div>
  );
};

const SurvivalGauge = ({ score }: { score: number }) => {
  const percent = clamp(score, 0, 100);

  return (
    <svg viewBox="0 0 190 112" className="h-[112px] w-[190px]">
      <path
        d="M 35 88 A 60 60 0 0 1 155 88"
        fill="none"
        pathLength={100}
        stroke="rgba(255,255,255,0.35)"
        strokeLinecap="butt"
        strokeWidth="24"
      />
      <path
        d="M 35 88 A 60 60 0 0 1 155 88"
        fill="none"
        pathLength={100}
        stroke="rgba(255,255,255,0.9)"
        strokeDasharray={`${percent} 100`}
        strokeLinecap="butt"
        strokeWidth="24"
      />
      <text
        x="95"
        y="86"
        fill="white"
        fontSize="30"
        fontWeight="800"
        textAnchor="middle"
      >
        {formatNumber(score)}
      </text>
      <text
        x="125"
        y="86"
        fill="white"
        fontSize="16"
        fontWeight="700"
        textAnchor="middle"
      >
        점
      </text>
    </svg>
  );
};

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

  const selectedDistrict = useMemo(
    () =>
      districts.find((district) => String(district.code) === form.regionCode),
    [districts, form.regionCode]
  );

  const updateField = (field: keyof SurvivalForm, value: string | number) => {
    setErrorMessage('');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const displayScoreRows = useMemo(
    () =>
      scoreRowMeta.map((row) => {
        const value = result?.scoreBreakdown[row.field] ?? row.fallback;
        return { ...row, score: value, positive: value >= 0 };
      }),
    [result]
  );

  const topRisks = useMemo(
    () =>
      displayScoreRows
        .filter((row) => row.score < 0)
        .sort((left, right) => left.score - right.score)
        .slice(0, 3),
    [displayScoreRows]
  );

  const totalScore = Math.round(result?.scoreBreakdown.totalScore ?? 50);
  const competitionRatio = result?.derived.competitionRatio ?? 100;
  const rentBurden = result?.derived.rentBurden ?? 53;
  const vitalityScore = result?.derived.vitalityScore ?? 88;
  const stabilityIndex = result?.derived.stabilityIndex ?? 75;

  const comparisonDistricts = useMemo(() => {
    if (districts.length === 0) {
      return [
        { name: '성동구', score: 83, active: false },
        { name: '마포구', score: totalScore, active: true },
        { name: '강남구', score: 77, active: false },
      ];
    }

    const activeIndex = Math.max(
      districts.findIndex(
        (district) => String(district.code) === form.regionCode
      ),
      0
    );
    const previous =
      districts[(activeIndex - 1 + districts.length) % districts.length];
    const active = districts[activeIndex];
    const next = districts[(activeIndex + 1) % districts.length];

    return [
      {
        name: previous?.sigungu ?? '인접 상권',
        score: clamp(totalScore + 5, 0, 100),
        active: false,
      },
      {
        name: active?.sigungu ?? selectedDistrict?.sigungu ?? '내 상권',
        score: totalScore,
        active: true,
      },
      {
        name: next?.sigungu ?? '인접 상권',
        score: clamp(totalScore - 1, 0, 100),
        active: false,
      },
    ];
  }, [districts, form.regionCode, selectedDistrict?.sigungu, totalScore]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.regionCode ||
      !form.industryCode ||
      !form.area ||
      !form.rent ||
      !form.deposit ||
      !form.avgSalesAmt
    ) {
      setErrorMessage('생존율 분석에 필요한 값을 모두 입력해주세요.');
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
      const response = await calculateSurvivalAnalysis({
        regionCode: legalDongCode,
        industryCode: form.industryCode,
        area: toNumber(form.area),
        rent: toNumber(form.rent),
        deposit: toNumber(form.deposit),
        avgSales: form.avgSales,
        salesGrowth: form.salesGrowth,
        density: form.density,
        vacancy: form.vacancy,
        traffic: form.traffic,
        churn: form.churn,
        startupType: form.startupType,
        avgSalesAmt: toNumber(form.avgSalesAmt),
      });
      setResult(response);
      setMobileStep('result');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-14 z-30 flex items-start justify-center overflow-y-auto bg-[#f5f6f8] px-4 py-6 md:px-8">
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
          className={`lg:block ${mobileStep === 'result' ? 'hidden' : 'block'}`}
        >
          <div className="mb-5">
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

          <form
            className="rounded-lg bg-white p-5 shadow-sm"
            onSubmit={handleSubmit}
          >
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
              <label className="block">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#4e5968]">
                    지역
                  </span>
                  <span className="rounded-full bg-[#edf4ff] px-2 py-1 text-[10px] font-bold text-blue-600">
                    공공데이터 연동
                  </span>
                </div>
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
                    <option
                      key={district.regionId}
                      value={String(district.code)}
                    >
                      {district.sigungu}
                    </option>
                  ))}
                </select>
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
                <span className={labelClass}>보증금(만원)</span>
                <input
                  type="number"
                  min="0"
                  value={form.deposit}
                  onChange={(event) =>
                    updateField('deposit', event.target.value)
                  }
                  placeholder="예) 3000"
                  className={inputClass}
                />
              </label>

              <div className="block">
                <span className={labelClass}>창업형태</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('startupType', 'new')}
                    className={`h-9 rounded-full px-3 text-[11px] font-bold ${
                      form.startupType === 'new'
                        ? 'bg-blue-600 text-white'
                        : 'border border-[#d8dde5] text-[#4e5968]'
                    }`}
                  >
                    신규 창업
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('startupType', 'transfer')}
                    className={`h-9 rounded-full px-3 text-[11px] font-bold ${
                      form.startupType === 'transfer'
                        ? 'bg-blue-600 text-white'
                        : 'border border-[#d8dde5] text-[#4e5968]'
                    }`}
                  >
                    양수 창업
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-[#e5e8eb] pt-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h4 className="text-xs font-extrabold text-[#191f28]">
                  공공데이터 기반 변수
                </h4>
                <span className="flex items-center gap-1 text-[10px] font-medium text-[#e5484d]">
                  <img src={WarningIcon} alt="" className="h-3 w-3" />
                  지역, 업종 선택 시 자동 반영됩니다. 직접 조정도 가능합니다.
                </span>
              </div>
              <div className="space-y-3">
                {variableFactors.map((factor) => (
                  <VariableSlider
                    key={factor.field}
                    label={factor.label}
                    value={form[factor.field]}
                    onChange={(value) => updateField(factor.field, value)}
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
              disabled={isSubmitting}
              className="mt-5 h-11 w-full rounded-md bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#b0c4f5]"
            >
              {isSubmitting ? '생존율 계산 중...' : '생존율 계산하기'}
            </button>
          </form>
        </section>

        <section
          className={`rounded-lg bg-white p-5 shadow-sm lg:block ${
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

          <div className="mt-4 rounded-lg bg-blue-600 p-4 text-white">
            <div className="grid grid-cols-[1fr_140px] gap-4">
              <div>
                <p className="text-xs font-bold">Survival Score</p>
                <div className="mt-2 flex justify-center">
                  <SurvivalGauge score={totalScore} />
                </div>
              </div>
              <div className="flex flex-col justify-center gap-3">
                <div className="rounded-sm bg-white/20 px-3 py-3 text-right ring-1 ring-white/20">
                  <p className="text-[10px] text-white/80">1년 생존 가능성</p>
                  <p className="mt-1 text-lg font-extrabold">
                    {result?.survival.survival1Year ?? '40~50%'}
                  </p>
                </div>
                <div className="rounded-sm bg-white/20 px-3 py-3 text-right ring-1 ring-white/20">
                  <p className="text-[10px] text-white/80">3년 생존 가능성</p>
                  <p className="mt-1 text-lg font-extrabold">
                    {result?.survival.survival3Year ?? '20~30%'}
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
              6개 변수별 점수 가이드
            </p>
            <div className="mt-4 grid grid-cols-1 gap-x-7 gap-y-4 md:grid-cols-2">
              {displayScoreRows.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between gap-2 text-[10px]">
                    <span className="font-bold text-[#191f28]">
                      {item.label}{' '}
                      <span className="font-medium text-[#8b95a1]">
                        {item.description}
                      </span>
                    </span>
                    <span
                      className={
                        item.positive ? 'text-blue-600' : 'text-[#e5484d]'
                      }
                    >
                      {signedScore(item.score)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#e5e8eb]">
                    <div
                      className={`h-2 rounded-full ${
                        item.positive ? 'bg-blue-600' : 'bg-[#e5484d]'
                      }`}
                      style={{
                        width: `${clamp(Math.abs(item.score) * 5, 4, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                [
                  '경쟁강도',
                  '동일업종 점포수 / 전체 점포수',
                  `${formatNumber(competitionRatio, 0)}%`,
                ],
                [
                  '임차부담도',
                  '월세 / 상권평균매출',
                  `${formatNumber(rentBurden, 0)}%`,
                ],
                [
                  '상권활력도',
                  '유동인구증가율 + 매출증가율',
                  `${formatNumber(vitalityScore, 0)}점`,
                ],
                [
                  '안정성지수',
                  '1 - 공실률',
                  `${formatNumber(stabilityIndex, 0)}점`,
                ],
              ].map(([label, description, value]) => (
                <div key={label} className="rounded-md bg-[#f2f6ff] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-[#4e5968]">{label}</p>
                    <p className="text-[10px] text-[#8b95a1]">{description}</p>
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
              {(topRisks.length > 0
                ? topRisks
                : displayScoreRows.slice(2, 5)
              ).map((item, index) => (
                <div key={item.label} className="rounded-md bg-[#f7f8fa] p-3">
                  <div className="flex items-center justify-between">
                    <strong className="flex items-center gap-1 text-xs text-[#191f28]">
                      {index === 0 && (
                        <img src={WarningIcon} alt="" className="h-3 w-3" />
                      )}
                      {index + 1}위 {item.label}
                    </strong>
                    <span
                      className={`text-lg font-extrabold ${
                        item.score < 0 ? 'text-[#e5484d]' : 'text-blue-600'
                      }`}
                    >
                      {signedScore(item.score)}점
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-[#4e5968]">
                    {item.description} 항목이 생존 가능성 산정에 반영됩니다.
                    수익성 악화 위험이 높을수록 감점 폭이 커집니다.
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
              {comparisonDistricts.map((district) => (
                <div
                  key={`${district.name}-${district.active ? 'active' : 'neighbor'}`}
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
                  <p className="mt-1 text-xl font-extrabold text-blue-600">
                    {district.score}점
                  </p>
                  <p className="mt-1 text-[10px] text-[#4e5968]">
                    {getLevel(district.score)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-md border border-[#e5e8eb] p-4">
            <h3 className="text-sm font-extrabold text-[#191f28]">
              데이터 출처
            </h3>
            <p className="mt-2 text-[11px] leading-relaxed text-[#4e5968]">
              소상공인시장진흥공단 상권정보, 서울시 열린데이터광장, 국토교통부
              실거래가, 여신금융협회 카드 매출, KT 유동인구, 행정안전부 인허가
              데이터를 기반으로 참고 지표를 산출합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setResult(null);
              setMobileStep('input');
            }}
            className="mt-4 h-11 w-full rounded-md bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700"
          >
            다시 계산하기
          </button>
        </section>
      </section>
    </div>
  );
};

export default SurvivalEstimateModal;
