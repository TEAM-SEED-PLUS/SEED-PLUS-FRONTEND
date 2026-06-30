import { useEffect } from 'react';

const BASE_TITLE = 'SEED+';

/**
 * 페이지별 브라우저 탭 제목을 설정한다.
 * title이 주어지면 `${title} | SEED+` 형태로, 없으면 브랜드명만 노출한다.
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
  }, [title]);
}
