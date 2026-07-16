import { useState } from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const Toggle = ({ checked, onChange, label }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
      checked ? 'bg-blue-600' : 'bg-[#d1d6db]'
    }`}
  >
    <span
      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
        checked ? 'left-[22px]' : 'left-0.5'
      }`}
    />
  </button>
);

const notificationItems = [
  { key: 'news', label: '실시간 뉴스 알림', desc: '상권 및 공실률 알림' },
  { key: 'comment', label: '커뮤니티 댓글 알림', desc: '내 글 댓글 및 반응' },
] as const;

type NotificationKey = (typeof notificationItems)[number]['key'];

interface NotificationSettingsProps {
  className?: string;
}

const NotificationSettings = ({
  className = '',
}: NotificationSettingsProps) => {
  const [enabled, setEnabled] = useState<Record<NotificationKey, boolean>>({
    news: true,
    comment: true,
  });

  return (
    <section
      className={`rounded-2xl border border-[#e5e8eb] bg-white px-6 py-6 ${className}`}
    >
      <h2 className="text-base font-extrabold text-[#191f28]">알림 설정</h2>

      <div className="mt-5 space-y-5">
        {notificationItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#191f28]">{item.label}</p>
              <p className="mt-0.5 text-xs font-medium text-gray-46">
                {item.desc}
              </p>
            </div>
            <Toggle
              checked={enabled[item.key]}
              onChange={() =>
                setEnabled((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
              }
              label={item.label}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default NotificationSettings;
