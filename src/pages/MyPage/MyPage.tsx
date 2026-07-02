import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth';
import { HeaderUser, LogoutConfirmModal } from '@/components/layout';
import {
  AccountActions,
  ActivityPostCard,
  CategoryTabs,
  NotificationSettings,
  ProfileSummaryCard,
} from '@/components/mypage';
import type { ActivityPost } from '@/components/mypage';
import { StoreGrid } from '@/components/store';
import type { StoreItem } from '@/components/store';

const categories = [
  '내가 설정한 카테고리 이름 1',
  '내가 설정한 카테고리 이름 2',
  '내가 설정한 카테고리 이름 3',
];

const initialSavedStores: StoreItem[] = [
  {
    id: 1,
    rank: 1,
    name: '강남 파스타 레스토랑',
    category: '음식점',
    district: '강남구 역삼동',
    area: '65m²',
    sales: '4,600만원',
    payback: '22개월',
    profit: '20%',
    score: 96,
    likes: 14,
    reposts: 3,
    saved: true,
    liked: false,
    areaValue: 65,
    expectedMonthlySalesValue: 4600,
    expectedProfitRateValue: 20,
    depositValue: 5000,
    monthlyRentValue: 300,
  },
  {
    id: 2,
    rank: 2,
    name: '성수 카페',
    category: '카페/음료',
    district: '강남구 역삼동',
    area: '65m²',
    sales: '4,600만원',
    payback: '22개월',
    profit: '20%',
    score: 96,
    likes: 14,
    reposts: 3,
    saved: true,
    liked: false,
    areaValue: 65,
    expectedMonthlySalesValue: 4600,
    expectedProfitRateValue: 20,
    depositValue: 5000,
    monthlyRentValue: 300,
  },
  {
    id: 3,
    rank: 1,
    name: '홍대 네일아트샵',
    category: '미용/뷰티',
    district: '강남구 역삼동',
    area: '65m²',
    sales: '4,600만원',
    payback: '22개월',
    profit: '20%',
    score: 96,
    likes: 14,
    reposts: 3,
    saved: true,
    liked: false,
    areaValue: 65,
    expectedMonthlySalesValue: 4600,
    expectedProfitRateValue: 20,
    depositValue: 5000,
    monthlyRentValue: 300,
  },
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
  const { user, status, isAuthenticated, logout } = useAuth();
  const [activeCategory, setActiveCategory] = useState(0);
  const [mobileView, setMobileView] = useState<MobileView>('overview');
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [savedStores, setSavedStores] =
    useState<StoreItem[]>(initialSavedStores);

  const handleToggleBookmark = (target: StoreItem) =>
    setSavedStores((prev) =>
      prev.map((store) =>
        store.id === target.id ? { ...store, saved: !store.saved } : store
      )
    );

  const handleToggleLike = (target: StoreItem) =>
    setSavedStores((prev) =>
      prev.map((store) =>
        store.id === target.id
          ? {
              ...store,
              liked: !store.liked,
              likes: store.liked ? store.likes - 1 : store.likes + 1,
            }
          : store
      )
    );

  const renderSavedStores = (stores: StoreItem[]) => (
    <StoreGrid
      stores={stores}
      isLoading={false}
      errorMessage=""
      pendingBookmarkIds={[]}
      onToggleBookmark={handleToggleBookmark}
      pendingLikeIds={[]}
      onToggleLike={handleToggleLike}
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

  const confirmLogout = async () => {
    setIsLogoutConfirmOpen(false);
    await logout();
    navigate('/login');
  };

  const profileCard = (className?: string) => (
    <ProfileSummaryCard
      name={name}
      initial={initial}
      savedCount={12}
      postCount={4}
      activityScore={96}
      className={className}
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
          <NotificationSettings />
          <AccountActions
            className="mt-auto"
            onLogout={() => setIsLogoutConfirmOpen(true)}
            onWithdraw={() => setIsWithdrawOpen(true)}
          />
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

            <NotificationSettings className="mt-10" />
            <AccountActions
              className="mt-6"
              onLogout={() => setIsLogoutConfirmOpen(true)}
              onWithdraw={() => setIsWithdrawOpen(true)}
            />
          </>
        )}
      </main>

      {isLogoutConfirmOpen && (
        <LogoutConfirmModal
          onConfirm={confirmLogout}
          onCancel={() => setIsLogoutConfirmOpen(false)}
        />
      )}

      {isWithdrawOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
          role="dialog"
          aria-modal="true"
          aria-label="회원탈퇴"
          onClick={() => setIsWithdrawOpen(false)}
        >
          <section
            className="w-full max-w-[360px] rounded-lg bg-white p-6 shadow-[0_18px_60px_rgba(25,31,40,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-extrabold text-[#191f28]">회원탈퇴</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-[#4e5968]">
              회원탈퇴 기능은 현재 준비 중입니다. 곧 제공될 예정입니다.
            </p>
            <button
              type="button"
              onClick={() => setIsWithdrawOpen(false)}
              className="mt-6 h-11 w-full rounded-md bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              확인
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default MyPage;
