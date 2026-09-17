import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AppFooter, HeaderUser } from '@/components/layout';

interface LegalPageLayoutProps {
  title: string;
  effectiveDate: string;
  intro?: string[];
  /** 문서 간 이동 링크 (예: 개인정보처리방침 ↔ 이용약관) */
  counterpart: { to: string; label: string };
  children: ReactNode;
}

const LegalPageLayout = ({
  title,
  effectiveDate,
  intro,
  counterpart,
  children,
}: LegalPageLayoutProps) => (
  <div className="flex min-h-screen flex-col bg-gray-500">
    <HeaderUser />

    <main className="mx-auto w-full max-w-[860px] flex-1 px-5 pb-16 pt-[calc(var(--header-height)+32px)] lg:px-8">
      <header>
        <h1 className="text-2xl font-extrabold text-[#191f28]">{title}</h1>
        <p className="mt-2 text-xs font-medium text-gray-46">
          시행일: {effectiveDate}
        </p>
      </header>

      {intro && intro.length > 0 && (
        <div className="mt-5 rounded-lg border border-[#d8dde5] bg-white p-5">
          {intro.map((text) => (
            <p
              key={text}
              className="mt-2 text-sm leading-relaxed text-[#4e5968] first:mt-0"
            >
              {text}
            </p>
          ))}
        </div>
      )}

      <div className="mt-5 rounded-lg border border-[#d8dde5] bg-white p-5 md:p-7">
        {children}
      </div>

      <div className="mt-6 text-center">
        <Link
          to={counterpart.to}
          className="text-sm font-bold text-blue-600 hover:underline"
        >
          {counterpart.label} 보기
        </Link>
      </div>
    </main>

    <AppFooter />
  </div>
);

export default LegalPageLayout;
