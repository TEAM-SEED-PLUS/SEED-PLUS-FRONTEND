import { HeaderUser } from '@/components/layout';
import {
  DistrictStatusCard,
  EventCalendar,
  IndustryRanking,
  MarketMetricStrip,
  PropertyScoreCard,
  RecentTransactionsCard,
  SalesTrendChart,
} from '@/components/home';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-500">
      <HeaderUser activeNav="home" />
      <main className="mx-auto w-full max-w-[1500px] px-6 pb-10 pt-[calc(var(--header-height)+20px)]">
        <MarketMetricStrip />

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
          <div className="space-y-5">
            <IndustryRanking />
            <SalesTrendChart />
            <DistrictStatusCard />
          </div>
          <aside className="space-y-5">
            <EventCalendar />
            <PropertyScoreCard />
            <RecentTransactionsCard />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
