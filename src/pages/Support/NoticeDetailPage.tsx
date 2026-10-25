import { useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { fetchNotice } from '@/api';
import {
  NOTICE_CATEGORY_LABEL,
  formatPublishedDate,
} from '@/content/supportTypes';
import { useDocumentTitle } from '@/hooks';
import SupportPageLayout from './SupportPageLayout';
import SupportStatus from './SupportStatus';
import { useSupportData } from './useSupportData';

class NoticeNotFoundError extends Error {}

const NoticeDetailPage = () => {
  const { noticeId } = useParams<{ noticeId: string }>();

  const loadNotice = useCallback(async () => {
    const id = Number(noticeId);
    if (!Number.isInteger(id) || id <= 0) throw new NoticeNotFoundError();
    try {
      return await fetchNotice(id);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new NoticeNotFoundError();
      }
      throw error;
    }
  }, [noticeId]);

  const { state, retry } = useSupportData(loadNotice);
  useDocumentTitle(state.status === 'success' ? state.data.title : '공지사항');

  return (
    <SupportPageLayout
      title="공지사항"
      backLink={{ to: '/notice', label: '공지사항' }}
    >
      {state.status === 'loading' ? (
        <SupportStatus kind="loading" />
      ) : state.status === 'error' ? (
        state.error instanceof NoticeNotFoundError ? (
          <SupportStatus
            kind="empty"
            message="공지를 찾을 수 없습니다."
            detail="삭제되었거나 주소가 잘못되었을 수 있습니다."
          />
        ) : (
          <SupportStatus kind="error" message={state.message} onRetry={retry} />
        )
      ) : (
        <article className="rounded-lg bg-white px-5 py-6 shadow-sm md:px-7">
          <header className="flex items-start gap-3 border-b border-[#191f28] pb-5">
            {state.data.pinned && (
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
                {state.data.title}
              </h2>
              <p className="mt-1.5 flex items-center gap-2 text-xs text-[#4e5968]">
                <span>{formatPublishedDate(state.data.publishedAt)}</span>
                <span className="rounded-sm bg-[#f2f4f6] px-1.5 py-0.5 text-[10px] font-bold text-[#6b7684]">
                  {NOTICE_CATEGORY_LABEL[state.data.category]}
                </span>
              </p>
            </div>
          </header>

          <p className="whitespace-pre-line py-6 text-sm leading-relaxed text-[#333d4b]">
            {state.data.content}
          </p>
        </article>
      )}
    </SupportPageLayout>
  );
};

export default NoticeDetailPage;
