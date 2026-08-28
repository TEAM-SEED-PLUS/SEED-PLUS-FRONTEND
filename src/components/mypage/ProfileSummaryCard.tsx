interface ProfileSummaryCardProps {
  name: string;
  initial: string;
  savedCount: number;
  postCount: number;
  /** 산출 기준이 정해지기 전까지는 null을 넘겨 '-'로 표기한다. */
  activityScore: number | null;
  className?: string;
  onSettingsClick?: () => void;
}

const SettingsIcon = () => (
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
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ProfileSummaryCard = ({
  name,
  initial,
  savedCount,
  postCount,
  activityScore,
  className = '',
  onSettingsClick,
}: ProfileSummaryCardProps) => {
  const stats = [
    { label: '저장 상가', value: `${savedCount}` },
    { label: '작성 글', value: `${postCount}` },
    {
      label: '활동 점수',
      value: activityScore === null ? '-' : `${activityScore}%`,
    },
  ];

  return (
    <section
      className={`relative rounded-2xl bg-gradient-to-br from-blue-600 to-[#1b64da] px-6 py-6 text-white ${className}`}
    >
      {onSettingsClick && (
        <button
          type="button"
          onClick={onSettingsClick}
          aria-label="설정"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/20 hover:text-white"
        >
          <SettingsIcon />
        </button>
      )}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl font-extrabold">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-extrabold">{name} 님</p>
          <p className="mt-0.5 text-xs font-medium text-white/80">
            성공적인 상권 분석을 시작해보세요
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-xl font-extrabold">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-white/80">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfileSummaryCard;
