import StoreCard, { type StoreItem } from './StoreCard';

const stores: StoreItem[] = [
  {
    name: '강남 파스타 레스토랑',
    category: '음식점',
    district: '강남구 역삼동',
    area: '65m²',
    sales: '5,240만원',
    profit: '19.2%',
    payback: '22개월',
    rank: 1,
    score: 84,
    likes: 127,
    badge: 'restaurant',
  },
  {
    name: '성수 스페셜티 카페',
    category: '카페/음료',
    district: '성동구 성수동',
    area: '42m²',
    sales: '3,180만원',
    profit: '24.8%',
    payback: '18개월',
    rank: 2,
    score: 91,
    likes: 203,
    badge: 'cafe',
  },
  {
    name: '홍대 네일아트샵',
    category: '미용/뷰티',
    district: '마포구 서교동',
    area: '28m²',
    sales: '1,920만원',
    profit: '31.4%',
    payback: '14개월',
    rank: 3,
    score: 88,
    likes: 89,
    badge: 'beauty',
  },
  {
    name: '이태원 버거 전문점',
    category: '음식점',
    district: '용산구 이태원동',
    area: '55m²',
    sales: '4,120만원',
    profit: '16.7%',
    payback: '28개월',
    rank: 4,
    score: 76,
    likes: 54,
    badge: 'burger',
  },
  {
    name: '종로 한식 도시락',
    category: '음식점',
    district: '종로구 관철동',
    area: '38m²',
    sales: '2,840만원',
    profit: '22.1%',
    payback: '20개월',
    rank: 5,
    score: 79,
    likes: 71,
    badge: 'lunch',
  },
  {
    name: '강남 프리미엄 헬스장',
    category: '헬스/스포츠',
    district: '강남구 청담동',
    area: '180m²',
    sales: '6,800만원',
    profit: '28.4%',
    payback: '32개월',
    rank: 6,
    score: 82,
    likes: 96,
    badge: 'health',
  },
];

const StoreGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      {stores.map((store) => (
        <StoreCard key={store.name} store={store} />
      ))}
    </div>
  );
};

export default StoreGrid;
