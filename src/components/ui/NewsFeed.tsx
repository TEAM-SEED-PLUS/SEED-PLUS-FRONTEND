import type { NewsItem } from '@/types/types';
import { ClockIcon, EyeIcon } from './icons';

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
    <article className="mb-3 w-full cursor-pointer rounded-xl border border-solid border-[#e5e8eb] bg-white px-5 py-4 transition-shadow hover:shadow-sm">
      <span
        className={`${styles.bg} ${styles.text} mb-2 inline-block rounded-sm px-2 py-0.5 text-[11px] font-semibold`}
      >
        {news.category}
      </span>
      <div className="mb-1.5 text-sm font-bold">{news.title}</div>
      <div className="text-xs text-gray-46">{news.content}</div>
      <div className="mt-2.5 flex gap-3 text-[11px] text-[#b0b8c1]">
        <div className="flex items-center gap-1">
          <ClockIcon className="h-3.5 w-3.5" />
          {news.recentTime}
        </div>
        <div className="flex items-center gap-1">
          <EyeIcon className="h-3.5 w-3.5" />
          {news.viewer.toLocaleString()}명
        </div>
      </div>
    </article>
  );
};

export default NewsFeed;
