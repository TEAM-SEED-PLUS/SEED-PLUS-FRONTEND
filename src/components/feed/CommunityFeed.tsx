import CommunityPostCard, { type CommunityPost } from './CommunityPostCard';

const posts: CommunityPost[] = [
  {
    author: '홍대 파스타 A',
    initial: '홍',
    district: '마포구 서교동',
    title: '홍대 파스타 A',
    content:
      '안녕하세요! 저희 가게 근처 식자재 공동구매 참여하실 분 계신가요? 최소 5개 점포 모이면 30% 할인 가능합니다. 주로 파스타 면류, 올리브오일, 토마토소스 등입니다. 관심 있으신 분은 댓글 달아주세요 🍝',
    tags: ['공동구매', '식자재', '마포구', '파스타'],
    likes: 24,
    comments: 8,
    saves: 3,
    colorClass: 'bg-blue-600',
  },
  {
    author: '성수 카페 B',
    initial: '성',
    district: '성동구 성수동',
    title: '성수 카페 B',
    content:
      '성수동 팝업스토어 시즌 정보 공유드립니다. 3월에 대형 패션 브랜드 팝업이 3개 예정되어 있어요. 주말 유동인구 최소 20% 이상 증가 예상됩니다. 미리 재고 준비하시고 인력 배치 계획 세우세요!',
    tags: ['성수동', '팝업스토어', '유동인구', '정보공유'],
    likes: 67,
    comments: 15,
    saves: 12,
    colorClass: 'bg-[#50c878]',
  },
  {
    author: '강남 편의점 C',
    initial: '강',
    district: '강남구 역삼동',
    title: '강남 편의점 C',
    content:
      '우리 블록 상인회에서 3월 봄맞이 이벤트 기획 중입니다. 스탬프 투어 형식으로 고객들이 여러 점포를 방문하게 하는 방식인데요, 참여 의향 있으신 분들 연락주세요. 비용은 n분의 1로 나눌 예정입니다 🌸',
    tags: ['상권이벤트', '강남', '스탬프투어', '협업'],
    likes: 43,
    comments: 19,
    saves: 7,
    colorClass: 'bg-[#f2992e]',
  },
];

const categories = [
  '전체',
  '🛒 공동구매',
  '💡 정보공유',
  '🎉 상권이벤트',
  '🆘 도움요청',
];

const CommunityFeed = () => {
  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[#e5e8eb] bg-gradient-to-r from-[#eef5ff] to-[#f2fff8] px-6 py-5">
        <h2 className="text-lg font-bold text-[#191f28]">
          🤝 지역 소상공인 커뮤니티
        </h2>
        <p className="mt-2 text-sm text-gray-46">
          같은 지역 점포주들과 원재료 공동구매, 정보 공유, 상권 활성화를 함께
          만들어가세요
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        {categories.map((category, index) => (
          <button
            key={category}
            type="button"
            className={`rounded-full border px-5 py-2.5 text-sm font-bold ${
              index === 0
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-[#e5e8eb] bg-white text-gray-46'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <CommunityPostCard key={post.title} post={post} />
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;
