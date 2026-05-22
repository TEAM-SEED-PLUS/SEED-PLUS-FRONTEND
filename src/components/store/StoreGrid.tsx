import StoreCard, { type StoreItem } from './StoreCard';

const stores: StoreItem[] = [
  {
    name: '강남 파스타 레스토랑',
    category: '음식점',
    district: '강남구 역삼동',
    area: '65m²',
    sales: '4,600만원',
    profit: '20%',
    payback: '22개월',
    rank: 1,
    score: 96,
    likes: 14,
    comments: 34,
    reposts: 3,
    saved: true,
  },
  {
    name: '성수 카페',
    category: '카페/음료',
    district: '강남구 역삼동',
    area: '65m²',
    sales: '4,600만원',
    profit: '20%',
    payback: '22개월',
    rank: 1,
    score: 96,
    likes: 14,
    comments: 34,
    reposts: 3,
    saved: true,
  },
  {
    name: '홍대 네일아트샵',
    category: '미용/뷰티',
    district: '강남구 역삼동',
    area: '65m²',
    sales: '4,600만원',
    profit: '20%',
    payback: '22개월',
    rank: 1,
    score: 96,
    likes: 14,
    comments: 34,
    reposts: 3,
    saved: true,
  },
  {
    name: '강남 파스타 레스토랑',
    category: '음식점',
    district: '강남구 역삼동',
    area: '65m²',
    sales: '4,600만원',
    profit: '20%',
    payback: '22개월',
    rank: 1,
    score: 96,
    likes: 14,
    comments: 34,
    reposts: 3,
  },
  {
    name: '성수 카페',
    category: '카페/음료',
    district: '강남구 역삼동',
    area: '65m²',
    sales: '4,600만원',
    profit: '20%',
    payback: '22개월',
    rank: 1,
    score: 96,
    likes: 14,
    comments: 34,
    reposts: 3,
  },
  {
    name: '홍대 네일아트샵',
    category: '미용/뷰티',
    district: '강남구 역삼동',
    area: '65m²',
    sales: '4,600만원',
    profit: '20%',
    payback: '22개월',
    rank: 1,
    score: 96,
    likes: 14,
    comments: 34,
    reposts: 3,
  },
];

const StoreGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      {stores.map((store, index) => (
        <StoreCard key={`${store.name}-${index}`} store={store} />
      ))}
    </div>
  );
};

export default StoreGrid;
