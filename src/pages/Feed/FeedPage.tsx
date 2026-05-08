import { useState } from 'react';
import { CommunityFeed, FeedSidebar, FeedTabs } from '@/components/feed';
import { HeaderUser } from '@/components/layout';
import NewsFeed from '@/components/ui/NewsFeed';
import type { NewsItem } from '@/types/types';

const news: NewsItem[] = [
  {
    category: '시장뉴스',
    title: '서울 상업용 부동산 공실률 8.2%로 하락',
    content:
      '주요 상권의 공실률이 낮아지며 임차 수요가 회복되고 있습니다. 강남, 성수, 홍대 상권을 중심으로 신규 점포 문의가 늘고 있습니다.',
    recentTime: '2시간 전',
    viewer: 2847,
  },
  {
    category: '정책/금리',
    title: '한국은행 기준금리 3.25% 동결',
    content:
      '금융통화위원회가 기준금리를 동결했습니다. 하반기 경기 흐름에 따라 추가 인하 가능성을 검토할 수 있다는 전망도 나옵니다.',
    recentTime: '4시간 전',
    viewer: 5124,
  },
  {
    category: '상권뉴스',
    title: '성수동 주말 유동인구 전월 대비 12% 증가',
    content:
      '팝업스토어와 브랜드 행사가 이어지며 성수동 카페거리와 연무장길 주변 상권 방문량이 크게 늘었습니다.',
    recentTime: '5시간 전',
    viewer: 3912,
  },
  {
    category: '거래뉴스',
    title: '마포구 소형 점포 권리금 문의 증가',
    content:
      '홍대입구역 인근 소형 점포를 중심으로 창업 문의가 늘고 있으며, 음식점과 디저트 업종 수요가 두드러지고 있습니다.',
    recentTime: '어제',
    viewer: 1860,
  },
];

const FeedPage = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'community'>('news');

  return (
    <div className="min-h-screen bg-gray-500">
      <HeaderUser activeNav="feed" />
      <main className="mx-auto flex w-full max-w-[1500px] gap-6 px-6 pb-10 pt-[calc(var(--header-height)+24px)]">
        <section className="min-w-0 flex-1">
          <FeedTabs activeTab={activeTab} onChange={setActiveTab} />
          <div className="mt-5">
            {activeTab === 'news' ? (
              <div>
                {news.map((item) => (
                  <NewsFeed key={`${item.category}-${item.title}`} {...item} />
                ))}
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
