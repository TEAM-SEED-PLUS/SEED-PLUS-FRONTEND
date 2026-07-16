import type { Ref } from 'react';
import WarningIcon from '@/assets/icons/warning-icon.svg';
import { SurvivalGauge } from './SurvivalEstimateModal';

export type PdfScoreRow = {
  label: string;
  description: string;
  score: number;
  positive: boolean;
};

export type PdfComparisonDistrict = {
  name: string;
  score: number;
  active: boolean;
};

interface SurvivalPdfReportProps {
  ref: Ref<HTMLDivElement>;
  dataBadges: string[];
  inputSummary: [string, string][];
  totalScore: number;
  survival1Year: string;
  survival3Year: string;
  scoreRows: PdfScoreRow[];
  topRisks: PdfScoreRow[];
  comparisonDistricts: PdfComparisonDistrict[];
  metricCards: [string, string, string][];
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const signedScore = (value: number) => `${value >= 0 ? '+' : ''}${value}`;
const getLevel = (score: number) => {
  if (score >= 90) return '높음';
  if (score >= 70) return '보통';
  if (score >= 50) return '주의';
  return '위험';
};

// Figma "생존율 계산기 -2 PDF 출력" 프레임(A4 595×842pt) 기준.
// 인쇄 시 CSS 96dpi 기준 A4 폭 794px에 맞춰 시안 수치를 4/3 배율로 환산해 사용한다.
const SurvivalPdfReport = ({
  ref,
  dataBadges,
  inputSummary,
  totalScore,
  survival1Year,
  survival3Year,
  scoreRows,
  topRisks,
  comparisonDistricts,
  metricCards,
}: SurvivalPdfReportProps) => {
  return (
    <div
      ref={ref}
      className="h-[296mm] w-[794px] overflow-hidden bg-white px-[37px] pt-[24px] text-[#222222] [print-color-adjust:exact]"
    >
      <style>
        {
          '@page { size: A4; margin: 0; } @media print { html, body, #root { height: auto !important; } }'
        }
      </style>
      <div className="border-b border-[#e1e4eb] pb-4">
        <h1 className="text-[20px] font-bold">데이터 출처 및 API 연동 현황</h1>
        <p className="mt-2 text-[15px] font-light">
          본 계산기에 반영된 공공데이터
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {dataBadges.map((badge) => (
          <span
            key={badge}
            className="rounded-xl bg-[#d6e6fd] px-3 py-2 text-[15px] text-blue-600"
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#e33639] bg-[#fff6f5] p-3">
        <img src={WarningIcon} alt="" className="h-5 w-5 shrink-0" />
        <p className="text-[15px] leading-[1.4] font-medium text-[#e33639]">
          본 생존율은 공공데이터 기반 점수 모델로 산출된 참고용 추정치입니다.
          실제 생존율은 운영 역량, 마케팅, 경기 변동 등 다양한 요인에 따라
          달라질 수 있습니다. 소상공인시장진흥공단
          상권분석서비스(sg.sbiz.or.kr)와 함께 활용하시길 권장합니다.
        </p>
      </div>

      <div className="mt-3 flex rounded-xl bg-[#f7f8fa] px-4 py-2">
        {inputSummary.map(([label, value]) => (
          <div key={label} className="min-w-0 flex-1">
            <p className="text-[11px] text-[#9ca1a9]">{label}</p>
            <p className="truncate text-[13px] font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-[321px_1fr] gap-5">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-blue-600 p-4 text-white">
            <p className="text-[20px] font-bold">Survival Score</p>
            <div className="mt-2 grid grid-cols-[1fr_124px] items-center gap-3">
              <SurvivalGauge score={totalScore} />
              <div className="flex flex-col gap-2">
                <div className="rounded-sm border border-white/30 bg-white/20 p-2">
                  <p className="text-[13px] font-light">1년 생존 가능성</p>
                  <p className="mt-1 text-right text-[18px] font-bold whitespace-nowrap">
                    {survival1Year}
                  </p>
                </div>
                <div className="rounded-sm border border-white/30 bg-white/20 p-2">
                  <p className="text-[13px] font-light">3년 생존 가능성</p>
                  <p className="mt-1 text-right text-[18px] font-bold whitespace-nowrap">
                    {survival3Year}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#e1e4eb] p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[17px] font-semibold whitespace-nowrap">
                위험 요인 TOP 3
              </h2>
              <span className="flex items-center gap-1 text-[12px] font-medium text-[#e33639]">
                <img src={WarningIcon} alt="" className="h-4 w-4" />
                생존율에 가장 큰 영향을 미치는 요인
              </span>
            </div>
            <div className="mt-2 space-y-2">
              {topRisks.map((item, index) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-[#f7f8fa] px-3 py-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1 text-[15px]">
                      {index === 0 && (
                        <img src={WarningIcon} alt="" className="h-4 w-4" />
                      )}
                      <span className="font-semibold">{index + 1}위</span>
                      <span className="font-light">{item.label}</span>
                    </p>
                    <p
                      className={`text-[20px] font-bold ${
                        item.score < 0 ? 'text-[#e33639]' : 'text-blue-600'
                      }`}
                    >
                      {signedScore(item.score)}점
                    </p>
                  </div>
                  <p className="mt-1 text-[11px] leading-snug">
                    {item.description} 항목이 생존 가능성 산정에 반영됩니다.
                    수익성 악화 위험이 높을수록 감점 폭이 커집니다.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#e1e4eb] p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[17px] font-semibold whitespace-nowrap">
                유사 상권 대비 위치
              </h2>
              <span className="flex items-center gap-1 text-[12px] font-medium text-[#e33639]">
                <img src={WarningIcon} alt="" className="h-4 w-4" />
                동일 업종 기준 상권별 생존율 비교
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {comparisonDistricts.map((district) => (
                <div
                  key={`${district.name}-${district.active ? 'active' : 'neighbor'}`}
                  className={`flex flex-col items-center gap-1 rounded-xl bg-[#f0f5ff] px-2 py-2 ${
                    district.active ? 'border border-blue-600' : ''
                  }`}
                >
                  {district.active && (
                    <p className="rounded-xl bg-blue-600 px-3 py-0.5 text-[12px] font-semibold text-white">
                      내 상권
                    </p>
                  )}
                  <p className="text-[15px] font-semibold">{district.name}</p>
                  <p className="text-[20px] font-semibold text-blue-600">
                    {district.score}점
                  </p>
                  <p className="text-[15px]">{getLevel(district.score)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="border-b border-[#e1e4eb] pb-1">
            <h2 className="text-[20px] font-bold">Survival Score 분해</h2>
            <p className="mt-2 text-[15px] font-light">
              6개 변수별 점수 기여도
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
            {scoreRows.map((item) => (
              <div key={item.label}>
                <p className="text-[17px] font-semibold">{item.label}</p>
                <p className="mt-1 text-[15px] font-light text-[#9ca1a9]">
                  {item.description}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <div className="h-[19px] flex-1 overflow-hidden rounded-full bg-[#f7f8fa]">
                    <div
                      className={`h-full ${
                        item.positive ? 'bg-blue-600' : 'bg-[#e33639]'
                      }`}
                      style={{
                        width: `${clamp(Math.abs(item.score) * 5, 4, 100)}%`,
                      }}
                    />
                  </div>
                  <p
                    className={`text-[15px] font-semibold ${
                      item.positive ? 'text-blue-600' : 'text-[#e33639]'
                    }`}
                  >
                    {signedScore(item.score)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {metricCards.map(([label, description, value]) => (
              <div key={label} className="rounded-xl bg-[#f0f5ff] p-4">
                <p className="text-[15px] font-semibold text-[#596170]">
                  {label}
                </p>
                <p className="mt-1 text-[13px] text-[#9ca1a9]">{description}</p>
                <p className="mt-1 text-right text-[30px] font-bold text-blue-600">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurvivalPdfReport;
