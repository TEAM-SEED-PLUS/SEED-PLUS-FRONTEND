type FeedTab = {
  id: 'news' | 'community';
  label: string;
  icon: string;
};

interface FeedTabsProps {
  activeTab: FeedTab['id'];
  onChange: (tab: FeedTab['id']) => void;
}

const tabs: FeedTab[] = [
  { id: 'news', label: '뉴스', icon: '📰' },
  { id: 'community', label: '소통', icon: '💬' },
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
          <span>{tab.icon}</span>
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
