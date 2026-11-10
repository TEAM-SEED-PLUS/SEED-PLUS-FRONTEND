import checkBadge from '@/assets/company/check-badge.svg';
import docFoldMask from '@/assets/company/doc-fold-mask.svg';
import seedLogo from '@/assets/company/seed-logo-card.png';
import CompanyEyebrow from './CompanyEyebrow';
import ScaledArt from './ScaledArt';

const SIDE_CARD_CLASS =
  'absolute flex flex-col items-start gap-3 rounded-[14px] border border-blue-600/18 bg-white px-[18px] pt-[37px] drop-shadow-[0_15px_17.5px_rgba(49,130,246,0.08)]';

/** 양옆 문서 카드의 본문 줄 */
const SideCardLines = () => (
  <>
    <span className="h-1 w-full rounded-[5px] bg-[#b7d4fd]" />
    <span className="h-1 w-[78px] rounded-[5px] bg-[#b7d4fd]" />
    <span className="h-1 w-[60px] rounded-[5px] bg-[#b7d4fd]" />
    <span className="h-1 w-[83px] rounded-[5px] bg-[#b7d4fd]" />
  </>
);

/** 문서 3장 + 체크 배지 일러스트. 좌표는 시안(650×440) 기준이다. */
const DocumentArt = () => (
  <div aria-hidden className="relative size-full">
    <div
      className={`${SIDE_CARD_CLASS} top-[96px] left-[42px] h-[196px] w-[154px] -rotate-9`}
    >
      <SideCardLines />
    </div>
    <div className="absolute top-[7px] left-[216px] h-[333px] w-[275px] -rotate-3 rounded-[18px] bg-[#e7effb] shadow-[0_25px_65px_rgba(49,130,246,0.12),0_5px_20px_rgba(31,65,110,0.04)]">
      <img
        src={seedLogo}
        alt=""
        width={165}
        height={58}
        className="absolute top-[31px] left-[26px] h-[58px] w-[165px] max-w-none rotate-[0.16deg]"
      />
      <p className="absolute top-[112px] left-[25px] text-[10px] leading-none font-bold tracking-[1.5px] whitespace-nowrap text-[#7d8ba0]">
        DATA &amp; TRUST
      </p>
      <span className="absolute top-[144px] right-[53px] left-[23px] h-1.5 rounded-[10px] bg-blue-600/50" />
      <div className="absolute top-[228px] right-[29px] left-[23px] flex flex-col items-start gap-2 rounded-[10px] bg-[#f0f6ff] px-3 pt-3 pb-5">
        <span className="h-[5px] w-[104px] rounded-[10px] bg-blue-600/30" />
        <span className="h-[5px] w-[104px] rounded-[10px] bg-blue-600/30" />
        <span className="h-[5px] w-[63px] rounded-[10px] bg-blue-600/30" />
      </div>
      {/* 접힌 모서리 */}
      <span
        className="absolute top-px right-px size-[43px] rounded-tr-[17px] rounded-bl-xl border-b border-l border-blue-600/20 bg-[#edf4ff] mask-no-repeat mask-size-[45.19px_45.19px]"
        style={{ maskImage: `url("${docFoldMask}")` }}
      />
    </div>
    <div
      className={`${SIDE_CARD_CLASS} top-[47px] left-[513px] h-[204px] w-[161px] rotate-8`}
    >
      <SideCardLines />
    </div>
    <div className="absolute top-[264px] left-[436px] flex size-[92px] items-center justify-center rounded-full border border-blue-600/20 bg-linear-145 from-white to-[#edf5ff] drop-shadow-[0_12px_17.5px_rgba(49,130,246,0.17)]">
      <div className="flex size-[65px] items-center justify-center rounded-full bg-blue-600 drop-shadow-[0_5px_7.5px_rgba(49,130,246,0.25)]">
        <img src={checkBadge} alt="" className="size-[34px]" />
      </div>
    </div>
  </div>
);

const CompanyWhySection = () => (
  <section className="w-full snap-start scroll-mt-[88px] overflow-hidden bg-[#0038c5] py-30 md:flex xl:py-24 md:min-h-[calc(100dvh-88px)] md:items-center">
    <div className="mx-auto flex w-full max-w-[1412px] flex-col items-center gap-16 px-6 xl:flex-row xl:justify-between xl:pr-14">
      <div className="w-full xl:w-auto xl:max-w-[625px]">
        <CompanyEyebrow tone="onBlue">WHY WE EXIST</CompanyEyebrow>
        <h2 className="mt-6 text-[34px] leading-[1.49] font-bold text-white md:text-5xl md:leading-[1.49] 2xl:text-[60px]">
          더 많은 정보보다
          <br />더 나은 판단을 위해.
        </h2>
        <p className="mt-8 max-w-[625px] text-lg leading-[1.4] font-medium tracking-[1px] break-keep text-[#dce8ff] md:mt-10 md:text-[25px]">
          중요한 선택에 필요한 정보는 흩어져 있고,{' '}
          <br className="hidden xl:block" />
          전문적인 데이터는 이해하고 활용하기 어렵습니다.{' '}
          <br className="hidden xl:block" />
          스페이로는 이 간극을 줄여 누구나 자신의 선택에 확신을{' '}
          <br className="hidden xl:block" />
          가질 수 있는 세상을 만들고자 합니다.
        </p>
      </div>
      <ScaledArt
        width={650}
        height={440}
        className="[--art-scale:0.48] sm:[--art-scale:0.8] xl:[--art-scale:0.85] 2xl:[--art-scale:1]"
      >
        <DocumentArt />
      </ScaledArt>
    </div>
  </section>
);

export default CompanyWhySection;
