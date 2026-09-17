import type { WeatherContentItem } from '@/api/weatherFeedTypes';
import {
  CalendarIcon,
  ExternalLinkIcon,
  MobileIcon,
  SpinnerIcon,
} from '@/components/ui/icons';

const TYPE_LABEL: Record<WeatherContentItem['type'], string> = {
  festival: '축제',
  event: '행사',
  performance: '공연',
  sports: '스포츠',
  video: '영상',
};

/**
 * 카드 내용. 링크가 있는 카드만 ↗ 표시를 붙여,
 * 표시가 없는 카드(link_url null)는 누르는 카드가 아님을 자연스럽게 구분한다.
 */
const ContentCardBody = ({
  item,
  hasLink,
}: {
  item: WeatherContentItem;
  hasLink: boolean;
}) => (
  <>
    {item.thumbnailUrl ? (
      <img
        src={item.thumbnailUrl}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center bg-[#e5e8eb]">
        <CalendarIcon className="h-6 w-6 text-[#8b95a1]" />
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <span className="absolute left-2 top-2 rounded-sm bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-white">
      {TYPE_LABEL[item.type]}
    </span>
    {hasLink && (
      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-sm bg-black/50 text-white transition group-hover:bg-blue-600">
        <ExternalLinkIcon className="h-3 w-3" />
      </span>
    )}
    <div className="absolute inset-x-0 bottom-0 p-2.5">
      <p className="line-clamp-2 text-xs font-bold leading-snug text-white">
        {item.title}
      </p>
      {item.period && (
        <p className="mt-1 truncate text-[10px] text-white/75">{item.period}</p>
      )}
    </div>
  </>
);

interface WeatherTrendingContentProps {
  district: string;
  items: WeatherContentItem[];
  isLoading: boolean;
}

/** 지금 뜨는 소식 — 선택 자치구의 축제·행사·공연·스포츠 (AI content.items) */
const WeatherTrendingContent = ({
  district,
  items,
  isLoading,
}: WeatherTrendingContentProps) => (
  <section className="rounded-lg bg-white p-5 shadow-sm">
    <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-[#191f28]">
      <MobileIcon className="h-4 w-4 text-blue-600" />
      지금 뜨는 소식
    </h3>

    {isLoading ? (
      <div
        role="status"
        aria-label="소식을 불러오는 중"
        className="mt-4 flex justify-center py-10"
      >
        <SpinnerIcon className="h-6 w-6 text-blue-600" />
      </div>
    ) : items.length === 0 ? (
      <p className="mt-4 rounded-md bg-[#f7f8fa] px-4 py-10 text-center text-xs leading-relaxed text-gray-46">
        {district}에 지금 소개할
        <br />
        축제·행사·공연 소식이 없습니다.
      </p>
    ) : (
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="relative aspect-[3/4] overflow-hidden rounded-md bg-[#191f28]"
          >
            {item.linkUrl ? (
              <a
                href={item.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.title} (새 탭에서 열림)`}
                className="group block h-full w-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600"
              >
                <ContentCardBody item={item} hasLink />
              </a>
            ) : (
              <ContentCardBody item={item} hasLink={false} />
            )}
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default WeatherTrendingContent;
