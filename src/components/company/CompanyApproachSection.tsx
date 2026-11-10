import CompanyEyebrow from './CompanyEyebrow';

const approaches = [
  {
    title: '흩어진 정보를 연결합니다',
    description:
      '상권 변화, 유동인구, 소비 특성, 경쟁 환경, 비용과 수익성 등 여러 곳에 흩어진 정보를 하나의 관점에서 살펴봅니다.',
  },
  {
    title: '이해할 수 있는 기준을 만듭니다',
    description:
      '데이터와 AI 기술을 활용해 복잡한 정보를 사용자가 이해하고 활용할 수 있는 형태로 전환합니다.',
  },
  {
    title: '더 나은 선택으로 연결합니다',
    description:
      '경험과 직감에 의존했던 판단을 데이터에 기반한 의사결정으로 바꾸는 것을 목표로 합니다.',
  },
];

const CompanyApproachSection = () => (
  <section className="w-full snap-start scroll-mt-[88px] bg-white py-30 md:flex xl:py-20 md:min-h-[calc(100dvh-88px)] md:items-center">
    <div className="mx-auto flex w-full max-w-[1418px] flex-col gap-14 px-6 xl:flex-row xl:gap-[60px]">
      <div className="min-w-0 flex-1 pt-1.5">
        <CompanyEyebrow>OUR APPROACH</CompanyEyebrow>
        <h2 className="mt-4 text-[34px] leading-[1.49] font-bold tracking-[-0.04em] text-[#191f28] md:text-5xl md:leading-[1.49] 2xl:text-[60px]">
          데이터를 넘어,
          <br />
          판단을 만듭니다.
        </h2>
        <p className="mt-4 max-w-[600px] text-lg leading-[1.4] font-medium tracking-[-0.56px] break-keep text-[#596579] md:text-[25px]">
          데이터를 수집하고 분석하는 데서 멈추지 않습니다.{' '}
          <br className="hidden xl:block" />
          복잡한 정보를 이해하기 쉬운 형태로 바꾸고,{' '}
          <br className="hidden xl:block" />
          실제 행동과 의사결정으로 이어지게 합니다.
        </p>
        <div className="mt-7 flex items-center justify-between gap-4 rounded-[10px] border-l-[5px] border-blue-600 bg-[#f3f7ff] px-6 py-[22px]">
          <p className="text-base leading-[1.71] font-extrabold tracking-[-0.56px] break-keep text-[#0c2c78] md:text-[18.3px]">
            “어디가 좋은가?”를 넘어
            <br />
            “왜 이곳을 선택해야 하는가?”까지.
          </p>
          <span aria-hidden className="text-[40px] leading-none text-[#a5b8d7]">
            →
          </span>
        </div>
      </div>
      <ol className="flex min-w-0 flex-1 flex-col gap-6 xl:gap-11">
        {approaches.map((approach, index) => (
          <li
            key={approach.title}
            className="flex items-start gap-5 rounded-[18px] border border-[#e4eaf2] p-[22px]"
          >
            <span className="flex size-[46px] shrink-0 items-center justify-center rounded-[14px] bg-[#eaf2ff] text-sm font-black tracking-[-0.56px] text-blue-600">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1 pt-[3px]">
              <h3 className="text-xl font-bold tracking-[-0.56px] text-[#191f28]">
                {approach.title}
              </h3>
              <p className="mt-2 text-[15px] leading-[24.5px] tracking-[-0.56px] break-keep text-[#596579]">
                {approach.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default CompanyApproachSection;
