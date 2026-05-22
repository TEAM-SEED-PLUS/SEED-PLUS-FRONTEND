const districts = [
  {
    name: '강남 상권',
    change: '+2.4%',
    traffic: '유동인구 ↑ 12만명/일',
    color: 'border-l-blue-600',
    positive: true,
  },
  {
    name: '성수 상권',
    change: '+5.8%',
    traffic: '유동인구 ↑ 8.2만명/일',
    color: 'border-l-[#50c878]',
    positive: true,
  },
  {
    name: '홍대 상권',
    change: '+1.2%',
    traffic: '유동인구 → 15만명/일',
    color: 'border-l-[#f2992e]',
    positive: true,
  },
  {
    name: '명동 상권',
    change: '-0.8%',
    traffic: '유동인구 ↓ 9.1만명/일',
    color: 'border-l-[#e55757]',
    positive: false,
  },
  {
    name: '이태원 상권',
    change: '+3.1%',
    traffic: '유동인구 ↑ 6.4만명/일',
    color: 'border-l-[#8f3fb8]',
    positive: true,
  },
  {
    name: '종로 상권',
    change: '-1.4%',
    traffic: '유동인구 ↓ 7.8만명/일',
    color: 'border-l-[#42b7d4]',
    positive: false,
  },
];

const DistrictStatusCard = () => {
  return (
    <section className="rounded-xl border border-[#e5e8eb] bg-white">
      <div className="flex items-center justify-between border-b border-[#e5e8eb] px-6 py-5">
        <h2 className="text-lg font-extrabold text-[#191f28]">
          🗺️ 주요 상권 현황
        </h2>
        <button type="button" className="text-sm font-bold text-blue-600">
          전체 보기 ›
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
        {districts.map((district) => (
          <article
            key={district.name}
            className={`rounded-lg border-l-4 bg-gray-500 px-5 py-4 ${district.color}`}
          >
            <div className="text-sm font-bold text-gray-46">
              {district.name}
            </div>
            <div
              className={`mt-2 text-2xl font-extrabold ${
                district.positive ? 'text-[#e55757]' : 'text-blue-600'
              }`}
            >
              {district.change}
            </div>
            <div className="mt-1 text-sm font-bold text-gray-46">
              {district.traffic}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DistrictStatusCard;
