const transactions = [
  {
    name: '강남구 역삼동 근린상가',
    meta: '02.27 · Cap Rate 4.8%',
    price: '42억',
  },
  {
    name: '마포구 서교동 꼬마빌딩',
    meta: '02.26 · Cap Rate 5.1%',
    price: '28억',
  },
  {
    name: '성동구 성수동 상가',
    meta: '02.25 · Cap Rate 5.4%',
    price: '18억',
  },
  {
    name: '용산구 이태원동 상가',
    meta: '02.24 · Cap Rate 5.2%',
    price: '15억',
  },
];

const RecentTransactionsCard = () => {
  return (
    <section className="rounded-xl border border-[#e5e8eb] bg-white">
      <div className="flex items-center justify-between border-b border-[#e5e8eb] px-6 py-5">
        <h2 className="text-lg font-extrabold text-[#191f28]">
          🔄 최근 거래 현황
        </h2>
        <button type="button" className="text-sm font-bold text-blue-600">
          더보기 ›
        </button>
      </div>

      <div>
        {transactions.map((transaction) => (
          <button
            key={transaction.name}
            type="button"
            className="flex w-full items-center justify-between border-b border-[#e5e8eb] px-6 py-4 text-left last:border-b-0"
          >
            <span>
              <span className="block text-sm font-extrabold text-[#191f28]">
                {transaction.name}
              </span>
              <span className="mt-1 block text-sm font-bold text-gray-46">
                {transaction.meta}
              </span>
            </span>
            <span className="text-xl font-extrabold text-blue-600">
              {transaction.price}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default RecentTransactionsCard;
