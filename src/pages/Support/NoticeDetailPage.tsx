import { Link, useParams } from 'react-router-dom';
import { notices } from '@/content/noticeContent';
import { useDocumentTitle } from '@/hooks';
import SupportPageLayout from './SupportPageLayout';

const NoticeDetailPage = () => {
  const { noticeId } = useParams<{ noticeId: string }>();
  const notice = notices.find((item) => item.id === noticeId);
  useDocumentTitle(notice ? notice.title : '공지사항');

  return (
    <SupportPageLayout title="공지사항">
      {!notice ? (
        <div className="rounded-lg bg-white px-5 py-16 text-center shadow-sm">
          <p className="text-sm font-bold text-[#191f28]">
            공지를 찾을 수 없습니다.
          </p>
          <p className="mt-2 text-xs text-gray-46">
            삭제되었거나 주소가 잘못되었을 수 있습니다.
          </p>
        </div>
      ) : (
        <article className="rounded-lg bg-white px-5 py-6 shadow-sm md:px-7">
          <header className="flex items-start gap-3 border-b border-[#191f28] pb-5">
            {notice.isImportant && (
              <span className="mt-1 shrink-0 rounded-full bg-[#191f28] px-2 py-0.5 text-[10px] font-bold text-white">
                중요 공지
              </span>
            )}
            <span
              aria-hidden
              className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600"
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-medium text-[#191f28]">
                {notice.title}
              </h2>
              <p className="mt-1.5 flex items-center gap-2 text-xs text-[#4e5968]">
                <span>{notice.date}</span>
                <span className="rounded-sm bg-[#f2f4f6] px-1.5 py-0.5 text-[10px] font-bold text-[#6b7684]">
                  {notice.category}
                </span>
              </p>
            </div>
          </header>

          <div className="py-6">
            {notice.body.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-3 text-sm leading-relaxed text-[#333d4b] first:mt-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      )}

      <div className="mt-6 text-center">
        <Link
          to="/notice"
          className="text-sm font-bold text-blue-600 hover:underline"
        >
          목록으로
        </Link>
      </div>
    </SupportPageLayout>
  );
};

export default NoticeDetailPage;
