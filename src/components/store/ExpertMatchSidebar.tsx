const experts = [
  {
    icon: '💼',
    name: '김세무 세무사',
    desc: '상속/증여 및 법인 전환 전문',
  },
  {
    icon: '⚖️',
    name: '이변호 변호사',
    desc: '상가 임대차 분쟁/권리금 전문',
  },
  {
    icon: '🏢',
    name: '박중개 중개사',
    desc: '강남/서초 지역 프리미엄 상가',
  },
  {
    icon: '📊',
    name: '최회계 회계사',
    desc: '소상공인 법인 기장/절세 전략',
  },
];

const ExpertMatchSidebar = () => {
  return (
    <aside className="fixed right-0 top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] w-[360px] border-l border-[#e5e8eb] bg-white px-5 py-6 2xl:block">
      <h2 className="text-base font-extrabold text-[#191f28]">
        🧑‍💼 전문가 매칭
      </h2>
      <p className="mt-1 text-xs font-bold text-gray-46">
        회계사 · 세무사 · 변호사 · 중개사
      </p>

      <div className="mt-7 space-y-4">
        {experts.map((expert) => (
          <article
            key={expert.name}
            className="flex items-center gap-3 border-b border-[#e5e8eb] pb-4 last:border-b-0"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500 text-xl">
              {expert.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-[#191f28]">{expert.name}</div>
              <div className="mt-1 truncate text-xs font-bold text-gray-46">
                {expert.desc}
              </div>
            </div>
            <button
              type="button"
              className="rounded-full border border-blue-600 px-3 py-1.5 text-sm font-extrabold text-blue-600"
            >
              상담
            </button>
          </article>
        ))}
      </div>
    </aside>
  );
};

export default ExpertMatchSidebar;
