interface SkeletonProps {
  /** 크기·모양은 호출부에서 Tailwind 클래스로 지정한다. */
  className?: string;
  /** 어두운 배경(파란 결과 카드 등) 위에 올릴 때 */
  tone?: 'light' | 'onDark';
}

/**
 * 로딩 중 자리를 채우는 회색 블록.
 *
 * 값이 '아직 없음'인 상태와 '불러오는 중'을 구분하기 위한 것이라,
 * 계산 전 '?' 표기(SVC-02)를 대체하지 않는다. 계산이 실제로 돌고 있는
 * 동안에만 쓴다.
 *
 * prefers-reduced-motion에서는 깜빡임을 멈추고 정적인 블록으로 남는다.
 */
const Skeleton = ({ className = '', tone = 'light' }: SkeletonProps) => (
  <span
    aria-hidden="true"
    className={`block rounded motion-safe:animate-pulse ${
      tone === 'onDark' ? 'bg-white/25' : 'bg-[#e5e8eb]'
    } ${className}`}
  />
);

export default Skeleton;
