import seedLogo from '@/assets/company/seed-logo-center.png';
import valueChallenge from '@/assets/company/value-challenge.svg';
import valueCoprosperity from '@/assets/company/value-coprosperity.svg';
import valueExecution from '@/assets/company/value-execution.svg';
import valueTransparency from '@/assets/company/value-transparency.svg';
import valueTrust from '@/assets/company/value-trust.svg';
import CompanyEyebrow from './CompanyEyebrow';
import ScaledArt from './ScaledArt';

type CoreValue = {
  name: string;
  english: string;
  description: [string, string];
  icon: string;
  /** 아이콘 파일에 배경 사각형이 이미 들어 있는 경우 */
  iconHasBackground?: boolean;
  /** 원형 배치에서의 자리(시안 590px 기준) */
  position: string;
};

// 원형 배치 순서: 위 → 오른쪽 → 오른쪽 아래 → 왼쪽 아래 → 왼쪽
const coreValues: CoreValue[] = [
  {
    name: '투명성',
    english: 'Transparency',
    description: ['명확한 근거로', '판단할 수 있도록'],
    icon: valueTransparency,
    iconHasBackground: true,
    position: 'top-0 left-1/2 -translate-x-1/2',
  },
  {
    name: '신뢰',
    english: 'Trust',
    description: ['데이터와 결과에', '책임을 다하도록'],
    icon: valueTrust,
    position: 'top-[24%] right-0',
  },
  {
    name: '도전',
    english: 'Challenge',
    description: ['더 나은 방법을', '끊임없이 시도하도록'],
    icon: valueChallenge,
    position: 'bottom-0 left-[64.9%]',
  },
  {
    name: '실행',
    english: 'Execution',
    description: ['아이디어를 실제', '변화로 연결하도록'],
    icon: valueExecution,
    position: 'bottom-0 left-[9%]',
  },
  {
    name: '상생',
    english: 'Co-prosperity',
    description: ['사용자와 파트너, 전문가가', '함께 성장하도록'],
    icon: valueCoprosperity,
    position: 'top-[24%] left-0',
  },
];

// 중앙에서 카드 사이로 뻗는 선 5개
const SPOKE_ROTATIONS = [
  'rotate-0',
  'rotate-72',
  'rotate-144',
  '-rotate-144',
  '-rotate-72',
];

const ValueCard = ({
  value,
  className = '',
}: {
  value: CoreValue;
  className?: string;
}) => (
  <li
    className={`flex min-h-[142px] flex-col items-center gap-1 rounded-[20px] border border-[#d9e6fa] bg-white/96 px-3 py-[15px] text-center shadow-[0_12px_32px_rgba(30,73,145,0.07)] ${className}`}
  >
    {value.iconHasBackground ? (
      <img src={value.icon} alt="" className="size-[42px]" />
    ) : (
      <span className="flex size-[42px] items-center justify-center rounded-[13px] bg-[#edf4ff]">
        <img src={value.icon} alt="" className="size-[25px]" />
      </span>
    )}
    <h3 className="pt-1 text-[17px] leading-tight font-black tracking-[-0.56px] text-[#191f28]">
      {value.name}
    </h3>
    <p className="text-[15px] leading-tight font-black tracking-[-0.56px] text-blue-600">
      {value.english}
    </p>
    <p className="pt-[3px] text-xs leading-[15px] tracking-[-0.5px] whitespace-nowrap text-[#68758a]">
      {value.description[0]}
      <br />
      {value.description[1]}
    </p>
  </li>
);

const CenterLogo = () => (
  <div className="absolute top-1/2 left-1/2 flex size-[158px] -translate-1/2 flex-col items-center justify-center rounded-full border border-[#c9ddff] bg-linear-145 from-white to-[#e5efff] shadow-[0_12px_35px_rgba(49,130,246,0.17),inset_0_0_0_9px_rgba(255,255,255,0.66)]">
    <img
      src={seedLogo}
      alt="SEED+"
      width={128}
      height={44}
      className="h-11 w-32"
    />
    <p className="pt-2 text-[11px] leading-none font-black tracking-[1.26px] text-[#6681a9]">
      OUR PROMISE
    </p>
  </div>
);

const CompanyValuesSection = () => (
  <section className="w-full snap-start scroll-mt-[88px] bg-[#fafbfc] py-20 md:flex xl:py-8 md:min-h-[calc(100dvh-88px)] md:items-center">
    <div className="mx-auto flex w-full max-w-[1378px] flex-col items-center gap-12 px-6 xl:flex-row xl:justify-between xl:pr-[91px]">
      <div className="w-full pt-1.5 xl:w-auto">
        <CompanyEyebrow>OUR CORE VALUES</CompanyEyebrow>
        <h2 className="mt-4 text-[34px] leading-[1.49] font-extrabold tracking-[-0.04em] text-[#191f28] md:text-5xl md:leading-[1.49] 2xl:text-[60px]">
          다섯 가지 가치가
          <br />
          SEED+를 만듭니다.
        </h2>
        <p className="mt-4 max-w-[520px] text-lg leading-[1.4] tracking-[-0.56px] break-keep text-[#596579] md:text-[25px]">
          우리가 만드는 기술의 중심에는 언제나{' '}
          <br className="hidden xl:block" />
          사람이 있습니다. <br className="hidden xl:block" />
          투명하게 알리고, 신뢰에 책임지며, <br className="hidden xl:block" />더
          나은 방법에 도전하고, 실행으로 증명하며,{' '}
          <br className="hidden xl:block" />
          함께 성장합니다.
        </p>
      </div>
      {/* 원형 배치는 축소하면 글자가 읽히지 않아, 좁은 화면에서는 카드 목록으로 보여준다. */}
      <ul className="grid w-full grid-cols-2 gap-3 md:hidden">
        {coreValues.map((value, index) => (
          <ValueCard
            key={value.name}
            value={value}
            className={index === 0 ? 'col-span-2' : ''}
          />
        ))}
      </ul>
      <ScaledArt
        width={590}
        height={590}
        className="hidden [--art-scale:1] md:block xl:[--art-scale:0.9] 2xl:[--art-scale:1]"
      >
        <div
          aria-hidden
          className="absolute inset-[10%] rounded-full border border-dashed border-[#b8d1ff]"
        />
        <div
          aria-hidden
          className="absolute inset-[24%] rounded-full border border-blue-600/15"
        />
        {SPOKE_ROTATIONS.map((rotation) => (
          <span
            key={rotation}
            aria-hidden
            className={`absolute top-1/2 left-1/2 h-[230px] w-px origin-top bg-[#bcd3fa] ${rotation}`}
          />
        ))}
        <CenterLogo />
        <ul>
          {coreValues.map((value) => (
            <ValueCard
              key={value.name}
              value={value}
              className={`absolute w-[154px] ${value.position}`}
            />
          ))}
        </ul>
      </ScaledArt>
    </div>
  </section>
);

export default CompanyValuesSection;
