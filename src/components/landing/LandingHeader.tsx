import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import logoHeader from '@/assets/landing/logo-header.png';

const navItems = [
  { label: '서비스 소개', target: '#about' },
  { label: '이용 방법', target: '#usage' },
  { label: '활용 사례', target: '#reviews' },
];

const LandingHeader = () => {
  const navigate = useNavigate();
  const { status } = useAuth();
  const isAuthenticated = status === 'authenticated';
  // 회사 소개 페이지도 이 헤더를 쓴다. 섹션 이동·로고 동작이 랜딩 안/밖에서 다르다.
  const isLanding = useLocation().pathname === '/';
  const navLinkClass =
    'text-lg font-medium text-[#444444] transition-colors hover:text-blue-600';

  return (
    <header className="sticky top-0 z-50 h-[88px] w-full border-b border-[#f2f4f6] bg-white">
      <div className="mx-auto flex h-full w-full max-w-[1420px] items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-12">
          <Link
            to="/"
            aria-label={isAuthenticated ? '상권날씨로 이동' : 'SEED+ 홈'}
            onClick={(event) => {
              // 로그인 사용자는 서비스(상권날씨)로, 비회원은 랜딩 맨 위로 보낸다.
              if (isAuthenticated) {
                event.preventDefault();
                navigate('/weather');
                return;
              }
              if (isLanding) {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
              }
              // 다른 페이지에서 랜딩으로 넘어갈 때는 이전 스크롤 위치가 남지 않게 한다.
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          >
            <img src={logoHeader} alt="SEED+" className="h-8 w-auto sm:h-10" />
          </Link>
          <nav className="hidden items-center gap-12 md:flex">
            {navItems.map((item) =>
              isLanding ? (
                <a
                  key={item.target}
                  href={item.target}
                  className={navLinkClass}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.target}
                  to={`/${item.target}`}
                  className={navLinkClass}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {/*
            로그인 버튼은 로그인 여부와 무관하게 항상 보여준다(확인을 기다리느라 늦게 뜨지 않게).
            이미 로그인한 사용자는 /login이 로그인 화면을 건너뛰고 상권날씨로 보낸다.
          */}
          <Link
            to={isAuthenticated ? '/weather' : '/login'}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90 sm:rounded-xl sm:px-7 sm:py-3 sm:text-lg"
          >
            로그인
          </Link>
          {/*
            비회원 둘러보기 진입점.
            내 상가 만들기(/store-builder)는 BUILDER 명세 BLD-09에 따라 비회원 조회가
            막혀 있어, 이 버튼을 그리로 보내면 곧바로 /login으로 튕겨 '로그인' 버튼과
            동작이 같아진다. 그래서 비회원에게 열려 있는 홈으로 보낸다.

            다만 홈이 아직 mock 데이터라 프로덕션에서는 홈 탭과 함께 감춰둔다.
            둘은 같은 플래그로 묶여 있어 한 번에 되살아난다.
          */}
          {FEATURE_FLAGS.HOME_TAB && (
            <Link
              to="/home"
              className="rounded-lg border border-blue-600 bg-white px-3 py-2 text-xs font-semibold whitespace-nowrap text-[#191f28] transition-colors hover:bg-blue-300 sm:rounded-xl sm:px-7 sm:py-3 sm:text-lg"
            >
              비회원으로 둘러보기
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
