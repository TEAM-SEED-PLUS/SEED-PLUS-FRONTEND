import AlliosLogo from '@/assets/Logo/allios-logo.png';
import ZiptossLogo from '@/assets/Logo/ziptoss-logo.png';

const partnerLinks = [
  {
    id: 'allios',
    title: 'ALLIOS',
    description:
      '고급주거 전문 컨설팅 기업 / 고급주택 전문중개 / 분양.개발 컨설팅 / 해외부동산 투자',
    href: 'https://allios.co.kr',
    logo: AlliosLogo,
  },
  {
    id: 'ziptoss',
    title: '집토스',
    description:
      '서울 10개 지점 운영, 원룸·투룸·오피스텔 전월세 매물이 가장 많은 부동산! 담당 공인중개사와 직접 계약하세요.',
    href: 'https://ziptoss.com/?zoom=13&lat=37.4891577&lng=126.9507133&sort=DEFAULT&order=DESC',
    logo: ZiptossLogo,
  },
];

const ExpertMatchSidebar = () => (
  <aside className="fixed right-0 top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] w-[264px] border-l border-[#e5e8eb] bg-white px-5 py-5 2xl:block">
    <h2 className="text-base font-extrabold text-[#191f28]">제휴 파트너</h2>

    <div className="mt-4 space-y-3">
      {partnerLinks.map((partner) => (
        <a
          key={partner.id}
          href={partner.href}
          target="_blank"
          rel="noreferrer"
          className="block rounded-md border border-[#e5e8eb] bg-white p-4 transition hover:border-blue-600 hover:bg-[#f5f8ff]"
        >
          <div className="flex h-12 items-center">
            <img
              src={partner.logo}
              alt={`${partner.title} 로고`}
              className="max-h-10 max-w-[120px] object-contain"
            />
          </div>
          <h3 className="mt-3 text-sm font-extrabold text-[#191f28]">
            {partner.title}
          </h3>
          <p className="mt-2 text-xs font-medium leading-relaxed text-[#6b7684]">
            {partner.description}
          </p>
        </a>
      ))}
    </div>
  </aside>
);

export default ExpertMatchSidebar;
