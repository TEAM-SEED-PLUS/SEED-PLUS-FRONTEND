import { useMemo, useState } from 'react';
import { ChevronDownIcon } from '@/components/ui/icons';
import { FAQ_CATEGORIES, faqItems } from '@/content/faqContent';
import {
  FAQ_AUDIENCE_LABEL,
  type FaqAudience,
  type FaqItem,
} from '@/content/supportTypes';
import { useDocumentTitle } from '@/hooks';
import CategoryChips from './CategoryChips';
import SupportPageLayout from './SupportPageLayout';

const ALL = '전체';
const CATEGORY_OPTIONS = [ALL, ...FAQ_CATEGORIES] as const;
const AUDIENCES: FaqAudience[] = ['general', 'partner'];

interface FaqColumnProps {
  audience: FaqAudience;
  items: FaqItem[];
  openId: string | null;
  onToggle: (id: string) => void;
}

/** 시안의 대상별 칼럼 — '질문 N' 라벨 아래 접었다 펴는 문답 상자 */
const FaqColumn = ({ audience, items, openId, onToggle }: FaqColumnProps) => (
  <section className="rounded-lg bg-white p-5 shadow-sm md:p-6">
    <h2 className="border-b border-[#e5e8eb] pb-4 text-lg font-extrabold text-[#191f28]">
      {FAQ_AUDIENCE_LABEL[audience]}
    </h2>

    {items.length === 0 ? (
      <p className="mt-5 rounded-md bg-[#f7f8fa] px-4 py-10 text-center text-xs text-gray-46">
        해당 카테고리의 질문이 아직 없습니다.
      </p>
    ) : (
      <ul className="mt-5 space-y-5">
        {items.map((item, index) => {
          const isOpen = item.id === openId;
          const panelId = `faq-panel-${item.id}`;
          return (
            <li key={item.id}>
              <p className="mb-1.5 text-xs text-[#6b7684]">질문 {index + 1}</p>
              <div className="rounded-md border border-[#e5e8eb]">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => onToggle(item.id)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-[#191f28]"
                >
                  <span>Q. {item.question}</span>
                  <ChevronDownIcon
                    className={`h-4 w-4 shrink-0 text-[#4e5968] transition-transform ${
                      isOpen ? '' : 'rotate-90'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={panelId}
                    className="px-4 pb-4 text-sm text-[#333d4b]"
                  >
                    {item.answer.map((paragraph, paragraphIndex) => (
                      <p
                        key={paragraph}
                        className="mt-2 leading-relaxed first:mt-0"
                      >
                        {paragraphIndex === 0 ? `A. ${paragraph}` : paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    )}
  </section>
);

const FaqPage = () => {
  useDocumentTitle('FAQ');
  const [category, setCategory] = useState<string>(ALL);
  const [openId, setOpenId] = useState<string | null>(null);

  const itemsByAudience = useMemo(() => {
    const filtered =
      category === ALL
        ? faqItems
        : faqItems.filter((item) => item.category === category);
    return Object.fromEntries(
      AUDIENCES.map((audience) => [
        audience,
        filtered.filter((item) => item.audience === audience),
      ])
    ) as Record<FaqAudience, FaqItem[]>;
  }, [category]);

  return (
    <SupportPageLayout
      title="FAQ"
      width="wide"
      toolbar={
        <CategoryChips
          label="FAQ 카테고리"
          options={CATEGORY_OPTIONS}
          selected={category}
          onSelect={(value) => {
            setCategory(value);
            setOpenId(null);
          }}
        />
      }
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {AUDIENCES.map((audience) => (
          <FaqColumn
            key={audience}
            audience={audience}
            items={itemsByAudience[audience]}
            openId={openId}
            onToggle={(id) =>
              setOpenId((current) => (current === id ? null : id))
            }
          />
        ))}
      </div>
    </SupportPageLayout>
  );
};

export default FaqPage;
