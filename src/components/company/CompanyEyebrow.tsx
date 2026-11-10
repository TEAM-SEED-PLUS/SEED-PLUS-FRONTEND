import type { ReactNode } from 'react';

interface CompanyEyebrowProps {
  children: ReactNode;
  /** 파란 배경 섹션 위에서는 밝은 톤을 쓴다 */
  tone?: 'primary' | 'onBlue';
  className?: string;
}

/** 섹션 제목 위의 짧은 선 + 영문 라벨 */
const CompanyEyebrow = ({
  children,
  tone = 'primary',
  className = '',
}: CompanyEyebrowProps) => (
  <p
    className={`flex items-center gap-[9px] text-[13px] font-extrabold tracking-[1.04px] ${
      tone === 'onBlue' ? 'text-[#b8d4ff]' : 'text-blue-600'
    } ${className}`}
  >
    <span aria-hidden className="h-0.5 w-[22px] rounded-sm bg-current" />
    {children}
  </p>
);

export default CompanyEyebrow;
