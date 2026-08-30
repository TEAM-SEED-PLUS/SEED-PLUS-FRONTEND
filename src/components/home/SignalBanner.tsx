import { mockSignalBanner } from '@/api/homeMock';

/** 상단 실시간 상권 신호 배너 */
const SignalBanner = () => (
  <div className="flex flex-wrap items-center justify-center gap-2 bg-[#fff1f2] px-4 py-2 text-center">
    <span className="rounded-sm bg-[#e5484d] px-2 py-0.5 text-[11px] font-bold text-white">
      {mockSignalBanner.label}
    </span>
    <p className="text-xs font-medium text-[#e5484d]">
      {mockSignalBanner.message}
    </p>
    <span className="text-[11px] text-[#f1959b]">
      {mockSignalBanner.elapsed}
    </span>
  </div>
);

export default SignalBanner;
