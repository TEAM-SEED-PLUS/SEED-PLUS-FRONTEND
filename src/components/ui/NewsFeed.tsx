import type { NewsItem } from '@/types/types';

const NewsFeed = (news: NewsItem) => {
  const categoryStyles: Record<string, { bg: string; text: string }> = {
    시장뉴스: { bg: 'bg-blue-300', text: 'text-blue-600' },
    '정책/금리': { bg: 'bg-[#fce8ff]', text: 'text-[#9c27b0]' },
    상권뉴스: { bg: 'bg-[#e8fff3]', text: 'text-[#05c072]' },
    거래뉴스: { bg: 'bg-[#fff3e0]', text: 'text-[#ff9500]' },
  };

  const styles = categoryStyles[news.category] || {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
  };

  return (
    <div className="w-full h-32 px-5 py-4 bg-white rounded-xl mb-3 cursor-pointer border border-solid border-[#e5e8eb] transition-shadow">
      <span
        className={`${styles.bg} ${styles.text} mb-2 py-0.5 px-2 rounded-sm text-[11px] font-semibold`}
      >
        {news.category}
      </span>
      <div className="text-sm font-bold mb-1.5">{news.title}</div>
      <div className="text-xs text-gray-46">{news.content}</div>
      <div className="flex mt-2.5 gap-3 text-[11px] text-[#b0b8c1]">
        <div>🕛 {news.recentTime}</div>
        <div>👁️‍🗨️ {news.viewer.toLocaleString()}명</div>
      </div>
    </div>
  );
};

export default NewsFeed;
