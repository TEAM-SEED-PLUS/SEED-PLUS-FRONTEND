import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEEDPLUS from '@/assets/Logo/SEED+ LOGO.svg';
import { MenuIcon, ProfileIcon, SearchIcon } from '@/components/ui/icons';
import { useAuth } from '@/auth';
import LogoutConfirmModal from './LogoutConfirmModal';

type UserNav = 'home' | 'feed' | 'store';

interface HeaderUserProps {
  activeNav?: UserNav;
  onMenuClick?: () => void;
}

const navItems: {
  id: UserNav;
  label: string;
  to: string;
  /** 로그인 회원에게만 노출할 메뉴 (내 상가 만들기는 로그인 가드가 있다) */
  requiresAuth?: boolean;
}[] = [
  { id: 'home', label: '홈', to: '/home' },
  {
    id: 'store',
    label: '내 상가 만들기',
    to: '/store-builder',
    requiresAuth: true,
  },
];

const HeaderUser = ({ activeNav, onMenuClick }: HeaderUserProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const logoTarget = isAuthenticated ? '/store-builder' : '/';
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setIsLogoutConfirmOpen(false);
      navigate('/login');
    }
  };

  const authControl = isAuthenticated ? (
    <button
      type="button"
      onClick={() => setIsLogoutConfirmOpen(true)}
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
    <>
      <header className="fixed left-0 top-0 z-30 h-[var(--header-height)] w-full border-b border-[#e5e8eb] bg-white">
        <div className="hidden h-full items-center justify-between px-5 md:flex">
          <Link to={logoTarget} className="flex w-[88px] items-center">
            <img src={SEEDPLUS} alt="SEED+" className="h-6" />
          </Link>

          <nav className="flex flex-1 items-center gap-1">
            {navItems
              .filter((item) => !item.requiresAuth || isAuthenticated)
              .map((item) => (
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
            {isAuthenticated && (
              <label className="flex h-9 w-64 items-center gap-2 rounded-full border border-[#e5e8eb] bg-gray-500 px-4 text-sm text-[#6b7684]">
                <input
                  type="text"
                  className="w-full bg-transparent outline-none placeholder:text-[#b0b8c1]"
                  placeholder="검색어를 입력하세요"
                />
                <SearchIcon className="h-5 w-5" />
              </label>
            )}
            {isAuthenticated && (
              <Link
                to="/mypage"
                aria-label="마이페이지"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#4e5968] transition hover:bg-gray-500 hover:text-blue-600"
              >
                <ProfileIcon className="h-5 w-5" />
              </Link>
            )}
            {authControl}
          </div>
        </div>

        <div className="relative flex h-full items-center justify-between px-2 md:hidden">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="메뉴 열기"
            className="flex h-10 w-10 items-center justify-center rounded-md text-[#333d4b] transition hover:bg-gray-500"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <Link
            to={logoTarget}
            className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center"
            aria-label="SEED+ 홈"
          >
            <img src={SEEDPLUS} alt="SEED+" className="h-5" />
          </Link>

          <div className="flex items-center gap-1">
            {isAuthenticated && (
              <button
                type="button"
                aria-label="검색"
                className="flex h-10 w-10 items-center justify-center rounded-md text-[#4e5968] transition hover:bg-gray-500"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
            )}
            {isAuthenticated && (
              <Link
                to="/mypage"
                aria-label="마이페이지"
                className="flex h-10 w-10 items-center justify-center rounded-md text-[#4e5968] transition hover:bg-gray-500"
              >
                <ProfileIcon className="h-5 w-5" />
              </Link>
            )}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(true)}
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
      {isLogoutConfirmOpen && (
        <LogoutConfirmModal
          onConfirm={handleLogout}
          onCancel={() => setIsLogoutConfirmOpen(false)}
        />
      )}
    </>
  );
};

export default HeaderUser;
