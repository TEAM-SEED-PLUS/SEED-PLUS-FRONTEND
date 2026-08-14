import StoreCard, { type StoreItem } from './StoreCard';

interface StoreGridProps {
  stores: StoreItem[];
  isLoading: boolean;
  errorMessage: string;
  pendingBookmarkIds: number[];
  onToggleBookmark: (store: StoreItem) => void;
  pendingLikeIds: number[];
  onToggleLike: (store: StoreItem) => void;
  /** 최신화 시각 표기 여부 (마이페이지 저장 목록에서만 사용) */
  showUpdatedAt?: boolean;
}

const StoreGrid = ({
  stores,
  isLoading,
  errorMessage,
  pendingBookmarkIds,
  onToggleBookmark,
  pendingLikeIds,
  onToggleLike,
  showUpdatedAt = false,
}: StoreGridProps) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#d8dde5] bg-white px-5 py-14 text-center text-sm font-medium text-gray-46">
        상가 목록을 불러오고 있습니다.
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-lg border border-[#d8dde5] bg-white px-5 py-14 text-center text-sm font-medium text-[#e5484d]">
        {errorMessage}
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="rounded-lg border border-[#d8dde5] bg-white px-5 py-14 text-center text-sm font-medium text-gray-46">
        조건에 맞는 상가가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          isBookmarkPending={pendingBookmarkIds.includes(store.id)}
          onToggleBookmark={onToggleBookmark}
          isLikePending={pendingLikeIds.includes(store.id)}
          onToggleLike={onToggleLike}
          showUpdatedAt={showUpdatedAt}
        />
      ))}
    </div>
  );
};

export default StoreGrid;
