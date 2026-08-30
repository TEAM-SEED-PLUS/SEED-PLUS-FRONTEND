// 화면에서 이모지를 걷어낸 자리를 채우는 아이콘 모음.
//
// [시안 아이콘]
// 디자이너가 Iconify에서 골라 쓴 아이콘들이라 세트가 하나가 아니다.
// Figma 레이어 이름이 곧 Iconify ID이고(예: 'mdi:heart'), 아래 path는
// 그 원본 geometry 그대로다. Figma export와 경로가 일치하는 것을 확인했다.
// 사용처를 바꿀 땐 Figma(fileKey 0LB7pAU3chrsJfnDTDjvf6)에서 레이어 이름을 먼저 볼 것.
//
// [자체 제작]
// 시안에 대응 아이콘이 없는 자리(피드 사이드바, 홈 팁, 랜딩 체크 등)는
// 기존 에셋(assets/weather/sun-03.svg)과 같은 Untitled UI 규격으로 그렸다.
//
// stroke/fill을 currentColor로 두어 감싼 요소의 text 색을 따라간다.
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

/** 선(stroke) 기반 아이콘 래퍼 */
const StrokeIcon = ({
  className = 'h-4 w-4',
  viewBox = '0 0 24 24',
  strokeWidth = 2,
  children,
  ...props
}: IconProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

/** 면(fill) 기반 아이콘 래퍼 */
const FillIcon = ({
  className = 'h-4 w-4',
  viewBox = '0 0 24 24',
  children,
  ...props
}: IconProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox={viewBox}
    fill="currentColor"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

/* ─────────────── 시안 아이콘 (Figma 레이어 = Iconify ID) ─────────────── */

/** 좋아요 — `mdi:heart` (시안은 채워진 하트) */
export const HeartIcon = (props: IconProps) => (
  <FillIcon {...props}>
    <path d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z" />
  </FillIcon>
);

/** 댓글 — `ant-design:comment-outlined` */
export const CommentIcon = (props: IconProps) => (
  <FillIcon viewBox="0 0 1024 1024" {...props}>
    <path d="M573 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40m-280 0c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40" />
    <path d="M894 345c-48.1-66-115.3-110.1-189-130v.1c-17.1-19-36.4-36.5-58-52.1c-163.7-119-393.5-82.7-513 81c-96.3 133-92.2 311.9 6 439l.8 132.6c0 3.2.5 6.4 1.5 9.4c5.3 16.9 23.3 26.2 40.1 20.9L309 806c33.5 11.9 68.1 18.7 102.5 20.6l-.5.4c89.1 64.9 205.9 84.4 313 49l127.1 41.4c3.2 1 6.5 1.6 9.9 1.6c17.7 0 32-14.3 32-32V753c88.1-119.6 90.4-284.9 1-408M323 735l-12-5l-99 31l-1-104l-8-9c-84.6-103.2-90.2-251.9-11-361c96.4-132.2 281.2-161.4 413-66c132.2 96.1 161.5 280.6 66 412c-80.1 109.9-223.5 150.5-348 102m505-17l-8 10l1 104l-98-33l-12 5c-56 20.8-115.7 22.5-171 7l-.2-.1C613.7 788.2 680.7 742.2 729 676c76.4-105.3 88.8-237.6 44.4-350.4l.6.4c23 16.5 44.1 37.1 62 62c72.6 99.6 68.5 235.2-8 330" />
    <path d="M433 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40" />
  </FillIcon>
);

/** 조회수 — `iconoir:eye` */
export const EyeIcon = (props: IconProps) => (
  <StrokeIcon strokeWidth={1.5} {...props}>
    <path d="M3 13c3.6-8 14.4-8 18 0" />
    <path d="M12 17a3 3 0 1 1 0-6a3 3 0 0 1 0 6" />
  </StrokeIcon>
);

/** 공유 — `boxicons:share-filled` */
export const ShareIcon = (props: IconProps) => (
  <FillIcon {...props}>
    <path d="M5.5 15.5c1.07 0 2.02-.5 2.67-1.26l6.87 3.87c-.01.13-.04.26-.04.39c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5s-1.57-3.5-3.5-3.5c-1.07 0-2.02.5-2.67 1.26l-6.87-3.87c.01-.13.04-.26.04-.39s-.02-.26-.04-.39l6.87-3.87C16.47 8.5 17.42 9 18.5 9C20.43 9 22 7.43 22 5.5S20.43 2 18.5 2S15 3.57 15 5.5c0 .13.02.26.04.39L8.17 9.76A3.48 3.48 0 0 0 5.5 8.5C3.57 8.5 2 10.07 2 12s1.57 3.5 3.5 3.5m13 1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5m0-13c.83 0 1.5.67 1.5 1.5S19.33 7 18.5 7S17 6.33 17 5.5S17.67 4 18.5 4m-13 6.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S4 12.83 4 12s.67-1.5 1.5-1.5" />
  </FillIcon>
);

/** 신고 — `material-symbols-light:siren-outline` */
export const SirenIcon = (props: IconProps) => (
  <FillIcon {...props}>
    <path d="M4.616 19h14.769q.269 0 .442-.173t.173-.442v-1.52q0-.269-.173-.442t-.443-.173H4.616q-.27 0-.443.173T4 16.866v1.518q0 .27.173.443t.443.173m4.057-6.058h1v-2.807q0-.952.684-1.63q.683-.678 1.643-.678v-1q-1.38 0-2.354.964q-.973.963-.973 2.344zM6.827 15.25h10.346v-5.115q0-2.152-1.514-3.644T11.997 5t-3.66 1.491t-1.51 3.644zM4.616 20q-.667 0-1.141-.475T3 18.386v-1.52q0-.666.475-1.14t1.14-.475h1.212v-5.115q0-2.564 1.797-4.35T12 4t4.376 1.786t1.797 4.349v5.115h1.212q.666 0 1.14.475t.475 1.14v1.52q0 .666-.475 1.14t-1.14.475z" />
  </FillIcon>
);

/** 삭제 — `weui:delete-outlined` */
export const TrashIcon = (props: IconProps) => (
  <FillIcon {...props}>
    <path
      fillRule="evenodd"
      d="m6.774 6.4l.812 13.648a.8.8 0 0 0 .798.752h7.232a.8.8 0 0 0 .798-.752L17.226 6.4zm11.655 0l-.817 13.719A2 2 0 0 1 15.616 22H8.384a2 2 0 0 1-1.996-1.881L5.571 6.4H3.5v-.7a.5.5 0 0 1 .5-.5h16a.5.5 0 0 1 .5.5v.7zM14 3a.5.5 0 0 1 .5.5v.7h-5v-.7A.5.5 0 0 1 10 3zM9.5 9h1.2l.5 9H10zm3.8 0h1.2l-.5 9h-1.2z"
    />
  </FillIcon>
);

/** 검색 — `material-symbols:search-rounded` */
export const SearchIcon = (props: IconProps) => (
  <FillIcon {...props}>
    <path d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
  </FillIcon>
);

/** 프로필 — `iconamoon:profile` */
export const ProfileIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    <circle cx="12" cy="7" r="3" strokeLinejoin="miter" />
  </StrokeIcon>
);

/* ─────────────── 자체 제작 (시안에 대응 아이콘 없음) ─────────────── */

export const ClockIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    <path d="M12 7v5l3 2" />
  </StrokeIcon>
);

