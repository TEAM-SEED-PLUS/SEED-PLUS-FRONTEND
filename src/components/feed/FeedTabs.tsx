import type { ReactElement } from 'react';
import { CommentIcon, NewsIcon } from '@/components/ui/icons';

type FeedTab = {
  id: 'news' | 'community';
  label: string;
  Icon: (props: { className?: string }) => ReactElement;
};

interface FeedTabsProps {
  activeTab: FeedTab['id'];
  onChange: (tab: FeedTab['id']) => void;
}

const tabs: FeedTab[] = [
  { id: 'news', label: '뉴스', Icon: NewsIcon },
  { id: 'community', label: '소통', Icon: CommentIcon },
];

const FeedTabs = ({ activeTab, onChange }: FeedTabsProps) => {
  return (
    <div className="flex border-b border-[#e5e8eb]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`relative flex h-12 items-center gap-2 px-7 text-sm font-bold transition-colors ${
            activeTab === tab.id ? 'text-blue-600' : 'text-gray-46'
          }`}
        >
          <tab.Icon className="h-4 w-4" />
          <span>{tab.label}</span>
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-blue-600" />
          )}
        </button>
      ))}
    </div>
  );
};

export default FeedTabs;
