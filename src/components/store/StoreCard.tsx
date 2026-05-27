export interface StoreItem {
  id: number;
  name: string;
  category: string;
  district: string;
  area: string;
  sales: string;
  profit: string;
  payback: string;
  rank: number;
  score: number;
  likes: number;
  reposts: number;
  saved?: boolean;
  liked?: boolean;
}

interface StoreCardProps {
  store: StoreItem;
  isBookmarkPending: boolean;
  onToggleBookmark: (store: StoreItem) => void;
  isLikePending: boolean;
  onToggleLike: (store: StoreItem) => void;
}

const StoreCard = ({
  store,
  isBookmarkPending,
  onToggleBookmark,
  isLikePending,
  onToggleLike,
}: StoreCardProps) => {
  return (
    <article className="overflow-hidden rounded-lg border border-[#d8dde5] bg-white">
      <div className="px-5 py-5">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-full bg-[#fff3e0] px-3 py-1 text-xs font-bold text-[#f2992e]">
            🏆 이달 랭킹 #{store.rank}
          </span>
          <button
            type="button"
            onClick={() => onToggleBookmark(store)}
            disabled={isBookmarkPending}
            className="flex h-6 w-6 items-center justify-center disabled:opacity-50"
            aria-label={store.saved ? '북마크 해제' : '북마크 추가'}
            aria-pressed={store.saved ?? false}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 4V19.1683C5 19.9595 5.87525 20.4373 6.54076 20.0095L11.4592 16.8476C11.7887 16.6359 12.2113 16.6359 12.5408 16.8476L17.4592 20.0095C18.1248 20.4373 19 19.9595 19 19.1683V4C19 3.44772 18.5523 3 18 3H6C5.44772 3 5 3.44772 5 4Z"
                fill={store.saved ? '#3182F6' : 'none'}
                stroke={store.saved ? '#3182F6' : '#8b95a1'}
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <h2 className="text-base font-extrabold text-[#191f28]">
            {store.name}
          </h2>
          <span className="text-xs font-bold text-gray-46">
            {store.category}
          </span>
        </div>

        <div className="mt-5 flex gap-7 text-xs font-medium text-gray-46">
          <span>⌖ {store.district}</span>
          <span>▱ {store.area}</span>
        </div>
      </div>

      <div className="mx-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-gray-500 px-2 py-2">
          <div className="text-xs font-bold text-gray-46">예상 월매출</div>
          <div className="mt-1 text-lg font-extrabold text-blue-600">
            {store.sales}
          </div>
        </div>
        <div className="rounded-md bg-gray-500 px-2 py-2">
          <div className="text-xs font-bold text-gray-46">투자회수</div>
          <div className="mt-1 text-lg font-extrabold text-[#191f28]">
            {store.payback}
          </div>
        </div>
        <div className="rounded-md bg-gray-500 px-2 py-2">
          <div className="text-xs font-bold text-gray-46">순이익률</div>
          <div className="mt-1 text-lg font-extrabold text-[#d91c1c]">
            {store.profit}
          </div>
        </div>
      </div>

      <div className="mx-5 mt-3 flex items-center justify-between rounded-md bg-blue-300 px-5 py-3 text-sm font-bold text-blue-600">
        <span>Property Score ⓘ</span>
        <span>{store.score}점</span>
      </div>

      <div className="flex gap-5 px-5 py-4 text-sm font-medium text-[#4e5968]">
        <button
          type="button"
          onClick={() => onToggleLike(store)}
          disabled={isLikePending}
          aria-label={store.liked ? '좋아요 취소' : '좋아요'}
          aria-pressed={store.liked ?? false}
          className={`transition disabled:opacity-50 ${
            store.liked ? 'font-bold text-[#e5484d]' : 'hover:text-[#e5484d]'
          }`}
        >
          <span className="mr-1 text-xl leading-none">
            {store.liked ? '♥' : '♡'}
          </span>
          {store.likes}
        </button>
        {store.reposts > 0 && <span>↻ {store.reposts}</span>}
      </div>
    </article>
  );
};

export default StoreCard;
