import { MobileIcon, PlayIcon } from '@/components/ui/icons';
import { mockTrendingVideos } from '@/api/homeMock';

/** 지금 뜨는 소식 — 기획팀 제작 영상 콘텐츠 영역 */
const TrendingNewsCard = () => (
  <section className="rounded-lg bg-white p-5 shadow-sm">
    <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-[#191f28]">
      <MobileIcon className="h-4 w-4 text-blue-600" />
      지금 뜨는 소식
    </h3>

    <ul className="mt-4 grid grid-cols-2 gap-3">
      {mockTrendingVideos.map((video) => (
        <li
          key={video.id}
          className="overflow-hidden rounded-md border border-[#e5e8eb]"
        >
          <div className="relative flex h-20 items-center justify-center bg-[#e5e8eb]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80">
              <PlayIcon className="h-3 w-3 text-[#4e5968]" />
            </span>
          </div>
          <div className="px-2 py-2">
            <p className="truncate text-[11px] font-bold text-[#191f28]">
              {video.title}
            </p>
            <p className="mt-0.5 text-[10px] text-[#8b95a1]">
              조회수 {video.views}
            </p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default TrendingNewsCard;
