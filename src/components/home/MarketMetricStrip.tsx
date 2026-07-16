const metrics = [
  {
    icon: '🏢',
    label: '상업용 부동산 지수',
    value: '2,847.3',
    delta: '▲ 12.4 (+0.44%)',
    deltaClass: 'text-[#e55757]',
  },
  {
    icon: '📊',
    label: '공실률 (서울 평균)',
    value: '8.2%',
    delta: '▼ 0.3%p',
    deltaClass: 'text-blue-600',
  },
  {
    icon: '💰',
    label: '평균 임대료 (㎡)',
    value: '42,800원',
    delta: '▲ 1,200원',
    deltaClass: 'text-[#e55757]',
  },
  {
    icon: '📈',
    label: 'Cap Rate (평균)',
    value: '4.8%',
    delta: '▲ 0.1%p',
    deltaClass: 'text-[#e55757]',
  },
  {
    icon: '🏦',
    label: '기준금리',
    value: '3.25%',
    delta: '동결',
    deltaClass: 'text-gray-46',
  },
  {
    icon: '↔️',
    label: '거래량 (이번달)',
    value: '1,284건',
    delta: '▲ 87건',
    deltaClass: 'text-[#e55757]',
  },
];

const MarketMetricStrip = () => {
  return (
    <section className="grid grid-cols-2 rounded-xl border border-[#e5e8eb] bg-white px-6 py-5 md:grid-cols-3 xl:grid-cols-6">
      {metrics.map((metric, index) => (
        <div
          key={metric.label}
          className={`px-4 ${index > 0 ? 'xl:border-l xl:border-[#e5e8eb]' : ''}`}
        >
          <div className="text-xs font-bold text-gray-46">
            {metric.icon} {metric.label}
          </div>
          <div className="mt-1 text-xl font-extrabold leading-none text-[#191f28]">
            {metric.value}
          </div>
          <div className={`mt-1 text-xs font-bold ${metric.deltaClass}`}>
            {metric.delta}
          </div>
        </div>
      ))}
    </section>
  );
};

export default MarketMetricStrip;
