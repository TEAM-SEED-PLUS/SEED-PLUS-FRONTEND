const industries = [
  {
    rank: 1,
    name: '카페/음료',
    sales: '3,240만원',
    growth: '+8.4%',
    traffic: '12.4만',
    cost: '28.2%',
    color: '#50c878',
    points: '8 22 18 30 26 38 34 46 42 54',
  },
  {
    rank: 2,
    name: '음식점',
    sales: '4,820만원',
    growth: '+5.2%',
    traffic: '18.7만',
    cost: '34.1%',
    color: '#5b82f6',
    points: '8 18 14 26 36 32 43',
  },
  {
    rank: 3,
    name: '미용/뷰티',
    sales: '2,180만원',
    growth: '+3.8%',
    traffic: '8.2만',
    cost: '22.4%',
    color: '#8f3fb8',
    points: '8 15 19 25 32 38',
  },
  {
    rank: 4,
    name: '헬스/스포츠',
    sales: '3,560만원',
    growth: '+2.1%',
    traffic: '6.8만',
    cost: '18.7%',
    color: '#f2992e',
    points: '8 17 13 26 22 31',
  },
  {
    rank: 5,
    name: '소매/판매',
    sales: '2,940만원',
    growth: '-1.2%',
    traffic: '15.3만',
    cost: '42.8%',
    color: '#e55757',
    points: '8 11 16 20 23 28',
  },
  {
    rank: 6,
    name: '교육/학원',
    sales: '2,650만원',
    growth: '-0.8%',
    traffic: '4.1만',
    cost: '15.2%',
    color: '#6b7684',
    points: '8 18 13 24 29 23 31',
  },
  {
    rank: 7,
    name: '생활서비스',
    sales: '1,820만원',
    growth: '-2.4%',
    traffic: '9.6만',
    cost: '25.6%',
    color: '#6d4c41',
    points: '8 12 18 22 27 31',
  },
];

const rankColor = (rank: number) => {
  if (rank === 1) return 'bg-[#f8d943] text-[#191f28]';
  if (rank === 2) return 'bg-[#d2d6da] text-[#4e5968]';
  if (rank === 3) return 'bg-[#d08b3e] text-white';
  return 'bg-gray-500 text-gray-46';
};

const IndustryRanking = () => {
  return (
    <section className="overflow-hidden rounded-xl border border-[#e5e8eb] bg-white">
      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <h2 className="text-lg font-extrabold text-[#191f28]">
            📊 업종별 매출 등락 순위
          </h2>
          <p className="mt-1 text-xs text-gray-46">
            실시간 · 유동인구 · 매출 · 원가 통합 데이터
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <button className="rounded-md border border-[#e5e8eb] px-3 py-2 font-medium">
            전체 지역⌄
          </button>
          <button className="font-bold text-blue-600">더보기 ›</button>
        </div>
      </div>

      <div className="grid grid-cols-[48px_1.2fr_1fr_1fr_1fr_1fr_1.2fr] border-y border-[#e5e8eb] bg-gray-500 px-4 py-3 text-xs font-bold text-gray-46">
        <div>순위</div>
        <div>업종</div>
        <div>평균 매출</div>
        <div>등락률</div>
        <div>유동인구</div>
        <div>원가율</div>
        <div>추이</div>
      </div>

      {industries.map((industry) => (
        <div
          key={industry.name}
          className="grid grid-cols-[48px_1.2fr_1fr_1fr_1fr_1fr_1.2fr] items-center border-b border-[#edf0f2] px-4 py-4 text-sm last:border-b-0"
        >
          <div>
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold ${rankColor(
                industry.rank
              )}`}
            >
              {industry.rank}
            </span>
          </div>
          <div className="font-extrabold text-[#191f28]">{industry.name}</div>
          <div className="font-extrabold text-[#191f28]">{industry.sales}</div>
          <div
            className={`font-extrabold ${
              industry.growth.startsWith('+')
                ? 'text-[#e55757]'
                : 'text-blue-600'
            }`}
          >
            {industry.growth}
          </div>
          <div className="font-bold text-[#191f28]">{industry.traffic}</div>
          <div className="font-bold text-[#191f28]">{industry.cost}</div>
          <svg viewBox="0 0 64 40" className="h-9 w-24">
            <polyline
              points={industry.points}
              fill="none"
              stroke={industry.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      ))}
    </section>
  );
};

export default IndustryRanking;
