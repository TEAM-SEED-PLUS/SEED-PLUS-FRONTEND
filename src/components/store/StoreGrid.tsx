import StoreCard, { type StoreItem } from './StoreCard';

interface StoreGridProps {
  stores: StoreItem[];
  isLoading: boolean;
  errorMessage: string;
}

const StoreGrid = ({ stores, isLoading, errorMessage }: StoreGridProps) => {
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
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  );
};

export default StoreGrid;
