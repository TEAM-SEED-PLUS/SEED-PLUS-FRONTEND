import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { notices } from '@/content/noticeContent';
import { NOTICE_CATEGORIES } from '@/content/supportTypes';
import { useDocumentTitle } from '@/hooks';
import CategoryChips from './CategoryChips';
import SupportPageLayout from './SupportPageLayout';

const ALL = '전체';
const CATEGORY_OPTIONS = [ALL, ...NOTICE_CATEGORIES] as const;

/** 중요 공지를 먼저, 그 안에서는 최신 게시일 순으로 정렬한다 */
const sortNotices = (items: typeof notices) =>
  [...items].sort((left, right) => {
    if (!!left.isImportant !== !!right.isImportant) {
      return left.isImportant ? -1 : 1;
    }
    return right.date.localeCompare(left.date);
  });

const NoticeListPage = () => {
  useDocumentTitle('공지사항');
  const [category, setCategory] = useState<string>(ALL);

  const visibleNotices = useMemo(
    () =>
      sortNotices(
        category === ALL
          ? notices
          : notices.filter((notice) => notice.category === category)
      ),
    [category]
  );

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
      {visibleNotices.length === 0 ? (
        <p className="rounded-lg bg-white px-5 py-16 text-center text-sm text-gray-46">
          {category} 공지가 아직 없습니다.
        </p>
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
                {notice.isImportant ? (
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
                    <span>{notice.date}</span>
                    <span className="rounded-sm bg-[#f2f4f6] px-1.5 py-0.5 text-[10px] font-bold text-[#6b7684]">
                      {notice.category}
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
