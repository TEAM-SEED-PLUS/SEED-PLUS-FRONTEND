import { useState } from 'react';
import SEEDPLUS from '@/assets/SEEDPLUS.svg';

const HeaderMLS = () => {
  const tabs = ['홈', '피드', '내 상가 만들어보기', '점포주 로그인'] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('홈');

  return (
    <header className="w-full h-14 bg-white flex justify-between items-center px-6 gap-8">
      <div>
        <img src={SEEDPLUS} alt="SEED+ 로고" />
      </div>
      <div className="flex w-full gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === tab
                ? 'bg-blue-300 text-blue-600 font-bold'
                : 'bg-transparent text-gray-46 hover:bg-gray-100 font-medium'
            }`}
            aria-pressed={activeTab === tab}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3">
        <input
          type="text"
          className="w-50 h-8.5 rounded-[20px] border border-[#e5e8eb] font-normal text-[13px] px-4.5 py-2 text-[#b0b8c1] bg-gray-500"
          placeholder="🔍 검색하세요"
        />
        <button className="w-18 h-8.5 px-4 py-2 text-[13px] font-bold bg-blue-600 text-white rounded-[20px]">
          로그인
        </button>
      </div>
    </header>
  );
};

export default HeaderMLS;
