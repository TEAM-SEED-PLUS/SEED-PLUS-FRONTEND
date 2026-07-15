import dashboardPreview from '@/assets/landing/dashboard-preview.png';

const strengths = [
  '전문가로서의 신뢰 강화',
  '성과 향상 지원',
  '전문가 네트워크 확장',
];

const FeatureSection = () => {
  return (
    <section id="about" className="w-full scroll-mt-[88px] bg-blue-600 py-30">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-14 px-6 lg:flex-row">
        <div className="max-w-[667px]">
          <h2 className="text-[34px] leading-[1.35] font-bold text-white md:text-5xl xl:text-[54px]">
            공인중개사의 경험에
            <br />
            데이터라는 무기를 더합니다.
          </h2>
          <p className="mt-8 text-xl font-medium text-white md:text-[25px]">
            SEED+ 만의 3가지 구성요소
          </p>
          <ul className="mt-6 max-w-[339px]">
            {strengths.map((strength) => (
              <li
                key={strength}
                className="border-b border-[#e5e7eb] pt-3 pb-4 text-xl font-semibold text-white md:text-[25px]"
              >
                ✔ {strength}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={dashboardPreview}
          alt="SEED+ 상권 분석 대시보드 미리보기"
          className="w-full max-w-[678px] rounded-[5px] object-cover"
        />
      </div>
    </section>
  );
};

export default FeatureSection;
