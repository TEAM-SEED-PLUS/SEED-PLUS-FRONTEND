import type { CSSProperties, ReactNode } from 'react';

interface ScaledArtProps {
  /** 시안 기준 원본 크기(px) */
  width: number;
  height: number;
  /** 배율은 `[--art-scale:0.5] md:[--art-scale:1]`처럼 클래스로 넘긴다 */
  className?: string;
  children: ReactNode;
}

/**
 * 시안의 px 좌표로 짠 일러스트를 통째로 축소해 좁은 화면에 맞춘다.
 * transform은 자리를 줄여주지 않으므로 바깥 상자가 축소된 크기만큼만 자리를 차지한다.
 */
const ScaledArt = ({
  width,
  height,
  className = '',
  children,
}: ScaledArtProps) => (
  <div
    className={`relative shrink-0 ${className}`}
    style={
      {
        width: `calc(${width}px * var(--art-scale))`,
        height: `calc(${height}px * var(--art-scale))`,
      } as CSSProperties
    }
  >
    <div
      className="absolute top-0 left-0 origin-top-left"
      style={{ width, height, transform: 'scale(var(--art-scale))' }}
    >
      {children}
    </div>
  </div>
);

export default ScaledArt;
