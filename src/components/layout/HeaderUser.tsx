import { Link, useNavigate } from 'react-router-dom';
import SEEDPLUS from '@/assets/Logo/SEED+ LOGO.svg';
import { useAuth } from '@/auth';

type UserNav = 'home' | 'feed' | 'store';

interface HeaderUserProps {
  activeNav?: UserNav;
  onMenuClick?: () => void;
}

const navItems: { id: UserNav; label: string; to: string }[] = [
  { id: 'store', label: '내 상가 만들기', to: '/store-builder' },
];

const SearchIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const MenuIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M4 7h12" />
    <path d="M4 12h9" />
    <path d="M4 17h12" />
  </svg>
);

const HeaderUser = ({ activeNav = 'store', onMenuClick }: HeaderUserProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login');
    }
  };

  const authControl = isAuthenticated ? (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex h-9 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
    >
      로그아웃
    </button>
  ) : (
    <Link
      to="/login"
      className="inline-flex h-9 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
    >
      로그인
    </Link>
  );

  return (
    <header className="fixed left-0 top-0 z-30 h-[var(--header-height)] w-full border-b border-[#e5e8eb] bg-white">
      <div className="hidden h-full items-center justify-between px-5 md:flex">
        <Link to="/store-builder" className="flex w-[88px] items-center">
          <img src={SEEDPLUS} alt="SEED+" className="h-6" />
        </Link>

        <nav className="flex flex-1 items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                activeNav === item.id
                  ? 'text-blue-600'
                  : 'text-gray-46 hover:bg-gray-500'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <label className="flex h-9 w-64 items-center gap-2 rounded-full border border-[#e5e8eb] bg-gray-500 px-4 text-sm text-[#6b7684]">
            <input
              type="text"
              className="w-full bg-transparent outline-none placeholder:text-[#b0b8c1]"
              placeholder="검색어를 입력하세요"
            />
            <SearchIcon />
          </label>
          {authControl}
        </div>
      </div>

      <div className="grid h-full grid-cols-[44px_1fr_auto] items-center px-2 md:hidden">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="메뉴 열기"
          className="flex h-10 w-10 items-center justify-center rounded-md text-[#333d4b] transition hover:bg-gray-500"
        >
          <MenuIcon />
        </button>

        <Link
          to="/store-builder"
          className="flex items-center justify-center"
          aria-label="SEED+ 홈"
        >
          <img src={SEEDPLUS} alt="SEED+" className="h-5" />
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="검색"
            className="flex h-10 w-10 items-center justify-center rounded-md text-[#4e5968] transition hover:bg-gray-500"
          >
            <SearchIcon />
          </button>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-3 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              로그아웃
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-3 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderUser;
