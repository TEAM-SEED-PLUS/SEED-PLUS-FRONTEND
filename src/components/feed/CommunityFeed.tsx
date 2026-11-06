import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  COMMUNITY_LIMITS,
  fetchCommunityPosts,
  getApiErrorMessage,
  type CommunityPostDetail,
  type CommunityPostSummary,
} from '@/api';
import { useAuth } from '@/auth';
import { SpinnerIcon, UsersIcon } from '@/components/ui/icons';
import CommunityPostCard from './CommunityPostCard';
import CommunityPostForm from './CommunityPostForm';

const toSummary = ({
  content,
  ...post
}: CommunityPostDetail): CommunityPostSummary => ({
  ...post,
  // 목록 응답과 같게 앞 200자만 두고, 넘치면 카드의 '더 보기'로 상세를 불러온다.
  contentSummary: content.slice(0, COMMUNITY_LIMITS.summary),
});

/** 피드 > 소통 — 커뮤니티 게시글 목록(최신순)과 글쓰기 */
const CommunityFeed = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<CommunityPostSummary[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  const loadPage = useCallback(async (page: number) => {
    setIsLoading(true);
    setLoadError('');
    try {
      const result = await fetchCommunityPosts(page);
      setPosts((current) =>
        page === 0 ? result.content : [...current, ...result.content]
      );
      setNextPage(result.pageInfo.hasNext ? page + 1 : null);
    } catch (error) {
      setLoadError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 마운트 시 첫 페이지를 불러온다(상태 갱신은 응답 이후 비동기로 일어난다).
    let ignore = false;
    fetchCommunityPosts(0).then(
      (result) => {
        if (ignore) return;
        setPosts(result.content);
        setNextPage(result.pageInfo.hasNext ? 1 : null);
        setIsLoading(false);
      },
      (error: unknown) => {
        if (ignore) return;
        setLoadError(getApiErrorMessage(error));
        setIsLoading(false);
      }
    );
    return () => {
      ignore = true;
    };
  }, []);

  const requireLogin = () => navigate('/login');

  const updatePost = (updated: CommunityPostSummary) =>
    setPosts((current) =>
      current.map((post) => (post.postId === updated.postId ? updated : post))
    );

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[#e5e8eb] bg-gradient-to-r from-[#eef5ff] to-[#f2fff8] px-6 py-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#191f28]">
          <UsersIcon className="h-5 w-5 text-blue-600" />
          SEED+ 커뮤니티
        </h2>
        <p className="mt-2 text-sm text-gray-46">
          같은 지역 점포주들과 원재료 공동 구매, 정보 공유, 상권 활성화를 함께
          만들어보세요!
        </p>
      </section>

      {isWriting ? (
        <CommunityPostForm
          onCreated={(post) => {
            setPosts((current) => [toSummary(post), ...current]);
            setIsWriting(false);
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() =>
            isAuthenticated ? setIsWriting(true) : requireLogin()
          }
          className="h-10 rounded-md bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          글쓰기
        </button>
      )}

      {loadError && posts.length === 0 ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-lg bg-white px-5 py-14 text-center shadow-sm"
        >
          <p className="text-sm font-bold text-[#191f28]">{loadError}</p>
          <button
            type="button"
            onClick={() => void loadPage(0)}
            className="h-9 rounded-md border border-[#d8dde5] px-4 text-xs font-bold text-[#4e5968] transition hover:border-blue-600 hover:text-blue-600"
          >
            다시 시도
          </button>
        </div>
      ) : !isLoading && posts.length === 0 ? (
        <div className="rounded-lg bg-white px-5 py-14 text-center text-sm font-medium text-gray-46 shadow-sm">
          아직 등록된 글이 없습니다. 첫 글을 남겨보세요.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <CommunityPostCard
              key={post.postId}
              post={post}
              isAuthenticated={isAuthenticated}
              onRequireLogin={requireLogin}
              onChange={updatePost}
              onDeleted={(postId) =>
                setPosts((current) =>
                  current.filter((item) => item.postId !== postId)
                )
              }
            />
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-6" role="status">
          <SpinnerIcon className="h-8 w-8 text-blue-600" />
          <span className="sr-only">게시글을 불러오는 중입니다.</span>
        </div>
      ) : (
        nextPage !== null && (
          <div className="flex flex-col items-center gap-2">
            {loadError && (
              <p role="alert" className="text-xs text-[#e5484d]">
                {loadError}
              </p>
            )}
            <button
              type="button"
              onClick={() => void loadPage(nextPage)}
              className="h-10 rounded-md border border-[#d8dde5] bg-white px-6 text-sm font-bold text-[#4e5968] transition hover:border-blue-600 hover:text-blue-600"
            >
              더 보기
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default CommunityFeed;
