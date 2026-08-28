interface WeatherPlaceholderCardProps {
  title: string;
  description: string;
}

/**
 * 디자인 확정 전 자리표시 카드.
 * 4대 지표 점수 시각화와 의사결정 태그는 시안이 아직 없어 자리만 잡아둔다.
 * 데이터(indicators, decision_tags)는 이미 수신·전달되고 있으므로
 * 시안이 나오면 이 컴포넌트만 교체하면 된다.
 */
const WeatherPlaceholderCard = ({
  title,
  description,
}: WeatherPlaceholderCardProps) => (
  <section className="rounded-lg border border-dashed border-[#d8dde5] bg-white p-5">
    <h3 className="text-sm font-extrabold text-[#191f28]">{title}</h3>
    <p className="mt-2 text-xs leading-relaxed text-[#8b95a1]">{description}</p>
    <p className="mt-3 inline-block rounded-md bg-[#f2f4f6] px-2 py-1 text-[11px] font-bold text-gray-46">
      디자인 확정 후 표시 예정
    </p>
  </section>
);

export default WeatherPlaceholderCard;
