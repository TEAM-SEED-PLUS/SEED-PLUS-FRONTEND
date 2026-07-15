import iconProfile from '@/assets/landing/icon-profile.svg';

const reviews = [
  {
    name: '김나연',
    store: '강남 파스타 레스토랑',
    content: '막막했던 창업 계획을 구체적으로 잡을 수 있었어요.',
  },
  {
    name: '이수진',
    store: '강남 파스타 레스토랑',
    content:
      '계산기를 이용하여 정확한 수치를 알 수 있어서 정말 유용했습니다. 또한, 전문가들을 직접 매칭받을 수 있어서 도움되었습니다.',
  },
  {
    name: '최나린',
    store: '강남 파스타 레스토랑',
    content: 'AI 분석 결과가 정확해서 시장 파악과 창업에 큰 도움이 됐습니다.',
  },
];

const ReviewSection = () => {
  return (
    <section
      id="reviews"
      className="w-full scroll-mt-[88px] bg-[#fafbfc] py-30"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <h2 className="text-center text-[34px] font-bold text-[#191f28] md:text-[52px]">
          실제 사용자들의 이야기
        </h2>
        <p className="mt-3 text-center text-xl text-gray-46 md:text-[25px]">
          SEED+와 함께 성장한 사람들의 경험
        </p>
        <div className="mt-[70px] grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="min-h-[261px] rounded-[20px] bg-white p-10 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-3">
                <img src={iconProfile} alt="" className="size-[26px]" />
                <h4 className="text-[15px] font-bold text-[#191f28]">
                  {review.name}
                </h4>
              </div>
              <p className="pt-4 text-[15px] leading-relaxed text-[#191f28]">
                {review.content}
              </p>
              <p className="pt-3 text-xs text-[#191f28]">
                가게이름 : {review.store}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
