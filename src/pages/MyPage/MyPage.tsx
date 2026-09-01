import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth';
import { FEATURE_FLAGS } from '@/config/featureFlags';
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

// 소통 활동 내역은 아직 API가 없다.
// 값을 지어내지 않고 빈 목록으로 두고, 화면에서는 빈 상태 문구를 노출한다.
// TODO(BE): 내가 쓴 글 목록 엔드포인트 확정 시 연동.
const activityPosts: ActivityPost[] = [];

// 저장 리스트 출처 필터 — 생성 상가와 북마크 상가를 병합해 보여주므로 구분 탭 제공.
const savedFilters = ['전체', '내가 만든 상가', '북마크한 상가'];

type MobileView = 'overview' | 'saved' | 'posts';

const EmptyNotice = ({ message }: { message: string }) => (
  <div className="rounded-lg border border-[#d8dde5] bg-white px-5 py-14 text-center text-sm font-medium text-gray-46">
    {message}
  </div>
);

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
  const [activeSavedFilter, setActiveSavedFilter] = useState(0);
  const [mobileView, setMobileView] = useState<MobileView>('overview');
  const {
    stores: savedStores,
    createdIds,
    isLoading: isSavedLoading,
    errorMessage: savedError,
    pendingBookmarkIds,
    pendingLikeIds,
    toggleBookmark,
    toggleLike,
  } = useSavedStores(isAuthenticated);

  const filteredSavedStores = useMemo(() => {
    if (activeSavedFilter === 1) {
      return savedStores.filter((store) => createdIds.has(store.id));
    }
    if (activeSavedFilter === 2) {
      return savedStores.filter((store) => store.saved);
    }
    return savedStores;
  }, [savedStores, createdIds, activeSavedFilter]);

  const renderCategoryTabs = (className?: string) => (
    <CategoryTabs
      categories={savedFilters}
      activeIndex={activeSavedFilter}
      onSelect={setActiveSavedFilter}
      className={className}
    />
  );

  const renderActivityPosts = () =>
    activityPosts.length > 0 ? (
      <div className="space-y-4">
        {activityPosts.map((post) => (
          <ActivityPostCard key={post.id} post={post} />
        ))}
      </div>
    ) : (
      <EmptyNotice message="아직 작성한 글이 없습니다." />
    );

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
      savedCount={savedStores.length}
      postCount={activityPosts.length}
      activityScore={null}
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
            {renderCategoryTabs()}
            <div className="mt-5">{renderSavedStores(filteredSavedStores)}</div>
          </section>

          {FEATURE_FLAGS.MYPAGE_ACTIVITY_POSTS && (
            <section className="mt-12">
              <SectionHeading
                title="소통 활동 내역"
                description="내가 쓴 글을 확인해보세요."
              />
              {renderActivityPosts()}
            </section>
          )}
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
            {renderCategoryTabs('mb-5')}
            {renderSavedStores(filteredSavedStores)}
          </section>
        ) : mobileView === 'posts' && FEATURE_FLAGS.MYPAGE_ACTIVITY_POSTS ? (
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
            {renderActivityPosts()}
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
              {renderCategoryTabs('mb-5')}
              {renderSavedStores(filteredSavedStores.slice(0, 1))}
            </section>

            {FEATURE_FLAGS.MYPAGE_ACTIVITY_POSTS && (
              <section className="mt-10">
                <SectionHeading
                  title="소통 활동 내역"
                  description="내가 쓴 글을 확인해보세요."
                  actionLabel="전체보기"
                  onAction={() => setMobileView('posts')}
                />
                {activityPosts[0] ? (
                  <ActivityPostCard post={activityPosts[0]} />
                ) : (
                  <EmptyNotice message="아직 작성한 글이 없습니다." />
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MyPage;