export const RepeatIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M17 2l4 4-4 4" />
    <path d="M3 12v-2a4 4 0 0 1 4-4h14" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 12v2a4 4 0 0 1-4 4H3" />
  </StrokeIcon>
);

export const NewsIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M4 5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v14a1 1 0 0 0 1 1H5a1 1 0 0 1-1-1V5Z" />
    <path d="M17 9h2a1 1 0 0 1 1 1v9a1 1 0 0 1-2 0" />
    <path d="M7 8h7M7 12h7M7 16h4" />
  </StrokeIcon>
);

export const UsersIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <path d="M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
    <path d="M16 3.1a4 4 0 0 1 0 7.8" />
  </StrokeIcon>
);

export const BarChartIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z" />
    <path d="M8 16v-3M12 16v-6M16 16v-4" />
  </StrokeIcon>
);

export const ShoppingCartIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M2 3h2.2l2.3 11.4a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.6L21 7H5.2" />
    <path d="M10 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
    <path d="M19 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
  </StrokeIcon>
);

export const BellIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M18 9a6 6 0 1 0-12 0c0 6-3 7-3 7h18s-3-1-3-7Z" />
    <path d="M13.7 20a2 2 0 0 1-3.4 0" />
  </StrokeIcon>
);

export const PlayIcon = (props: IconProps) => (
  <FillIcon {...props}>
    <path d="M7 4.8v14.4a1 1 0 0 0 1.5.87l11.5-7.2a1 1 0 0 0 0-1.74L8.5 3.93A1 1 0 0 0 7 4.8Z" />
  </FillIcon>
);

export const StarIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.3l6.6-.9L12 2.5Z" />
  </StrokeIcon>
);

export const LightbulbIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M9 21h6" />
    <path d="M10 17.5h4" />
    <path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.6.4 1 1.1 1 1.9v.3h5.6v-.3c0-.8.4-1.5 1-1.9A6.5 6.5 0 0 0 12 2.5Z" />
  </StrokeIcon>
);

export const CalendarIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
    <path d="M8 3v4M16 3v4M4 11h16" />
  </StrokeIcon>
);

export const CheckIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M20 6L9 17l-5-5" />
  </StrokeIcon>
);

export const MobileIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
    <path d="M11 18.5h2" />
  </StrokeIcon>
);

/** 버튼 안에서 도는 로딩 스피너. prefers-reduced-motion이면 회전을 멈춘다. */
export const SpinnerIcon = ({ className = 'h-4 w-4', ...props }: IconProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    fill="none"
    className={`motion-safe:animate-spin ${className}`}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth={3}
      opacity={0.25}
    />
    <path
      d="M21 12a9 9 0 0 0-9-9"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
    />
  </svg>
);

export const MenuIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M4 7h12" />
    <path d="M4 12h9" />
    <path d="M4 17h12" />
  </StrokeIcon>
);
