interface ProfileSummaryCardProps {
  name: string;
  initial: string;
  savedCount: number;
  postCount: number;
  activityScore: number;
  className?: string;
}

const ProfileSummaryCard = ({
  name,
  initial,
  savedCount,
  postCount,
  activityScore,
  className = '',
}: ProfileSummaryCardProps) => {
  const stats = [
    { label: '저장 상가', value: `${savedCount}` },
    { label: '작성 글', value: `${postCount}` },
    { label: '활동 점수', value: `${activityScore}%` },
  ];

  return (
    <section
      className={`rounded-2xl bg-gradient-to-br from-blue-600 to-[#1b64da] px-6 py-6 text-white ${className}`}
    >
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
