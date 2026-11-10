import heroEllipse1 from '@/assets/company/hero-ellipse-1.svg';
import heroEllipse2 from '@/assets/company/hero-ellipse-2.svg';
import spairoLogo from '@/assets/company/spairo-logo.png';
import CompanyEyebrow from './CompanyEyebrow';

const CHIP_CLASS =
  'absolute z-10 rounded-[14px] border border-[#e5ecf7] bg-white/93 px-3 py-2 text-[13px] font-extrabold tracking-[-0.56px] whitespace-nowrap text-[#364152] shadow-[0_12px_35px_rgba(31,73,140,0.07)] md:px-[15px] md:py-3 md:text-[19px]';

const CompanyHeroSection = () => (
  <section className="w-full snap-start scroll-mt-[88px] overflow-hidden bg-white py-20 md:flex md:min-h-[calc(100dvh-88px)] md:items-center md:py-[100px]">
    <div className="mx-auto flex w-full max-w-[1412px] flex-col gap-20 px-6 xl:flex-row xl:items-center xl:justify-between">
      <div className="xl:max-w-[669px]">
        <CompanyEyebrow>SPAIRO · COMPANY</CompanyEyebrow>
        <h1 className="mt-5 text-[34px] leading-[1.49] font-bold text-[#191f28] md:text-5xl md:leading-[1.49] 2xl:text-[60px]">
          더 나은 선택이
          <br />
          <span className="text-blue-600">더 나은 미래</span>를 만듭니다.
        </h1>
        <p className="mt-8 max-w-[588px] text-lg leading-[1.52] font-medium break-keep text-[#606060] md:mt-11 md:text-[23px]">
          주식회사 스페이로는 데이터와 기술을 통해 복잡한 정보를 더 쉽고
          명확하게 만들며, 사람들이 더 나은 선택을 할 수 있도록 돕는 기업입니다.
        </p>
      </div>
      {/* 로고 원판. 칩·배경 원의 좌표는 시안에서 원판(387px) 기준으로 옮겼다. */}
      <div className="relative mx-auto size-[240px] shrink-0 md:size-[387px] xl:mx-0 xl:mr-[196px] 2xl:mr-[152px]">
        <img
          src={heroEllipse1}
          alt=""
          className="absolute top-[-92px] left-[346px] hidden size-[288px] max-w-none rotate-[37.28deg] md:block"
        />
        <img
          src={heroEllipse2}
          alt=""
          className="absolute top-[273px] left-[-214px] hidden size-[288px] max-w-none rotate-[-141.33deg] md:block"
        />
        <div className="absolute inset-0 rounded-[42.6%] border border-blue-600/15">
          <div className="absolute inset-[7.2%] rounded-[41.1%] border border-blue-600/11" />
          <div className="absolute inset-[16.8%] rounded-[38.5%] border border-blue-600/11" />
          <img
            src={spairoLogo}
            alt="주식회사 스페이로 로고"
            className="absolute top-[0.8%] left-[1.8%] size-[98%] object-cover"
          />
        </div>
        <p
          className={`${CHIP_CLASS} -bottom-5 -left-4 md:top-[393px] md:bottom-auto md:left-[-149px]`}
        >
          더 명확한 의사결정
        </p>
        <p
          className={`${CHIP_CLASS} -top-3 -right-4 md:top-[17px] md:right-auto md:left-[392px]`}
        >
          데이터에서 인사이트로
        </p>
      </div>
    </div>
  </section>
);

export default CompanyHeroSection;
