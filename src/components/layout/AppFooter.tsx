import { Link } from 'react-router-dom';

interface AppFooterProps {
  /** 고정 사이드바가 있는 화면에서 좌측 여백을 맞출 때 사용한다 (예: 'lg:ml-59') */
  className?: string;
}

/**
 * 로그인 이후 화면 공통 푸터.
 * 개인정보처리방침은 정보주체가 언제든 확인할 수 있어야 하므로(개인정보 보호법 제30조)
 * 랜딩뿐 아니라 서비스 내 모든 화면에서 닿을 수 있게 둔다.
 */
const AppFooter = ({ className = '' }: AppFooterProps) => (
  <footer
    className={`border-t border-[#e5e8eb] bg-white px-5 py-6 lg:px-8 ${className}`}
  >
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 text-xs text-gray-46 md:flex-row md:items-center md:justify-between">
      <p>© 2026 주식회사 스페이로. All rights reserved.</p>
      <nav className="flex items-center gap-4">
        <Link
          to="/terms"
          className="font-medium transition hover:text-blue-600"
        >
          이용약관
        </Link>
        <Link
          to="/privacy"
          className="font-bold transition hover:text-blue-600"
        >
          개인정보처리방침
        </Link>
      </nav>
    </div>
  </footer>
);

export default AppFooter;
