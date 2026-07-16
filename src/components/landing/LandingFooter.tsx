const linkGroups = [
  {
    heading: '서비스',
    links: [
      { label: '서비스 소개', href: '#about' },
      { label: '이용 방법', href: '#usage' },
      { label: '활용 사례', href: '#reviews' },
    ],
  },
  {
    heading: '고객 지원',
    links: [
      { label: '공지사항', href: null },
      { label: 'FAQ', href: null },
      { label: '문의하기', href: 'mailto:seedbusiness0@gmail.com' },
    ],
  },
  {
    heading: '회사',
    links: [
      { label: '회사 소개', href: null },
      { label: '이용약관', href: null },
      { label: '개인정보처리방침', href: null },
    ],
  },
];

const LandingFooter = () => {
  return (
    <footer className="w-full border-t border-[#e5e8eb] bg-white py-20">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div>
            <p className="text-2xl font-bold text-[#191f28]">SEED+</p>
            <p className="pt-4 text-lg text-[#191f28] md:text-xl">
              SEED+는 주식회사 스페이로가
              <br />
              운영하는 서비스입니다.
            </p>
          </div>
          {linkGroups.map((group) => (
            <div key={group.heading} className="flex flex-col gap-3">
              <p className="text-lg font-bold text-[#191f28] md:text-xl">
                {group.heading}
              </p>
              {group.links.map((link) =>
                link.href ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-lg text-gray-46 transition-colors hover:text-blue-600 md:text-xl"
                  >
                    {link.label}
                  </a>
                ) : (
                  <span
                    key={link.label}
                    className="text-lg text-gray-46 md:text-xl"
                  >
                    {link.label}
                  </span>
                )
              )}
            </div>
          ))}
        </div>
        <div className="pt-16 text-[17px] text-[#6b7684]">
          <p className="font-bold text-[#191f28]">(주) 스페이로</p>
          <p className="pt-3 leading-relaxed">
            대표이사 민준호
            <br />
            사업자등록번호: 846-87-03651
            <br />
            통신판매업 신고번호: 2026-서울은평-0735
            <br />
            E-mail: seedbusiness0@gmail.com
            <br />
            고객센터: 0503-6101-9503
          </p>
        </div>
        <p className="pt-10 text-center text-[17px] text-[#6b7684]">
          © 2026 주식회사 스페이로. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
