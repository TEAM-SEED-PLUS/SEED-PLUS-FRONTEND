import type { WeatherNarrative } from '@/api/weatherFeedTypes';

interface WeatherNarrativeCardProps {
  narrative: WeatherNarrative;
}

/** AI 판단·근거·추천 액션 (LLM 실패 시에도 rule_fallback 문장이 항상 존재) */
const WeatherNarrativeCard = ({ narrative }: WeatherNarrativeCardProps) => (
  <section className="rounded-lg bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-sm font-extrabold text-[#191f28]">AI 분석</h3>
      {narrative.generation_mode === 'rule_fallback' && (
        <span className="rounded-full bg-[#f2f4f6] px-2 py-1 text-[10px] font-bold text-gray-46">
          기본 분석
        </span>
      )}
    </div>

    <p className="mt-3 text-sm font-bold leading-relaxed text-[#191f28]">
      {narrative.judgement_sentence}
    </p>
    <p className="mt-2 text-xs leading-relaxed text-[#4e5968]">
      {narrative.basis_sentence}
    </p>

    {narrative.recommended_actions.length > 0 && (
      <div className="mt-4 rounded-md bg-[#e8f1ff] px-4 py-3">
        <p className="text-xs font-extrabold text-blue-600">추천 액션</p>
        <ul className="mt-2 space-y-1.5">
          {narrative.recommended_actions.map((action) => (
            <li
              key={action}
              className="flex gap-2 text-xs leading-relaxed text-[#191f28]"
            >
              <span aria-hidden className="text-blue-600">
                •
              </span>
              {action}
            </li>
          ))}
        </ul>
      </div>
    )}
  </section>
);

export default WeatherNarrativeCard;
