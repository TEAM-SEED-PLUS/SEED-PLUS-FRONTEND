const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** 작성 시각을 YYYY.MM.DD(한국 시간)로 표시한다 */
export const formatCommunityDate = (iso: string) => {
  const parts = dateFormatter.formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}.${get('month')}.${get('day')}`;
};

// 시안의 아바타 색(파랑·보라·검정)을 작성자별로 고정해 돌려 쓴다.
const AVATAR_COLORS = ['bg-blue-600', 'bg-[#9333ea]', 'bg-black'];

export const avatarColorClass = (userId: number) =>
  AVATAR_COLORS[Math.abs(userId) % AVATAR_COLORS.length];
