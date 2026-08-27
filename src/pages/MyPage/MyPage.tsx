import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth';
import { HeaderUser } from '@/components/layout';
import {
  ActivityPostCard,
  CategoryTabs,
  ProfileSummaryCard,
} from '@/components/mypage';
import type { ActivityPost } from '@/components/mypage';
import { StoreGrid } from '@/components/store';
import type { StoreItem } from '@/components/store';
import useSavedStores from './useSavedStores';

const categories = [
  '내가 설정한 카테고리 이름 1',
  '내가 설정한 카테고리 이름 2',
  '내가 설정한 카테고리 이름 3',
];

const activityPosts: ActivityPost[] = [
  {
    id: 1,
    initial: '홍',
    colorClass: 'bg-blue-600',
    title: '홍대 파스타 A',
    district: '마포구 서교동',
    content:
      '안녕하세요! 저희 가게 근처 식자재 공동구매 참여하실 분 계신가요? 최소 5개 점포 모이면 30% 할인 가능합니다. 주로 파스타 면류, 올리브오일, 토마토소스 등입니다. 관심 있으신 분은 댓글 달아주세요 😊',
    tags: ['공동구매', '식자재', '파스타'],
    comments: 24,
    likes: 11,
    views: 3,
  },
  {
    id: 2,
    initial: '홍',
    colorClass: 'bg-[#f36f28]',
    title: '홍대 파스타 A',
    district: '마포구 서교동',
    content:
      '안녕하세요! 저희 가게 근처 식자재 공동구매 참여하실 분 계신가요? 최소 5개 점포 모이면 30% 할인 가능합니다. 주로 파스타 면류, 올리브오일, 토마토소스 등입니다. 관심 있으신 분은 댓글 달아주세요 😊',
    tags: ['공동구매', '식자재', '파스타'],
    comments: 24,
    likes: 11,
    views: 3,
  },
];

type MobileView = 'overview' | 'saved' | 'posts';

const SectionHeading = ({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <div className="mb-5 flex items-end justify-between gap-4">
    <div>
      <h2 className="text-2xl font-extrabold text-[#191f28]">{title}</h2>
      <p className="mt-1 text-sm font-medium text-gray-46">{description}</p>
    </div>
    {actionLabel && (
      <button
        type="button"
        onClick={onAction}
        className="shrink-0 text-sm font-bold text-blue-600"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

const MyPage = () => {
  const navigate = useNavigate();
  const { user, status, isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState(0);
  const [mobileView, setMobileView] = useState<MobileView>('overview');
  const {
    stores: savedStores,
    isLoading: isSavedLoading,
    errorMessage: savedError,
    pendingBookmarkIds,
    pendingLikeIds,
    toggleBookmark,
    toggleLike,
  } = useSavedStores(isAuthenticated);

  const renderSavedStores = (stores: StoreItem[]) => (
    <StoreGrid
      stores={stores}
      isLoading={isSavedLoading}
      errorMessage={savedError}
      pendingBookmarkIds={pendingBookmarkIds}
      onToggleBookmark={toggleBookmark}
      pendingLikeIds={pendingLikeIds}
      onToggleLike={toggleLike}
      showUpdatedAt
    />
  );

  useEffect(() => {
    document.title = '마이페이지 | SEED+';
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-500 text-sm font-medium text-gray-46">
        인증 상태를 확인하고 있습니다.
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const name = user?.name ?? '회원';
  const initial = name.charAt(0);

  const profileCard = (className?: string) => (
    <ProfileSummaryCard
      name={name}
      initial={initial}
      savedCount={12}
      postCount={4}
      activityScore={96}
      className={className}
      onSettingsClick={() => navigate('/mypage/settings')}
    />
  );

  return (
    <div className="min-h-screen bg-gray-500">
      <HeaderUser />

      {/* Desktop */}
      <main className="mx-auto hidden min-h-[calc(100vh-var(--header-height))] max-w-[1500px] gap-6 px-8 pb-12 pt-[calc(var(--header-height)+32px)] lg:flex">
        <div className="min-w-0 flex-1">
          <section>
            <SectionHeading
              title="저장한 상가 리스트"
              description="관심 있는 상가를 카테고리별로 관리해보세요."
            />
            <CategoryTabs
              categories={categories}
              activeIndex={activeCategory}
              onSelect={setActiveCategory}
            />
            <div className="mt-5">{renderSavedStores(savedStores)}</div>
          </section>

          <section className="mt-12">
            <SectionHeading
              title="소통 활동 내역"
              description="내가 쓴 글을 확인해보세요."
            />
            <div className="space-y-4">
              {activityPosts.map((post) => (
                <ActivityPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        </div>

        <aside className="flex w-[330px] shrink-0 flex-col gap-5 self-stretch">
          {profileCard()}
        </aside>
      </main>

      {/* Mobile */}
      <main className="px-5 pb-12 pt-[calc(var(--header-height)+20px)] lg:hidden">
        {profileCard('mb-6')}

        {mobileView === 'saved' ? (
          <section>
            <div className="mb-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileView('overview')}
                aria-label="뒤로"
                className="text-xl font-bold text-gray-46"
              >
                ‹
              </button>
              <h2 className="text-xl font-extrabold text-[#191f28]">
                저장된 상가 리스트
              </h2>
            </div>
            <CategoryTabs
              categories={categories}
              activeIndex={activeCategory}
              onSelect={setActiveCategory}
              className="mb-5"
            />
            {renderSavedStores(savedStores)}
          </section>
        ) : mobileView === 'posts' ? (
          <section>
            <div className="mb-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileView('overview')}
                aria-label="뒤로"
                className="text-xl font-bold text-gray-46"
              >
                ‹
              </button>
              <h2 className="text-xl font-extrabold text-[#191f28]">
                내가 작성한 글
              </h2>
            </div>
            <div className="space-y-4">
              {activityPosts.map((post) => (
                <ActivityPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        ) : (
          <>
            <section>
              <SectionHeading
                title="저장된 상가 리스트"
                description="관심 있는 상가를 카테고리별로 관리해보세요."
                actionLabel="전체보기"
                onAction={() => setMobileView('saved')}
              />
              <CategoryTabs
                categories={categories}
                activeIndex={activeCategory}
                onSelect={setActiveCategory}
                className="mb-5"
              />
              {renderSavedStores(savedStores.slice(0, 1))}
            </section>

            <section className="mt-10">
              <SectionHeading
                title="소통 활동 내역"
                description="내가 쓴 글을 확인해보세요."
                actionLabel="전체보기"
                onAction={() => setMobileView('posts')}
              />
              {activityPosts[0] && <ActivityPostCard post={activityPosts[0]} />}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default MyPage;
