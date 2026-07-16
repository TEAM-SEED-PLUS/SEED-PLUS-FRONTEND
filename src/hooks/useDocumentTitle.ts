import { useEffect } from 'react';

const BASE_TITLE = 'SEED+';
const DEFAULT_TITLE = 'SEED+ | AI 기반 창업 상권 분석 플랫폼';

/**
 * 페이지별 브라우저 탭 제목을 설정한다.
 * title이 주어지면 `${title} | SEED+` 형태로, 없으면 기본 브랜드 제목을 노출한다.
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : DEFAULT_TITLE;
  }, [title]);
}
