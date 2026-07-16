export interface ActivityPost {
  id: number;
  initial: string;
  colorClass: string;
  title: string;
  district: string;
  content: string;
  tags: string[];
  comments: number;
  likes: number;
  views: number;
}

interface ActivityPostCardProps {
  post: ActivityPost;
  onDelete?: (post: ActivityPost) => void;
}

const ActivityPostCard = ({ post, onDelete }: ActivityPostCardProps) => {
  return (
    <article className="rounded-xl border border-[#e5e8eb] bg-white px-5 py-5">
      <div className="mb-4 flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${post.colorClass}`}
        >
          {post.initial}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-[#191f28]">{post.title}</h3>
          <p className="mt-1 text-sm text-gray-46">📍 {post.district}</p>
        </div>
      </div>

      <p className="text-[15px] leading-7 text-[#191f28]">{post.content}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-gray-500 px-2.5 py-1 text-xs font-medium text-gray-46"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#e5e8eb] pt-4 text-sm text-gray-46">
        <div className="flex gap-5">
          <span>💬 {post.comments}</span>
          <span>♥ {post.likes}</span>
          <span>👁 {post.views}</span>
          <button
            type="button"
            className="font-medium transition hover:text-[#4e5968]"
          >
            📤 공유
          </button>
          <button
            type="button"
            className="font-medium transition hover:text-[#4e5968]"
          >
            🚩 신고
          </button>
        </div>
        <button
          type="button"
          onClick={() => onDelete?.(post)}
          className="font-medium transition hover:text-[#e5484d]"
        >
          삭제
        </button>
      </div>
    </article>
  );
};

export default ActivityPostCard;
