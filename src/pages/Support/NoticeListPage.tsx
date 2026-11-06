import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchNotices } from '@/api';
import {
  NOTICE_CATEGORIES,
  NOTICE_CATEGORY_LABEL,
  formatPublishedDate,
} from '@/content/supportTypes';
import { useDocumentTitle } from '@/hooks';
import CategoryChips from './CategoryChips';
import SupportPageLayout from './SupportPageLayout';
import SupportStatus from './SupportStatus';
import { useSupportData } from './useSupportData';

const ALL = '전체';
const CATEGORY_OPTIONS = [
  ALL,
  ...NOTICE_CATEGORIES.map((category) => NOTICE_CATEGORY_LABEL[category]),
];

const NoticeListPage = () => {
  useDocumentTitle('공지사항');
  const [category, setCategory] = useState<string>(ALL);
  const { state, retry } = useSupportData(fetchNotices);

  // 정렬(중요 공지 먼저 → 최신 게시일 순)은 BE 응답 순서를 그대로 쓴다.
  const visibleNotices = useMemo(() => {
    if (state.status !== 'success') return [];
    return category === ALL
      ? state.data
      : state.data.filter(
          (notice) => NOTICE_CATEGORY_LABEL[notice.category] === category
        );
  }, [state, category]);

  return (
    <SupportPageLayout
      title="공지사항"
      toolbar={
        <CategoryChips
          label="공지 카테고리"
          options={CATEGORY_OPTIONS}
          selected={category}
          onSelect={setCategory}
        />
      }
    >
      {state.status === 'loading' ? (
        <SupportStatus kind="loading" />
      ) : state.status === 'error' ? (
        <SupportStatus kind="error" message={state.message} onRetry={retry} />
      ) : visibleNotices.length === 0 ? (
        <SupportStatus
          kind="empty"
          message={
            category === ALL
              ? '등록된 공지가 아직 없습니다.'
              : `${category} 공지가 아직 없습니다.`
          }
        />
      ) : (
        <ul className="rounded-lg bg-white px-5 shadow-sm">
          {visibleNotices.map((notice) => (
            <li
              key={notice.id}
              className="border-b border-[#191f28] last:border-b-0"
            >
              <Link
                to={`/notice/${notice.id}`}
                className="flex items-start gap-3 py-5 transition hover:opacity-70"
              >
                {notice.pinned ? (
                  <span className="mt-1 shrink-0 rounded-full bg-[#191f28] px-2 py-0.5 text-[10px] font-bold text-white">
                    중요 공지
                  </span>
                ) : null}
                <span
                  aria-hidden
                  className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-medium text-[#191f28]">
                    {notice.title}
                  </span>
                  <span className="mt-1.5 flex items-center gap-2 text-xs text-[#4e5968]">
                    <span>{formatPublishedDate(notice.publishedAt)}</span>
                    <span className="rounded-sm bg-[#f2f4f6] px-1.5 py-0.5 text-[10px] font-bold text-[#6b7684]">
                      {NOTICE_CATEGORY_LABEL[notice.category]}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SupportPageLayout>
  );
};

export default NoticeListPage;
