export interface StoreItem {
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
  badge: string;
}

interface StoreCardProps {
  store: StoreItem;
}

const StoreCard = ({ store }: StoreCardProps) => {
  return (
    <article className="overflow-hidden rounded-xl border border-[#e5e8eb] bg-white">
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-extrabold text-[#191f28]">
            {store.name}
          </h2>
          <span className="rounded-lg bg-blue-300 px-3 py-1 text-sm font-extrabold text-blue-600">
            ⭐ {store.score}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-gray-46">
          <span className="rounded-md bg-gray-500 px-2.5 py-1">
            🏪 {store.category}
          </span>
          <span className="rounded-md bg-gray-500 px-2.5 py-1">
            📍 {store.district}
          </span>
          <span className="rounded-md bg-gray-500 px-2.5 py-1">
            📐 {store.area}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 border-y border-[#e5e8eb] px-5 py-4 text-center">
        <div>
          <div className="text-xs font-bold text-gray-46">예상 월매출</div>
          <div className="mt-1 text-lg font-extrabold text-[#e55757]">
            {store.sales}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-46">순이익률</div>
          <div className="mt-1 text-lg font-extrabold text-[#e55757]">
            {store.profit}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-46">투자회수</div>
          <div className="mt-1 text-lg font-extrabold text-[#191f28]">
            {store.payback}
          </div>
        </div>
      </div>

      <div className="px-5 py-3 text-sm font-bold text-gray-46">
        이달 랭킹 <span className="text-blue-600">#{store.rank}</span> ·
        Property Score <span className="text-blue-600">{store.score}점</span>
      </div>

      <div className="flex items-center justify-between border-t border-[#e5e8eb] px-5 py-3 text-sm font-bold text-gray-46">
        <div className="flex gap-5">
          <span>🤍 {store.likes}</span>
          <button type="button">💬 댓글</button>
        </div>
        <button
          type="button"
          className="rounded-full border border-[#e5e8eb] px-4 py-2 text-blue-600"
        >
          🔁 리포스트
        </button>
      </div>
    </article>
  );
};

export default StoreCard;
