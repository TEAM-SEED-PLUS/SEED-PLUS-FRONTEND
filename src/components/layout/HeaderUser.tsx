import { Link } from 'react-router-dom';
import SEEDPLUS from '@/assets/SEEDPLUS.png';

type UserNav = 'home' | 'feed' | 'store';

interface HeaderUserProps {
  activeNav?: UserNav;
}

const navItems: { id: UserNav; label: string; to: string }[] = [
  // { id: 'home', label: '홈', to: '/home' },
  // { id: 'feed', label: '피드', to: '/feed' },
  { id: 'store', label: '내 상가 만들기', to: '/store-builder' },
];

const HeaderUser = ({ activeNav = 'home' }: HeaderUserProps) => {
  return (
    <header className="fixed left-0 top-0 z-10 flex h-[var(--header-height)] w-full items-center justify-between border-b border-[#e5e8eb] bg-white px-5">
      <Link to="/" className="flex w-[88px] items-center">
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
        <label className="flex h-9 w-64 items-center rounded-full border border-[#e5e8eb] bg-gray-500 px-4 text-sm text-[#b0b8c1]">
          <input
            type="text"
            className="w-full bg-transparent outline-none placeholder:text-[#b0b8c1]"
            placeholder="검색어를 입력하세요"
          />
          🔍
        </label>
        <Link
          to="/login"
          className="inline-flex h-9 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-bold text-white"
        >
          로그인
        </Link>
      </div>
    </header>
  );
};

export default HeaderUser;
