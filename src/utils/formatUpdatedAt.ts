// 최신화 시각 표기 규칙
// - 24시간 이내: 상대 시간 (예: '방금 전 업데이트', '15분 전 업데이트', '3시간 전 업데이트')
// - 24시간 경과: 절대 날짜 (예: '최신화: 2026.07.10 19:25')
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const HOUR_IN_MS = 60 * 60 * 1000;
const MINUTE_IN_MS = 60 * 1000;

const pad = (value: number) => String(value).padStart(2, '0');

const toAbsolute = (date: Date) =>
  `최신화: ${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;

/**
 * ISO 문자열을 최신화 표기 문구로 변환한다.
 * 값이 없거나 파싱할 수 없으면 빈 문자열을 반환해 호출부에서 표기를 생략할 수 있게 한다.
 */
export const formatUpdatedAt = (
  value?: string | null,
  now: Date = new Date()
) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const diff = now.getTime() - date.getTime();

  // 미래 시각(서버-클라이언트 시계 차이 등)은 '방금 전'으로 처리한다.
  if (diff < MINUTE_IN_MS) {
    return '방금 전 업데이트';
  }

  if (diff < HOUR_IN_MS) {
    return `${Math.floor(diff / MINUTE_IN_MS)}분 전 업데이트`;
  }

  if (diff < DAY_IN_MS) {
    return `${Math.floor(diff / HOUR_IN_MS)}시간 전 업데이트`;
  }

  return toAbsolute(date);
};
