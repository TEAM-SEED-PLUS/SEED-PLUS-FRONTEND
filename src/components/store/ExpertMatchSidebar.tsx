const experts = [
  {
    icon: '👨🏻‍💼',
    name: '김변호 변호사',
    desc: '상가 임대차 분쟁 / 권리금 전문',
  },
  {
    icon: '👩🏻‍💼',
    name: '박세무 세무사',
    desc: '상속/증여 및 법인 전환 전문',
  },
  {
    icon: '👨🏻‍💻',
    name: '박중개 중개사',
    desc: '강남/서초 지역 프리미엄 상가',
  },
  {
    icon: '👨🏻‍💼',
    name: '최회계 회계사',
    desc: '소상공인 법인기장, 절세전략',
  },
];

const ExpertMatchSidebar = () => {
  return (
    <aside className="fixed right-0 top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] w-[264px] border-l border-[#e5e8eb] bg-white px-5 py-5 2xl:block">
      <h2 className="text-base font-extrabold text-[#191f28]">전문가 매칭</h2>

      <div className="mt-4 space-y-2">
        {experts.map((expert) => (
          <article
            key={expert.name}
            className="flex items-center gap-3 rounded-md border border-[#e5e8eb] bg-white px-3 py-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-500 text-2xl">
              {expert.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-extrabold text-[#191f28]">
                {expert.name}
              </div>
              <div className="mt-1 truncate text-xs font-medium text-gray-46">
                {expert.desc}
              </div>
            </div>
            <span className="text-2xl text-[#191f28]">›</span>
          </article>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 h-10 w-full rounded-md bg-blue-600 text-sm font-extrabold text-white"
      >
        더보기
      </button>
    </aside>
  );
};

export default ExpertMatchSidebar;
