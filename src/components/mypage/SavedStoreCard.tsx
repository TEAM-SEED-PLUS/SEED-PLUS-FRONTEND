import location from '@/assets/icons/location-icon.svg';
import ruler from '@/assets/icons/ruler-icon.svg';
import questionMark from '@/assets/icons/questionMark-icon.svg';
import trophy from '@/assets/icons/trophy-icon.svg';

export interface SavedStore {
  id: number;
  rank: number;
  name: string;
  category: string;
  district: string;
  area: string;
  sales: string;
  payback: string;
  profit: string;
  score: number;
  likes: number;
  comments: number;
  shares: number;
}

interface SavedStoreCardProps {
  store: SavedStore;
  onDelete?: (store: SavedStore) => void;
}

const SavedStoreCard = ({ store, onDelete }: SavedStoreCardProps) => {
  return (
    <article className="overflow-hidden rounded-lg border border-[#eef1f5] bg-white">
      <div className="px-5 py-5">
        <div className="mb-5 flex items-center justify-between">
          <span className="flex gap-2 rounded-full bg-[#fff3e0] px-3 py-1 text-xs font-bold text-[#f36f28]">
            <img src={trophy} alt="트로피 아이콘" />
            <span>이달 랭킹 #{store.rank}</span>
          </span>
          <span
            className="flex h-6 w-6 items-center justify-center"
            aria-label="저장됨"
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
                fill="#3182F6"
                stroke="#3182F6"
                strokeWidth="1.5"
              />
            </svg>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <h3 className="text-base font-extrabold text-[#191f28]">
            {store.name}
          </h3>
          <span className="text-xs font-bold text-gray-46">
            {store.category}
          </span>
        </div>

        <div className="mt-5 flex gap-7 text-xs font-medium text-gray-46">
          <span className="flex gap-2">
            <img src={location} alt="위치 아이콘" /> {store.district}
          </span>
          <span className="flex gap-2">
            <img src={ruler} alt="면적 아이콘" />
            {store.area}
          </span>
        </div>
      </div>

      <div className="mx-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-gray-500 px-2 py-2">
          <div className="text-xs font-bold text-gray-46">예상 월매출</div>
          <div className="mt-1 whitespace-nowrap text-base font-extrabold text-blue-600">
            {store.sales}
          </div>
        </div>
        <div className="rounded-md bg-gray-500 px-2 py-2">
          <div className="text-xs font-bold text-gray-46">투자회수</div>
          <div className="mt-1 whitespace-nowrap text-base font-extrabold text-[#191f28]">
            {store.payback}
          </div>
        </div>
        <div className="rounded-md bg-gray-500 px-2 py-2">
          <div className="text-xs font-bold text-gray-46">순이익률</div>
          <div className="mt-1 whitespace-nowrap text-base font-extrabold text-[#d91c1c]">
            {store.profit}
          </div>
        </div>
      </div>

      <div className="mx-5 mt-3 flex items-center justify-between rounded-md bg-blue-300 px-5 py-3 text-sm font-bold text-blue-600">
        <span className="flex gap-2">
          Property Score
          <img src={questionMark} alt="질문 아이콘" />
        </span>
        <span>{store.score}점</span>
      </div>

      <div className="flex items-center justify-between px-5 py-4 text-sm font-medium text-[#4e5968]">
        <div className="flex gap-5">
          <span className="flex items-center gap-1">
            <span className="text-lg leading-none text-[#e5484d]">♥</span>
            {store.likes}
          </span>
          <span className="flex items-center gap-1">💬 {store.comments}</span>
          <span className="flex items-center gap-1">📤 {store.shares}</span>
        </div>
        <button
          type="button"
          onClick={() => onDelete?.(store)}
          aria-label="저장 목록에서 삭제"
          className="flex h-6 w-6 items-center justify-center text-gray-46 transition hover:text-[#e5484d]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M6 6l1 14h10l1-14" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </article>
  );
};

export default SavedStoreCard;
