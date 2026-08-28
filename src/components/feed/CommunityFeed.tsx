import CommunityPostCard, { type CommunityPost } from './CommunityPostCard';
import { UsersIcon } from '@/components/ui/icons';

// 커뮤니티 글은 아직 API가 없다. 값을 지어내지 않고 빈 목록으로 두고 빈 상태를 노출한다.
// TODO(BE): 커뮤니티 글 목록 엔드포인트 확정 시 연동.
const posts: CommunityPost[] = [];

const categories = ['전체', '공동구매', '정보공유', '상권이벤트', '도움요청'];

const CommunityFeed = () => {
  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[#e5e8eb] bg-gradient-to-r from-[#eef5ff] to-[#f2fff8] px-6 py-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#191f28]">
          <UsersIcon className="h-5 w-5 text-blue-600" />
          지역 소상공인 커뮤니티
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

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <CommunityPostCard key={post.title} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[#d8dde5] bg-white px-5 py-14 text-center text-sm font-medium text-gray-46">
          아직 등록된 글이 없습니다.
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
