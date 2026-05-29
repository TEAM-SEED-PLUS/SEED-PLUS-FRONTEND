import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  calculateSurvivalAnalysis,
  getApiErrorMessage,
  type IndustryResponse,
  type RegionResponse,
  type SurvivalAnalysisResponse,
} from '@/api';

interface SurvivalEstimateModalProps {
  industries: IndustryResponse[];
  districts: RegionResponse[];
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

const initialForm: SurvivalForm = {
  regionCode: '',
  industryCode: '',
  area: '',
  rent: '',
  deposit: '3000',
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

const scoreRowMeta = [
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
  { field: 's5_traffic', label: '유동인구', description: '유동인구 수준' },
  {
    field: 's6_rentBurden',
    label: '임차 부담',
    description: '월 임대료 부담',
  },
  {
    field: 's7_churn',
    label: '상권 안정성',
    description: '휴·폐업 변동 빈도',
  },
  {
    field: 's8_startupTypeBonus',
    label: '창업 형태',
    description: '신규/양수 창업',
  },
] as const;

const districtScores = [
  { district: '성동구', score: '83점', level: '높음' },
  { district: '마포구', score: '78점', level: '높음', active: true },
  { district: '강남구', score: '77점', level: '보통' },
];

const toNumber = (value: string) => Number(value.trim());
const formatNumber = (value?: number, digits = 0) =>
  value === undefined || Number.isNaN(value)
    ? '-'
    : value.toLocaleString('ko-KR', {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
      });
const signedScore = (value: number) => `${value > 0 ? '+' : ''}${value}`;

const VariableSlider = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => (
  <div className="rounded-md bg-[#f7f8fa] px-5 py-4">
    <div className="mb-4 text-center text-xs font-extrabold text-[#191f28]">
      {label}
    </div>
    <div className="relative h-7">
      <div className="absolute left-0 right-0 top-3 h-2 rounded-full bg-[#e5e8eb]" />
      <div
        className="absolute left-0 top-3 h-2 rounded-full bg-blue-600"
        style={{ width: `${(value / 5) * 100}%` }}
      />
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="absolute inset-x-0 top-0 h-7 cursor-pointer opacity-0"
      />
      <div
        className="absolute top-0 rounded-sm bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white"
        style={{ left: `calc(${(value / 5) * 100}% - 18px)` }}
      >
        {value <= 2 ? '낮음' : value >= 4 ? '높음' : '보통'}
      </div>
      <div
        className="absolute top-[7px] h-5 w-5 rounded-full border-2 border-white bg-blue-600 shadow"
        style={{ left: `calc(${(value / 5) * 100}% - 10px)` }}
      />
    </div>
    <div className="mt-1 flex justify-between text-[10px] font-medium text-[#8b95a1]">
      <span>하위</span>
      <span>상위</span>
    </div>
  </div>
);

const SurvivalEstimateModal = ({
  industries,
  districts,
  onClose,
}: SurvivalEstimateModalProps) => {
  const [form, setForm] = useState<SurvivalForm>(initialForm);
  const [result, setResult] = useState<SurvivalAnalysisResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setForm((current) => ({
      ...current,
      industryCode: current.industryCode || industries[0]?.industryCode || '',
      regionCode: current.regionCode || districts[0]?.code || '',
    }));
  }, [districts, industries]);

