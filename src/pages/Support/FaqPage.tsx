import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon } from '@/components/ui/icons';
import { fetchFaqs } from '@/api';
import {
  FAQ_CATEGORIES,
  FAQ_CATEGORY_LABEL,
  FAQ_GROUPS,
  FAQ_GROUP_LABEL,
  type FaqGroup,
  type FaqItem,
} from '@/content/supportTypes';
import { useDocumentTitle } from '@/hooks';
import CategoryChips from './CategoryChips';
import SupportPageLayout from './SupportPageLayout';
import SupportStatus from './SupportStatus';
import { useSupportData } from './useSupportData';

const ALL = '전체';
const CATEGORY_OPTIONS = [
  ALL,
  ...FAQ_CATEGORIES.map((category) => FAQ_CATEGORY_LABEL[category]),
];

interface FaqColumnProps {
  group: FaqGroup;
  items: FaqItem[];
  openId: number | null;
  onToggle: (id: number) => void;
}

/** 시안의 대상별 칼럼 — '질문 N' 라벨 아래 접었다 펴는 문답 상자 */
const FaqColumn = ({ group, items, openId, onToggle }: FaqColumnProps) => (
  <section className="rounded-lg bg-white p-5 shadow-sm md:p-6">
    <h2 className="border-b border-[#e5e8eb] pb-4 text-lg font-extrabold text-[#191f28]">
      {FAQ_GROUP_LABEL[group]}
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
                  <p
                    id={panelId}
                    className="whitespace-pre-line px-4 pb-4 text-sm leading-relaxed text-[#333d4b]"
                  >
                    A. {item.answer}
                  </p>
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
  const [openId, setOpenId] = useState<number | null>(null);
  const { state, retry } = useSupportData(fetchFaqs);

  // 칼럼 안 순서는 BE가 내려주는 displayOrder 순을 그대로 쓴다.
  const itemsByGroup = useMemo(() => {
    const items = state.status === 'success' ? state.data : [];
    const filtered =
      category === ALL
        ? items
        : items.filter(
            (item) => FAQ_CATEGORY_LABEL[item.category] === category
          );
    return Object.fromEntries(
      FAQ_GROUPS.map((group) => [
        group,
        filtered.filter((item) => item.group === group),
      ])
    ) as Record<FaqGroup, FaqItem[]>;
  }, [state, category]);

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
      {state.status === 'loading' ? (
        <SupportStatus kind="loading" />
      ) : state.status === 'error' ? (
        <SupportStatus kind="error" message={state.message} onRetry={retry} />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {FAQ_GROUPS.map((group) => (
            <FaqColumn
              key={group}
              group={group}
              items={itemsByGroup[group]}
              openId={openId}
              onToggle={(id) =>
                setOpenId((current) => (current === id ? null : id))
              }
            />
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3 rounded-lg bg-white px-5 py-8 text-center shadow-sm">
        <p className="text-sm font-bold text-[#191f28]">
          궁금한 내용을 찾지 못하셨나요?
        </p>
        <Link
          to="/contact"
          className="inline-flex h-10 items-center rounded-md bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          문의하기
        </Link>
      </div>
    </SupportPageLayout>
  );
};

export default FaqPage;
