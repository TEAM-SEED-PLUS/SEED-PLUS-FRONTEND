const scores = [
  { label: 'Income Score (40%)', value: '72.4점', color: 'text-[#e55757]' },
  { label: 'Risk Score (40%)', value: '68.1점', color: 'text-[#f2992e]' },
  { label: 'Liquidity Score (20%)', value: '81.2점', color: 'text-[#e55757]' },
];

const PropertyScoreCard = () => {
  return (
    <section className="rounded-xl border border-[#e5e8eb] bg-white">
      <div className="flex items-center justify-between border-b border-[#e5e8eb] px-6 py-5">
        <h2 className="text-lg font-extrabold text-[#191f28]">
          🏆 Property Score 분포
        </h2>
        <span className="text-xs font-bold text-gray-46">서울 전체 기준</span>
      </div>
      <div className="space-y-4 px-6 py-5">
        {scores.map((score) => (
          <div
            key={score.label}
            className="flex items-center justify-between text-sm font-bold"
          >
            <span className="text-[#191f28]">{score.label}</span>
            <span className={score.color}>{score.value}</span>
          </div>
        ))}
        <div className="rounded-lg bg-blue-300 py-5 text-center">
          <div className="text-xs font-bold text-gray-46">
            종합 Property Score
          </div>
          <div className="text-3xl font-extrabold text-blue-600">72.8점</div>
          <div className="text-xs font-bold text-gray-46">
            상위 28% · B+ 등급
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyScoreCard;