  const updateField = (field: keyof SurvivalForm, value: string | number) => {
    setErrorMessage('');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const displayScoreRows = useMemo(
    () =>
      scoreRowMeta.map((row) => {
        const value = result?.scoreBreakdown[row.field] ?? 0;
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

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await calculateSurvivalAnalysis({
        regionCode: form.regionCode,
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
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-14 z-30 flex items-start justify-center overflow-y-auto bg-[#f5f6f8] px-8 py-6">
      <section className="relative grid w-full max-w-[940px] grid-cols-1 gap-8 lg:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl font-light text-[#6b7684] shadow-sm transition hover:bg-[#f2f4f6] hover:text-[#191f28]"
        >
          ×
        </button>

        <section>
          <div className="mb-5">
            <h2 className="text-base font-extrabold text-[#191f28]">
              생존율 계산기
            </h2>
            <p className="mt-2 text-[11px] leading-relaxed text-[#4e5968]">
              입력한 창업 조건과 공공데이터 변수를 Survival Score로 환산해
              1년/3년 생존 가능성을 계산합니다.
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
              사용자 입력 + 공공데이터 변수 반영
            </p>

            <div className="mt-4 rounded-md bg-blue-300 px-4 py-3 text-[11px] leading-relaxed text-blue-600">
              <strong>공공데이터 변수 연동</strong>
              <p className="mt-1">
                지역/업종 코드와 핵심 변수 값을 생존율 분석 API에 전달합니다.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <label className="block">
                <span className={labelClass}>지역</span>
                <select
                  value={form.regionCode}
                  onChange={(event) =>
                    updateField('regionCode', event.target.value)
                  }
                  className={inputClass}
                >
                  {districts.map((district) => (
                    <option key={district.regionId} value={district.code}>
                      {district.sigungu}
                    </option>
                  ))}
                </select>
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
                  {industries.map((industry) => (
                    <option
                      key={industry.industryId}
                      value={industry.industryCode}
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
                  placeholder="예) 40"
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

              <label className="block">
                <span className={labelClass}>상권 평균 매출액(만원)</span>
                <input
                  type="number"
                  min="0"
                  value={form.avgSalesAmt}
                  onChange={(event) =>
                    updateField('avgSalesAmt', event.target.value)
                  }
                  placeholder="예) 4200"
                  className={inputClass}
                />
              </label>

              <div className="col-span-2">
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
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-[#191f28]">
                  공공데이터 기반 변수
                </h4>
                <span className="text-[10px] font-medium text-[#e5484d]">
                  1~5 단계 값으로 API에 반영됩니다.
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

        <section className="rounded-lg bg-white p-5 shadow-sm">
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
                  className="rounded-full bg-blue-300 px-2.5 py-1 text-[10px] font-bold text-blue-600"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-md border border-[#e5484d] bg-[#fffafa] px-3 py-3 text-[11px] leading-relaxed text-[#e5484d]">
            본 생존율은 공공데이터 기반 점수 모델로 산출된 참고용 추정치입니다.
            실제 생존율은 운영 역량, 마케팅, 경기 변동 등에 따라 달라질 수
            있습니다.
          </div>

          <div className="mt-4 rounded-lg bg-blue-600 p-4 text-white">
            <div className="grid grid-cols-[1fr_130px] gap-4">
              <div>
                <p className="text-xs font-bold">Survival Score</p>
                <div className="mt-4 flex h-24 items-end justify-center">
                  <div className="relative h-20 w-36 overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 h-16 rounded-t-full border-[20px] border-b-0 border-white/35" />
                    <div className="absolute inset-x-0 bottom-0 h-16 w-[72%] rounded-tl-full border-[20px] border-b-0 border-r-0 border-white" />
                    <div className="absolute inset-x-0 bottom-1 text-center">
                      <strong className="text-2xl font-extrabold">
                        {formatNumber(result?.scoreBreakdown.totalScore)}
                      </strong>
                      <span className="ml-1 text-xs font-bold">점</span>
                    </div>
                  </div>
                </div>
                <p className="mt-1 text-center text-xs font-bold text-white/80">
                  {result?.survival.grade ?? '분석 전'}
                </p>
              </div>
              <div className="space-y-3">
                <div className="rounded-sm bg-white/20 px-3 py-2 text-right">
                  <p className="text-[10px] text-white/80">1년 생존 가능성</p>
                  <p className="mt-1 text-base font-extrabold">
                    {result?.survival.survival1Year ?? '-'}
                  </p>
                </div>
                <div className="rounded-sm bg-white/20 px-3 py-2 text-right">
                  <p className="text-[10px] text-white/80">3년 생존 가능성</p>
                  <p className="mt-1 text-base font-extrabold">
                    {result?.survival.survival3Year ?? '-'}
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
              API 응답의 변수별 점수 기여도
            </p>
            <div className="mt-4 grid grid-cols-2 gap-x-7 gap-y-4">
              {displayScoreRows.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-[10px]">
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
                        width: `${Math.min(Math.abs(item.score), 100)}%`,
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
                  `${formatNumber(result?.derived.competitionRatio, 0)}%`,
                ],
                [
                  '임차부담도',
                  `${formatNumber(result?.derived.rentBurden, 0)}%`,
                ],
                [
                  '상권활력도',
                  `${formatNumber(result?.derived.vitalityScore, 0)}점`,
                ],
                [
                  '안정성지수',
                  `${formatNumber(result?.derived.stabilityIndex, 0)}점`,
                ],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-blue-300 p-3">
                  <p className="text-[11px] font-bold text-[#4e5968]">
                    {label}
                  </p>
                  <p className="mt-1 text-right text-xl font-extrabold text-blue-600">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-md border border-[#e5e8eb] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#191f28]">
                위험 요인 TOP 3
              </h3>
              <span className="text-[10px] text-[#e5484d]">
                음수 기여도가 큰 항목
              </span>
            </div>
            <div className="space-y-3">
              {(topRisks.length > 0
                ? topRisks
                : displayScoreRows.slice(0, 3)
              ).map((item, index) => (
                <div key={item.label} className="rounded-md bg-[#f7f8fa] p-3">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs text-[#191f28]">
                      {index + 1}위 {item.label}
                    </strong>
                    <span
                      className={`text-lg font-extrabold ${
                        item.score < 0 ? 'text-[#e5484d]' : 'text-blue-600'
                      }`}
                    >
                      {signedScore(item.score)}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-[#4e5968]">
                    {item.description} 지표가 생존율 점수에 반영되었습니다.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-md border border-[#e5e8eb] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#191f28]">
                유사 상권 대비 위치
              </h3>
              <span className="text-[10px] text-[#e5484d]">
                동일 업종 기준 상권별 생존율 비교
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {districtScores.map((district) => (
                <div
                  key={district.district}
                  className={`rounded-md border p-3 text-center ${
                    district.active
                      ? 'border-blue-600 bg-blue-300'
                      : 'border-transparent bg-blue-300/70'
                  }`}
                >
                  {district.active && (
                    <div className="mx-auto mb-1 w-fit rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-bold text-white">
                      내 상권
                    </div>
                  )}
                  <p className="text-[11px] font-bold text-[#4e5968]">
                    {district.district}
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-blue-600">
                    {district.score}
                  </p>
                  <p className="mt-1 text-[10px] text-[#4e5968]">
                    {district.level}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setResult(null)}
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
