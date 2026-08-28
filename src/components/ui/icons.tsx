// 화면 곳곳에 이모지로 들어가 있던 자리를 대체하는 라인 아이콘 모음.
// 기존 에셋(assets/weather/sun-03.svg 등)과 같은 Untitled UI 규격을 따른다.
// - viewBox 24×24 / stroke-width 2 / linecap·linejoin round
// - stroke는 currentColor라 감싼 요소의 text 색을 그대로 따라간다
//   (탭 활성/비활성처럼 색이 바뀌는 자리에 필요해서 img가 아닌 인라인 SVG로 둔다)
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const Icon = ({ className = 'h-4 w-4', children, ...props }: IconProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

export const ClockIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

export const EyeIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M2.5 12S6.5 5.5 12 5.5 21.5 12 21.5 12 17.5 18.5 12 18.5 2.5 12 2.5 12Z" />
    <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </Icon>
);

export const MessageIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.5-8.5h.5a8.5 8.5 0 0 1 8 8v.5Z" />
  </Icon>
);

export const HeartIcon = ({
  filled = false,
  ...props
}: IconProps & { filled?: boolean }) => (
  <Icon fill={filled ? 'currentColor' : 'none'} {...props}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.9 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8Z" />
  </Icon>
);

export const ShareIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
    <path d="M16 6l-4-4-4 4" />
    <path d="M12 2v13" />
  </Icon>
);

export const FlagIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1Z" />
    <path d="M4 22v-7" />
  </Icon>
);

export const RepeatIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M17 2l4 4-4 4" />
    <path d="M3 12v-2a4 4 0 0 1 4-4h14" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 12v2a4 4 0 0 1-4 4H3" />
  </Icon>
);

export const NewsIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v14a1 1 0 0 0 1 1H5a1 1 0 0 1-1-1V5Z" />
    <path d="M17 9h2a1 1 0 0 1 1 1v9a1 1 0 0 1-2 0" />
    <path d="M7 8h7M7 12h7M7 16h4" />
  </Icon>
);

export const MarkerPinIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <path d="M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </Icon>
);

export const UsersIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <path d="M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
    <path d="M16 3.1a4 4 0 0 1 0 7.8" />
  </Icon>
);

export const BarChartIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z" />
    <path d="M8 16v-3M12 16v-6M16 16v-4" />
  </Icon>
);

export const ShoppingCartIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M2 3h2.2l2.3 11.4a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.6L21 7H5.2" />
    <path d="M10 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
    <path d="M19 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
  </Icon>
);

export const BellIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M18 9a6 6 0 1 0-12 0c0 6-3 7-3 7h18s-3-1-3-7Z" />
    <path d="M13.7 20a2 2 0 0 1-3.4 0" />
  </Icon>
);

export const PlayIcon = (props: IconProps) => (
  <Icon fill="currentColor" stroke="none" {...props}>
    <path d="M7 4.8v14.4a1 1 0 0 0 1.5.87l11.5-7.2a1 1 0 0 0 0-1.74L8.5 3.93A1 1 0 0 0 7 4.8Z" />
  </Icon>
);

export const StarIcon = ({
  filled = false,
  ...props
}: IconProps & { filled?: boolean }) => (
  <Icon fill={filled ? 'currentColor' : 'none'} {...props}>
    <path d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.3l6.6-.9L12 2.5Z" />
  </Icon>
);

export const LightbulbIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9 21h6" />
    <path d="M10 17.5h4" />
    <path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.6.4 1 1.1 1 1.9v.3h5.6v-.3c0-.8.4-1.5 1-1.9A6.5 6.5 0 0 0 12 2.5Z" />
  </Icon>
);

export const CalendarIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
    <path d="M8 3v4M16 3v4M4 11h16" />
  </Icon>
);

export const CheckIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 6L9 17l-5-5" />
  </Icon>
);

export const MobileIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
    <path d="M11 18.5h2" />
  </Icon>
);
