import HeaderMLS from '@/components/layout/HeaderMLS';
import NewsFeed from '@/components/ui/NewsFeed';
import type { NewsItem } from '@/types/types';

const MlsPage = () => {
  const news: NewsItem[] = [
    {
      category: '시장뉴스',
      title: '서울 상업용 부동산 공실률 8.2%로 하락…2년 만에 최저',
      content:
        '주요 상권의 공실률이 8.2%로 떨어지며 2024년 이후 최저치를 기록했다. 강남·성수 상권을 중심으로 임차 수요가 회복되고 있다.',
      recentTime: '2시간 전',
      viewer: 2847,
    },
    {
      category: '정책/금리',
      title: '한국은행, 기준금리 3.25% 동결…상반기 인하 가능성 시사',
      content:
        '한국은행 금융통화위원회가 기준금리를 3.25%로 동결했다. 위원들은 하반기 경기 회복세에 따라 금리 인하를 검토할 수 있다고 밝혔다.',
      recentTime: '4시간 전',
      viewer: 5124,
    },
    {
      category: '상권뉴스',
      title: '한국은행, 기준금리 3.25% 동결…상반기 인하 가능성 시사',
      content:
        '한국은행 금융통화위원회가 기준금리를 3.25%로 동결했다. 위원들은 하반기 경기 회복세에 따라 금리 인하를 검토할 수 있다고 밝혔다.',
      recentTime: '4시간 전',
      viewer: 5124,
    },
    {
      category: '거래뉴스',
      title: '한국은행, 기준금리 3.25% 동결…상반기 인하 가능성 시사',
      content:
        '한국은행 금융통화위원회가 기준금리를 3.25%로 동결했다. 위원들은 하반기 경기 회복세에 따라 금리 인하를 검토할 수 있다고 밝혔다.',
      recentTime: '4시간 전',
      viewer: 5124,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-500 py-5 px-6 mt-(--header-height)">
      <HeaderMLS />
      {news.map((item, index) => (
        <NewsFeed key={index} {...item} />
      ))}
    </div>
  );
};

export default MlsPage;
