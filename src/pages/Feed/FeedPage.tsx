import { useState } from 'react';
import { CommunityFeed, FeedSidebar, FeedTabs } from '@/components/feed';
import { HeaderUser } from '@/components/layout';
import { useDocumentTitle } from '@/hooks';
import NewsFeed from '@/components/ui/NewsFeed';
import type { NewsItem } from '@/types/types';

// 뉴스는 아직 API가 없다. 값을 지어내지 않고 빈 목록으로 두고 빈 상태를 노출한다.
// TODO(BE): 뉴스 목록 엔드포인트 확정 시 연동.
const news: NewsItem[] = [];

const FeedPage = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'community'>('news');
  useDocumentTitle('창업 피드');

  return (
    <div className="min-h-screen bg-gray-500">
      <HeaderUser activeNav="feed" />
      <main className="mx-auto flex w-full max-w-[1500px] gap-6 px-6 pb-10 pt-[calc(var(--header-height)+24px)]">
        <section className="min-w-0 flex-1">
          <FeedTabs activeTab={activeTab} onChange={setActiveTab} />
          <div className="mt-5">
            {activeTab === 'news' ? (
              <div>
                {news.length > 0 ? (
                  news.map((item) => (
                    <NewsFeed
                      key={`${item.category}-${item.title}`}
                      {...item}
                    />
                  ))
                ) : (
                  <div className="rounded-lg border border-[#d8dde5] bg-white px-5 py-14 text-center text-sm font-medium text-gray-46">
                    아직 등록된 뉴스가 없습니다.
                  </div>
                )}
              </div>
            ) : (
              <CommunityFeed />
            )}
          </div>
        </section>
        <FeedSidebar />
      </main>
    </div>
  );
};

export default FeedPage;
