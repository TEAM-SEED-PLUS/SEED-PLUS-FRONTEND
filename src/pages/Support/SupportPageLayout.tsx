import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import SEEDPLUS from '@/assets/Logo/SEED+ LOGO.svg';
import { AppFooter } from '@/components/layout';

interface SupportPageLayoutProps {
  title: string;
  /** 제목 위 보조 이동 버튼 (예: 공지 상세의 '← 공지사항') */
  backLink?: { to: string; label: string };
  /** 제목 아래에 두는 보조 요소 (카테고리 칩 등) */
  toolbar?: ReactNode;
  /** 시안의 최대 폭. 공지·문의는 좁게, FAQ 두 칼럼은 넓게 쓴다. */
  width?: 'narrow' | 'wide';
  children: ReactNode;
}

/**
 * 고객 지원(공지사항·FAQ·문의하기) 공통 틀.
 * 기획상 서비스와 분리된 독립 페이지라 서비스 헤더 대신 시안의 간단한 헤더를 쓰고,
 * '← SEED+ 홈으로 돌아가기'는 랜딩(/)으로 보낸다. 브라우저 뒤로가기는 기본 동작을 유지한다.
 */
const SupportPageLayout = ({
  title,
  backLink,
  toolbar,
  width = 'narrow',
  children,
}: SupportPageLayoutProps) => (
  <div className="flex min-h-screen flex-col bg-gray-500">
    <header className="border-b border-[#e5e8eb] bg-white">
      <div className="flex h-[var(--header-height)] items-center justify-between px-5">
        <Link to="/" aria-label="SEED+ 홈" className="flex items-center">
          <img src={SEEDPLUS} alt="SEED+" className="h-6" />
        </Link>
        <Link
          to="/"
          className="inline-flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          ← SEED+ 홈으로 돌아가기
        </Link>
      </div>
    </header>

    <main
      className={`mx-auto w-full flex-1 px-5 pb-16 pt-6 lg:px-8 ${
        width === 'wide' ? 'max-w-[1500px]' : 'max-w-[860px]'
      }`}
    >
      {backLink && (
        <Link
          to={backLink.to}
          className="mb-3 inline-block text-sm font-bold text-blue-600 hover:underline"
        >
          ← {backLink.label}
        </Link>
      )}
      <h1 className="text-xl font-extrabold text-[#191f28]">{title}</h1>
      {toolbar && <div className="mt-4">{toolbar}</div>}
      <div className="mt-5">{children}</div>
    </main>

    <AppFooter />
  </div>
);

export default SupportPageLayout;
