import CloudIcon from '@/assets/weather/cloud-02.svg';
import appScreen1 from '@/assets/landing/app-screen-1.png';
import appScreen2 from '@/assets/landing/app-screen-2.png';
import appScreen3 from '@/assets/landing/app-screen-3.png';

const features = [
  {
    title: '1. 생존율 계산기',
    description:
      '최근 상권 성장률과 매출 데이터를 기반으로 3년 · 5년 생존 가능성을 분석합니다.',
    image: appScreen1,
  },
  {
    title: '2. 내 상가 만들기',
    description:
      '상가명, 업종, 임대료, 직원 수 등을 입력하여 예상 매출과 수익률을 계산합니다.',
    image: appScreen2,
  },
  {
    title: '3. 전문가 원클릭 연결',
    description: '회계사, 변호사 등 전문가와 클릭 한 번으로 빠르게 연결됩니다.',
    image: appScreen3,
  },
  {
    title: '4. 상권 날씨',
    description:
      '지역별 유동 인구와 소비 트렌드를 실시간으로 분석하여, 현재 상권의 활성 상태를 날씨처럼 한눈에 보여줍니다.',
    image: null,
  },
];

const ProcessSection = () => {
  return (
    <section
      id="features"
      className="w-full snap-start scroll-mt-[88px] bg-blue-600/10 py-30 md:flex md:min-h-[calc(100dvh-88px)] md:items-center"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <h2 className="text-center text-[34px] font-bold text-[#191f28] md:text-[52px]">
          SEED+의 4가지 주요 기능
        </h2>
        <p className="mt-3 text-center text-lg leading-[30px] font-medium text-black md:text-xl">
          SEED+의 4가지 주요 기능을 만나보세요!
        </p>
        <div className="mt-16 grid grid-cols-1 gap-[30px] sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col rounded-3xl bg-[#ebf3ff] p-8"
            >
              <div className="flex h-[220px] items-center justify-center">
                {feature.image ? (
                  <img
                    src={feature.image}
                    alt={`${feature.title} 화면 미리보기`}
                    className="max-h-full max-w-full rounded-[5px] object-contain"
                  />
                ) : (
                  <img
                    src={CloudIcon}
                    alt=""
                    aria-hidden
                    className="h-20 w-20"
                  />
                )}
              </div>
              <h3 className="pt-6 text-center text-lg font-bold text-[#191f28]">
                {feature.title}
              </h3>
              <p className="pt-3 text-center text-base leading-[30px] text-black">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
