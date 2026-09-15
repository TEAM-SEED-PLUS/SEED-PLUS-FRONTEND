import type { WeatherFeed } from '@/api/weatherFeedTypes';
import { GRADE_ICON, resolveGrade } from './weatherGradeStyle';

interface WeatherSummaryCardProps {
  feed: WeatherFeed;
}

/** 선택 자치구의 상권날씨 등급·기회 점수 요약 */
const WeatherSummaryCard = ({ feed }: WeatherSummaryCardProps) => {
  const { query, market_weather: weather, opportunity_score: score } = feed;
  // 수집 실패 시 등급·점수가 null로 온다. 0으로 채우지 않고 '미산출'로 표기한다.
  const grade = resolveGrade(weather.grade);
  const isReference =
    feed.data_quality.score_context.basis === 'previous_evening_reference';

  return (
    <section className="rounded-lg bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-[#191f28]">
          {query.district} 상권날씨{' '}
          {grade && (
            <img
              src={GRADE_ICON[grade]}
              alt=""
              aria-hidden
              className="inline-block h-5 w-5 align-text-bottom"
            />
          )}{' '}
          <span className="text-blue-600">{weather.grade ?? '미산출'}</span>
        </h2>
        <span className="rounded-full bg-[#f2f4f6] px-3 py-1 text-xs font-bold text-gray-46">
          {[query.time_band, query.time].filter(Boolean).join(' · ')} 기준
        </span>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <p className="text-4xl font-extrabold text-blue-600">{score ?? '?'}</p>
        <p className="pb-1 text-sm font-bold text-gray-46">기회 점수 / 100</p>
      </div>

      {isReference && (
        <p className="mt-2 text-xs font-medium text-[#8b95a1]">
          직전 저녁({feed.data_quality.score_context.reference_date}{' '}
          {feed.data_quality.score_context.reference_start}~
          {feed.data_quality.score_context.reference_end}) 참고값입니다.
        </p>
      )}
    </section>
  );
};

export default WeatherSummaryCard;
