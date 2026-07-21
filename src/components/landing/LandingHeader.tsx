import { Link } from 'react-router-dom';
import logoHeader from '@/assets/landing/logo-header.png';

const navItems = [
  { label: '서비스 소개', target: '#about' },
  { label: '이용 방법', target: '#usage' },
  { label: '활용 사례', target: '#reviews' },
];

const LandingHeader = () => {
  return (
    <header className="sticky top-0 z-50 h-[88px] w-full border-b border-[#f2f4f6] bg-white">
      <div className="mx-auto flex h-full w-full max-w-[1420px] items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-12">
          <Link
            to="/"
            aria-label="SEED+ 홈"
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img src={logoHeader} alt="SEED+" className="h-8 w-auto sm:h-10" />
          </Link>
          <nav className="hidden items-center gap-12 md:flex">
            {navItems.map((item) => (
              <a
                key={item.target}
                href={item.target}
                className="text-lg font-medium text-[#444444] transition-colors hover:text-blue-600"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90 sm:rounded-xl sm:px-7 sm:py-3 sm:text-lg"
          >
            로그인
          </Link>
          <Link
            to="/store-builder"
            className="rounded-lg border border-blue-600 bg-white px-3 py-2 text-xs font-semibold whitespace-nowrap text-[#191f28] transition-colors hover:bg-blue-300 sm:rounded-xl sm:px-7 sm:py-3 sm:text-lg"
          >
            비회원으로 둘러보기
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
