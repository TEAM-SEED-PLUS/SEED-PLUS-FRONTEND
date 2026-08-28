import {
  CommentIcon,
  HeartIcon,
  RepeatIcon,
  ShareIcon,
} from '@/components/ui/icons';

export interface CommunityPost {
  author: string;
  initial: string;
  district: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  saves: number;
  colorClass: string;
}

interface CommunityPostCardProps {
  post: CommunityPost;
}

const CommunityPostCard = ({ post }: CommunityPostCardProps) => {
  return (
    <article className="rounded-xl border border-[#e5e8eb] bg-white px-5 py-5">
      <div className="mb-5 flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${post.colorClass}`}
        >
          {post.initial}
        </div>
        <div>
          <h3 className="text-base font-bold text-[#191f28]">{post.title}</h3>
          <p className="mt-1 text-sm text-gray-46">{post.district}</p>
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

      <div className="mt-5 flex gap-5 border-t border-[#e5e8eb] pt-4 text-sm text-gray-46">
        <span className="flex items-center gap-1.5">
          <HeartIcon className="h-4 w-4" />
          {post.likes}
        </span>
        <span className="flex items-center gap-1.5">
          <CommentIcon className="h-4 w-4" />
          {post.comments}
        </span>
        <span className="flex items-center gap-1.5">
          <RepeatIcon className="h-4 w-4" />
          {post.saves}
        </span>
        <button type="button" className="flex items-center gap-1.5 font-medium">
          <ShareIcon className="h-4 w-4" />
          공유
        </button>
      </div>
    </article>
  );
};

export default CommunityPostCard;
