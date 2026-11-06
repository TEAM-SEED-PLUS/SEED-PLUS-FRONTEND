import { useState } from 'react';
import {
  COMMUNITY_LIMITS,
  deleteCommunityPost,
  fetchCommunityPost,
  getApiErrorMessage,
  likeCommunityPost,
  unlikeCommunityPost,
  type CommunityPostSummary,
} from '@/api';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { CommentIcon, HeartIcon, TrashIcon } from '@/components/ui/icons';
import CommunityComments from './CommunityComments';
import { avatarColorClass, formatCommunityDate } from './communityFormat';

interface CommunityPostCardProps {
  post: CommunityPostSummary;
  isAuthenticated: boolean;
  onRequireLogin: () => void;
  onChange: (post: CommunityPostSummary) => void;
  onDeleted: (postId: number) => void;
}

/**
 * 시안 '피드-커뮤니티' 카드. API가 없는 즐겨찾기·조회수·공유·신고는 넣지 않고
 * 댓글 수(누르면 댓글 펼침)·좋아요·삭제(내 글만)만 둔다.
 */
const CommunityPostCard = ({
  post,
  isAuthenticated,
  onRequireLogin,
  onChange,
  onDeleted,
}: CommunityPostCardProps) => {
  const [fullContent, setFullContent] = useState<string | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLikePending, setIsLikePending] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const tags = [
    ...post.regionTags.map((tag) => tag.sigungu),
    ...post.industryTags.map((tag) => tag.name),
  ];
  const isTruncated =
    fullContent === null &&
    post.contentSummary.length >= COMMUNITY_LIMITS.summary;

  const expandContent = async () => {
    setIsExpanding(true);
    setErrorMessage('');
    try {
      const detail = await fetchCommunityPost(post.postId);
      setFullContent(detail.content);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsExpanding(false);
    }
  };

  const toggleLike = async () => {
    if (!isAuthenticated) {
      onRequireLogin();
      return;
    }
    if (isLikePending) return;

    // 먼저 화면에 반영하고, 실패하면 되돌린다.
    const previous = post;
    const liked = !post.liked;
    onChange({
      ...post,
      liked,
      likeCount: Math.max(0, post.likeCount + (liked ? 1 : -1)),
    });
    setIsLikePending(true);
    setErrorMessage('');
    try {
      await (liked
        ? likeCommunityPost(post.postId)
        : unlikeCommunityPost(post.postId));
    } catch (error) {
      onChange(previous);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLikePending(false);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteCommunityPost(post.postId);
      onDeleted(post.postId);
    } catch (error) {
      setDeleteError(getApiErrorMessage(error));
      setIsDeleting(false);
    }
  };

  return (
    <article className="rounded-xl bg-white px-5 py-5 shadow-sm">
      <header className="flex items-center gap-3">
        <div
          aria-hidden
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white ${avatarColorClass(
            post.author.userId
          )}`}
        >
          {post.author.userName.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-[#191f28]">
            {post.author.userName}
          </p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-gray-46">
            {post.location && <span>📍 {post.location}</span>}
            <span>{formatCommunityDate(post.createdAt)}</span>
          </p>
        </div>
      </header>

      <h3 className="mt-4 break-words text-[15px] font-bold text-[#191f28]">
        {post.title}
      </h3>
      <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-relaxed text-[#333d4b]">
        {fullContent ?? post.contentSummary}
        {isTruncated && '…'}
      </p>
      {isTruncated && (
        <button
          type="button"
          onClick={() => void expandContent()}
          disabled={isExpanding}
          className="mt-1 text-xs font-bold text-blue-600 hover:underline disabled:text-gray-46"
        >
          {isExpanding ? '불러오는 중…' : '더 보기'}
        </button>
      )}

      {tags.length > 0 && (
        <p className="mt-3 flex flex-wrap gap-x-2 text-xs text-[#8b95a1]">
          {tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>
      )}

      <div className="mt-4 flex items-center gap-4 text-xs text-[#4e5968]">
        <button
          type="button"
          onClick={() => setIsCommentsOpen((current) => !current)}
          aria-expanded={isCommentsOpen}
          aria-label={`댓글 ${post.commentCount}개 ${isCommentsOpen ? '접기' : '보기'}`}
          className={`flex items-center gap-1 transition hover:text-blue-600 ${
            isCommentsOpen ? 'text-blue-600' : ''
          }`}
        >
          <CommentIcon className="h-4 w-4" />
          {post.commentCount}
        </button>
        <button
          type="button"
          onClick={() => void toggleLike()}
          aria-pressed={post.liked}
          aria-label={post.liked ? '좋아요 취소' : '좋아요'}
          className={`flex items-center gap-1 transition hover:text-[#e5484d] ${
            post.liked ? 'text-[#e5484d]' : ''
          }`}
        >
          <HeartIcon className="h-4 w-4" />
          {post.likeCount}
        </button>
        {post.isOwner && (
          <button
            type="button"
            onClick={() => {
              setDeleteError('');
              setIsDeleteOpen(true);
            }}
            className="ml-auto flex items-center gap-1 text-gray-46 transition hover:text-[#e5484d]"
          >
            <TrashIcon className="h-3.5 w-3.5" />
            삭제
          </button>
        )}
      </div>

      {errorMessage && (
        <p role="alert" className="mt-2 text-xs text-[#e5484d]">
          {errorMessage}
        </p>
      )}

      {isCommentsOpen && (
        <CommunityComments
          postId={post.postId}
          isAuthenticated={isAuthenticated}
          onCountChange={(delta) =>
            onChange({
              ...post,
              commentCount: Math.max(0, post.commentCount + delta),
            })
          }
        />
      )}

      {isDeleteOpen && (
        <ConfirmModal
          title="게시글 삭제"
          message="삭제한 글은 되돌릴 수 없습니다. 삭제하시겠습니까?"
          confirmLabel="삭제"
          isDestructive
          isPending={isDeleting}
          errorMessage={deleteError}
          onConfirm={() => void confirmDelete()}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}
    </article>
  );
};

export default CommunityPostCard;
