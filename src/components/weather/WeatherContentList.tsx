import type { WeatherContentItem } from '@/api/weatherFeedTypes';

const TYPE_LABEL: Record<WeatherContentItem['type'], string> = {
  festival: '축제·행사',
  performance: '공연',
  sports: '스포츠',
  video: '영상',
};

interface WeatherContentListProps {
  items: WeatherContentItem[];
}

/** 상권 관련 행사·관광 콘텐츠와 기획팀 제작 영상 카드 */
const WeatherContentList = ({ items }: WeatherContentListProps) => (
  <section className="rounded-lg bg-white p-5 shadow-sm">
    <h3 className="text-sm font-extrabold text-[#191f28]">상권 관련 콘텐츠</h3>

    {items.length === 0 ? (
      <p className="mt-3 text-xs text-[#8b95a1]">표시할 콘텐츠가 없습니다.</p>
    ) : (
      <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="overflow-hidden rounded-md border border-[#e5e8eb]"
          >
            <div className="relative flex h-24 items-center justify-center bg-[#f2f4f6]">
              {item.thumbnailUrl ? (
                <img
                  src={item.thumbnailUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span aria-hidden className="text-2xl">
                  {item.type === 'video' ? '▶' : '🗓'}
                </span>
              )}
              <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                {TYPE_LABEL[item.type]}
              </span>
            </div>
            <div className="px-3 py-2">
              <p className="truncate text-xs font-bold text-[#191f28]">
                {item.title}
              </p>
              <p className="mt-1 truncate text-[11px] text-[#8b95a1]">
                {item.type === 'video'
                  ? `조회수 ${((item.viewCount ?? 0) / 10000).toFixed(1)}만회`
                  : [item.period, item.place].filter(Boolean).join(' · ')}
              </p>
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default WeatherContentList;
