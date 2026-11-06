import { SpinnerIcon } from '@/components/ui/icons';

type SupportStatusProps =
  | { kind: 'loading' }
  | { kind: 'error'; message: string; onRetry: () => void }
  | { kind: 'empty'; message: string; detail?: string };

/** 공지·FAQ 목록 자리에서 로딩·오류·빈 상태를 보여준다 */
const SupportStatus = (props: SupportStatusProps) => (
  <div
    role={props.kind === 'error' ? 'alert' : 'status'}
    className="flex flex-col items-center gap-3 rounded-lg bg-white px-5 py-16 text-center shadow-sm"
  >
    {props.kind === 'loading' ? (
      <>
        <SpinnerIcon className="h-8 w-8 text-blue-600" />
        <p className="text-sm text-gray-46">불러오는 중입니다.</p>
      </>
    ) : props.kind === 'error' ? (
      <>
        <p className="text-sm font-bold text-[#191f28]">{props.message}</p>
        <button
          type="button"
          onClick={props.onRetry}
          className="h-9 rounded-md border border-[#d8dde5] px-4 text-xs font-bold text-[#4e5968] transition hover:border-blue-600 hover:text-blue-600"
        >
          다시 시도
        </button>
      </>
    ) : (
      <>
        <p className="text-sm font-bold text-[#191f28]">{props.message}</p>
        {props.detail && <p className="text-xs text-gray-46">{props.detail}</p>}
      </>
    )}
  </div>
);

export default SupportStatus;
