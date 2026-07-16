const stories = [
  {
    title: '홍대 상권 요즘 뜨는 곳',
    bg: 'from-[#1f2937] via-[#374151] to-[#d97706]',
  },
  {
    title: '성수동 카페 매출 분석',
    bg: 'from-[#2f241f] via-[#795548] to-[#c6a27e]',
  },
  {
    title: '강남역 유동인구 분석',
    bg: 'from-[#1d4ed8] via-[#38bdf8] to-[#86efac]',
  },
];

const purchases = [
  { title: '강남구 식자재 공동구매', meta: '참여 12/20점포 · 마감 D-3' },
  { title: '마포구 포장재 공동구매', meta: '참여 8/15점포 · 마감 D-7' },
  { title: '성수동 카페원두 공동구매', meta: '참여 18/20점포 · 마감 D-1' },
];

const alerts = [
  {
    title: '홍대 임대료 5% 인상 예고',
    meta: '3월 계약 갱신 시 적용 예정',
    className: 'bg-[#fff6e6] border-l-[#f2992e]',
  },
  {
    title: '성수동 유동인구 12% 증가',
    meta: '팝업스토어 효과 · 주말 집중',
    className: 'bg-[#eafff2] border-l-[#50c878]',
  },
  {
    title: '소상공인 지원금 신청 시작',
    meta: '3월 1일 ~ 3월 31일 접수',
    className: 'bg-[#eef5ff] border-l-blue-600',
  },
];

const FeedSidebar = () => {
  return (
    <aside className="hidden w-[360px] shrink-0 space-y-5 xl:block">
      <section className="rounded-xl border border-[#e5e8eb] bg-white">
        <div className="border-b border-[#e5e8eb] px-5 py-4 text-sm font-bold">
          🧮 데이터 스토리{' '}
          <span className="text-xs font-medium text-gray-46">상권 쇼츠</span>
        </div>
        <div className="px-5 py-4">
          <div className="grid grid-cols-3 gap-2">
            {stories.map((story) => (
              <button
                key={story.title}
                type="button"
                className={`flex h-32 items-end rounded-lg bg-gradient-to-br ${story.bg} p-2 text-left text-xs font-bold leading-4 text-white shadow-sm`}
              >
                ▶ {story.title}
              </button>
            ))}
          </div>
          <div className="mt-3 h-2 rounded-full bg-[#8f8f8f]" />
        </div>
      </section>

      <section className="rounded-xl border border-[#e5e8eb] bg-white">
        <div className="border-b border-[#e5e8eb] px-5 py-4 text-sm font-bold">
          🛒 진행중인 공동구매
        </div>
        <div className="space-y-3 p-5">
          {purchases.map((purchase) => (
            <button
              key={purchase.title}
              type="button"
              className="w-full rounded-lg bg-gray-500 px-4 py-3 text-left"
            >
              <div className="text-sm font-bold text-[#191f28]">
                {purchase.title}
              </div>
              <div className="mt-1 text-xs font-medium text-gray-46">
                {purchase.meta}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[#e5e8eb] bg-white">
        <div className="border-b border-[#e5e8eb] px-5 py-4 text-sm font-bold">
          🔔 상권 알림
        </div>
        <div className="space-y-3 p-5">
          {alerts.map((alert) => (
            <div
              key={alert.title}
              className={`rounded-lg border-l-4 px-4 py-3 ${alert.className}`}
            >
              <div className="text-sm font-bold text-[#191f28]">
                {alert.title}
              </div>
              <div className="mt-1 text-xs font-medium text-gray-46">
                {alert.meta}
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default FeedSidebar;
