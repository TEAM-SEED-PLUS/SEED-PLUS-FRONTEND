import type { ReactNode } from 'react';
import { AppFooter, HeaderUser } from '@/components/layout';

interface SupportPageLayoutProps {
  title: string;
  /** 제목 오른쪽·아래에 두는 보조 요소 (카테고리 칩 등) */
  toolbar?: ReactNode;
  /** 시안의 최대 폭. 공지·문의는 좁게, FAQ 두 칼럼은 넓게 쓴다. */
  width?: 'narrow' | 'wide';
  children: ReactNode;
}

/** 고객 지원(공지사항·FAQ·문의하기) 공통 틀. 법적 문서 페이지와 같은 헤더·푸터를 쓴다. */
const SupportPageLayout = ({
  title,
  toolbar,
  width = 'narrow',
  children,
}: SupportPageLayoutProps) => (
  <div className="flex min-h-screen flex-col bg-gray-500">
    <HeaderUser />

    <main
      className={`mx-auto w-full flex-1 px-5 pb-16 pt-[calc(var(--header-height)+24px)] lg:px-8 ${
        width === 'wide' ? 'max-w-[1500px]' : 'max-w-[860px]'
      }`}
    >
      <h1 className="text-xl font-extrabold text-[#191f28]">{title}</h1>
      {toolbar && <div className="mt-4">{toolbar}</div>}
      <div className="mt-5">{children}</div>
    </main>

    <AppFooter />
  </div>
);

export default SupportPageLayout;
