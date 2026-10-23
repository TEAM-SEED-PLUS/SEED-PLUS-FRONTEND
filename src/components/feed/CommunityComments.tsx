import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  COMMUNITY_LIMITS,
  createCommunityComment,
  deleteCommunityComment,
  fetchCommunityComments,
  getApiErrorMessage,
  type CommunityComment,
} from '@/api';
import { SpinnerIcon, TrashIcon } from '@/components/ui/icons';
import { formatCommunityDate } from './communityFormat';

interface CommunityCommentsProps {
  postId: number;
  isAuthenticated: boolean;
  /** 댓글 작성·삭제 후 카드의 댓글 수를 맞춘다 */
  onCountChange: (delta: number) => void;
}

/** 카드 아래에 펼쳐지는 댓글 목록 + 입력창 (시안 없음 — 카드 스타일을 따른다) */
const CommunityComments = ({
  postId,
  isAuthenticated,
  onCountChange,
}: CommunityCommentsProps) => {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [draft, setDraft] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  const loadPage = async (page: number, ignore: () => boolean) => {
    try {
      const result = await fetchCommunityComments(postId, page);
      if (ignore()) return;
      setComments((current) =>
        page === 0 ? result.content : [...current, ...result.content]
      );
      setNextPage(result.pageInfo.hasNext ? page + 1 : null);
      setLoadError('');
    } catch (error) {
      if (!ignore()) setLoadError(getApiErrorMessage(error));
    } finally {
      if (!ignore()) setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignored = false;
    void loadPage(0, () => ignored);
    return () => {
      ignored = true;
    };
    // postId가 바뀔 때만 처음부터 다시 불러온다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const loadMore = () => {
    if (nextPage === null) return;
    setIsLoading(true);
    void loadPage(nextPage, () => false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isSubmitting) return;

    setIsSubmitting(true);
    setActionError('');
    try {
      const comment = await createCommunityComment(postId, content);
      // 오름차순이라 아직 안 불러온 페이지가 있으면 끝에 붙이지 않는다.
      if (nextPage === null) {
        setComments((current) => [...current, comment]);
      }
      setDraft('');
      onCountChange(1);
    } catch (error) {
      setActionError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    setActionError('');
    try {
      await deleteCommunityComment(postId, commentId);
      setComments((current) =>
        current.filter((comment) => comment.commentId !== commentId)
      );
      onCountChange(-1);
    } catch (error) {
      setActionError(getApiErrorMessage(error));
    }
  };

  return (
    <div className="mt-4 border-t border-[#e5e8eb] pt-4">
      {loadError ? (
        <p role="alert" className="py-2 text-center text-xs text-[#e5484d]">
          {loadError}
        </p>
      ) : comments.length === 0 && !isLoading ? (
        <p className="py-2 text-center text-xs text-gray-46">
          첫 댓글을 남겨보세요.
        </p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.commentId} className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#191f28]">
                    {comment.author.userName}
                  </span>
                  <span className="text-[#8b95a1]">
                    {formatCommunityDate(comment.createdAt)}
                  </span>
                </p>
                <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-[#333d4b]">
                  {comment.content}
                </p>
              </div>
              {comment.isOwner && (
                <button
                  type="button"
                  onClick={() => void handleDelete(comment.commentId)}
                  className="flex shrink-0 items-center gap-1 text-xs text-gray-46 transition hover:text-[#e5484d]"
                  aria-label="댓글 삭제"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                  삭제
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {isLoading && (
        <div className="flex justify-center py-2" role="status">
          <SpinnerIcon className="h-5 w-5 text-blue-600" />
          <span className="sr-only">댓글을 불러오는 중입니다.</span>
        </div>
      )}
      {!isLoading && nextPage !== null && (
        <button
          type="button"
          onClick={loadMore}
          className="mt-3 w-full text-center text-xs font-bold text-blue-600 hover:underline"
        >
          댓글 더 보기
        </button>
      )}

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <label className="min-w-0 flex-1">
            <span className="sr-only">댓글 입력</span>
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={COMMUNITY_LIMITS.comment}
              placeholder="댓글을 입력해주세요."
              className="h-10 w-full rounded-md border border-[#d8dde5] px-3 text-sm outline-none placeholder:text-[#b0b8c1] focus:border-blue-600"
            />
          </label>
          <button
            type="submit"
            disabled={!draft.trim() || isSubmitting}
            className="h-10 shrink-0 rounded-md bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#c4c7cb]"
          >
            등록
          </button>
        </form>
      ) : (
        <p className="mt-4 text-center text-xs text-gray-46">
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            로그인
          </Link>{' '}
          후 댓글을 남길 수 있습니다.
        </p>
      )}

      {actionError && (
        <p role="alert" className="mt-2 text-xs text-[#e5484d]">
          {actionError}
        </p>
      )}
    </div>
  );
};

export default CommunityComments;
