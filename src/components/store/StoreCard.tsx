import { useState } from 'react';
import location from '@/assets/icons/location-icon.svg';
import ruler from '@/assets/icons/ruler-icon.svg';
import questionMark from '@/assets/icons/questionMark-icon.svg';
import trophy from '@/assets/icons/trophy-icon.svg';

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
  areaValue: number;
  expectedMonthlySalesValue: number;
  expectedProfitRateValue: number;
  depositValue: number;
  monthlyRentValue: number;
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
  const [isScoreExpanded, setIsScoreExpanded] = useState(false);
  const [isScoreInfoOpen, setIsScoreInfoOpen] = useState(false);

  return (
    <article className="overflow-hidden rounded-lg border border-[#fff4ee] bg-white">
      <div className="px-5 py-5">
        <div className="mb-5 flex items-center justify-between">
          <span className="flex gap-2 rounded-full bg-[#fff3e0] px-3 py-1 text-xs font-bold text-[#f36f28]">
            <img src={trophy} alt="트로피 아이콘" />{' '}
            <span>이달 랭킹 #{store.rank}</span>
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

      <div className="mx-5 mt-3">
        <div className="flex items-center justify-between rounded-md bg-blue-300 px-5 py-3 text-sm font-bold text-blue-600">
          <span className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsScoreExpanded((prev) => !prev)}
              aria-expanded={isScoreExpanded}
              className="flex items-center gap-2 transition hover:brightness-95"
            >
              🌱 SEEDing the Property Score
            </button>
            <button
              type="button"
              onClick={() => setIsScoreInfoOpen(true)}
              aria-label="Property Score 안내"
              className="flex items-center transition hover:opacity-70"
            >
              <img src={questionMark} alt="질문 아이콘" />
            </button>
          </span>
          <button
            type="button"
            onClick={() => setIsScoreExpanded((prev) => !prev)}
            aria-expanded={isScoreExpanded}
            className="text-xs font-bold transition hover:brightness-95"
          >
            {isScoreExpanded ? '접기' : '펼치기'}
          </button>
        </div>

        {isScoreExpanded && (
          <div className="mt-2 flex items-center justify-between rounded-md bg-blue-300 px-5 py-3 text-sm font-bold text-blue-600">
            <span className="flex gap-2">
              Property Score
              <img src={questionMark} alt="질문 아이콘" />
            </span>
            <span>{/*{store.score}*/}? 점</span>
          </div>
        )}
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

      {isScoreInfoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
          role="dialog"
          aria-modal="true"
          aria-label="Property Score 안내"
          onClick={() => setIsScoreInfoOpen(false)}
        >
          <div
            className="w-full max-w-[400px] rounded-lg bg-white px-6 py-6 shadow-[0_18px_60px_rgba(25,31,40,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-base font-extrabold text-[#191f28]">
              Property Score 안내
            </h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-[#4e5968]">
              Property Score은 우리 SEED+ 사용자분들에게 더 정확한 정보를
              제공하기 위해 지속적으로 고도화하고 있습니다. 추후 고도화가 완료가
              되면 기재하겠습니다. 앞으로의 SEED+를 기대해주세요!
            </p>
            <button
              type="button"
              onClick={() => setIsScoreInfoOpen(false)}
              className="mt-5 h-11 w-full rounded-md bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export default StoreCard;
