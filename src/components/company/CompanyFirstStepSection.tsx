import stepAnalysis from '@/assets/company/step-analysis.svg';
import stepDecision from '@/assets/company/step-decision.svg';
import stepMarket from '@/assets/company/step-market.svg';
import CompanyEyebrow from './CompanyEyebrow';

const steps = [
  {
    icon: stepMarket,
    title: '시장 이해',
    description:
      '상권과 입지에 관한 다양한 데이터를 연결해 시장의 특징과 변화를 파악합니다.',
  },
  {
    icon: stepAnalysis,
    title: '데이터 분석',
    description:
      '유동인구, 소비 특성, 경쟁 환경과 비용·수익성을 종합적으로 살펴봅니다.',
  },
  {
    icon: stepDecision,
    title: '선택과 실행',
    description:
      '분석 결과를 명확한 판단 기준으로 바꾸어 더 나은 의사결정으로 연결합니다.',
  },
];

const CompanyFirstStepSection = () => (
  <section className="w-full snap-start scroll-mt-[88px] bg-blue-600/10 py-30 md:flex xl:py-14 md:min-h-[calc(100dvh-88px)] md:items-center">
    <div className="mx-auto w-full max-w-[1416px] px-6">
      <div className="flex flex-col items-center text-center">
        <CompanyEyebrow>OUR FIRST STEP</CompanyEyebrow>
        <h2 className="mt-5 text-[34px] leading-[1.3] font-extrabold tracking-[-0.04em] text-[#191f28] md:text-5xl 2xl:text-[60px]">
          그 첫 번째 시작, SEED+
        </h2>
        <p className="mt-5 text-lg leading-[1.4] tracking-[-0.56px] break-keep text-[#596579] md:text-[25px]">
          상권과 상업용 부동산 데이터로 창업자와 사업자가 입지와 시장을 더 쉽게
          이해하고 판단하도록 돕습니다.
        </p>
      </div>
      <ol className="mt-[50px] flex flex-col gap-[22px] lg:flex-row">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative flex min-w-0 flex-1 flex-col items-center gap-[9px] rounded-[22px] border border-[#e4eaf2] bg-white px-[25px] py-8 text-center"
          >
            <span className="flex size-[76px] items-center justify-center rounded-[23px] bg-[#f3f7ff]">
              <img src={step.icon} alt="" className="size-[38px]" />
            </span>
            <p className="pt-[11px] text-[15px] font-black tracking-[0.88px] text-blue-600">
              STEP {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="text-[25px] font-bold tracking-[-0.56px] text-[#191f28]">
              {step.title}
            </h3>
            <p className="max-w-[360px] text-[15px] leading-[24.5px] tracking-[-0.56px] break-keep text-[#596579]">
              {step.description}
            </p>
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute top-[120px] right-[-29px] z-10 hidden size-9 items-center justify-center rounded-full border border-[#dce7f8] bg-white text-base text-blue-600 lg:flex"
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default CompanyFirstStepSection;
