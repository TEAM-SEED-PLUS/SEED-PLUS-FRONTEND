import {
  BarChartIcon,
  BellIcon,
  ShoppingCartIcon,
} from '@/components/ui/icons';

// 사이드바 3개 섹션 모두 아직 API가 없다.
// 값을 지어내지 않고 빈 목록으로 두고, 각 섹션에 빈 상태 문구를 노출한다.
// TODO(BE): 데이터 스토리 / 공동구매 / 상권 알림 엔드포인트 확정 시 연동.
type Story = { title: string; bg: string };
type Purchase = { title: string; meta: string };
type Alert = { title: string; meta: string; className: string };

const stories: Story[] = [];
const purchases: Purchase[] = [];
const alerts: Alert[] = [];

const EmptyNotice = ({ message }: { message: string }) => (
  <p className="rounded-lg bg-gray-500 px-4 py-8 text-center text-xs font-medium text-gray-46">
    {message}
  </p>
);

const FeedSidebar = () => {
  return (
    <aside className="hidden w-[360px] shrink-0 space-y-5 xl:block">
      <section className="rounded-xl border border-[#e5e8eb] bg-white">
        <div className="flex items-center gap-2 border-b border-[#e5e8eb] px-5 py-4 text-sm font-bold">
          <BarChartIcon className="h-4 w-4 text-blue-600" />
          데이터 스토리
          <span className="text-xs font-medium text-gray-46">상권 쇼츠</span>
        </div>
        <div className="px-5 py-4">
          {stories.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {stories.map((story) => (
                <button
                  key={story.title}
                  type="button"
                  className={`flex h-32 items-end rounded-lg bg-gradient-to-br ${story.bg} p-2 text-left text-xs font-bold leading-4 text-white shadow-sm`}
                >
                  {story.title}
                </button>
              ))}
            </div>
          ) : (
            <EmptyNotice message="아직 등록된 데이터 스토리가 없습니다." />
          )}
        </div>
      </section>

      <section className="rounded-xl border border-[#e5e8eb] bg-white">
        <div className="flex items-center gap-2 border-b border-[#e5e8eb] px-5 py-4 text-sm font-bold">
          <ShoppingCartIcon className="h-4 w-4 text-blue-600" />
          진행중인 공동구매
        </div>
        <div className="space-y-3 p-5">
          {purchases.length > 0 ? (
            purchases.map((purchase) => (
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
            ))
          ) : (
            <EmptyNotice message="진행중인 공동구매가 없습니다." />
          )}
        </div>
      </section>

      <section className="rounded-xl border border-[#e5e8eb] bg-white">
        <div className="flex items-center gap-2 border-b border-[#e5e8eb] px-5 py-4 text-sm font-bold">
          <BellIcon className="h-4 w-4 text-blue-600" />
          상권 알림
        </div>
        <div className="space-y-3 p-5">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
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
            ))
          ) : (
            <EmptyNotice message="새로운 상권 알림이 없습니다." />
          )}
        </div>
      </section>
    </aside>
  );
};

export default FeedSidebar;
