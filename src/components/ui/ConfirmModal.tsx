import WarningIcon from '@/assets/icons/warning-icon.svg';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  /** 삭제처럼 되돌릴 수 없는 동작이면 확인 버튼을 붉게 표시한다 */
  isDestructive?: boolean;
  isPending?: boolean;
  /** 처리 실패 시 모달 안에 보여줄 문구 */
  errorMessage?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** 경고 아이콘 + 취소/확인 두 버튼으로 이뤄진 공통 확인 모달 */
const ConfirmModal = ({
  title,
  message,
  confirmLabel,
  isDestructive = false,
  isPending = false,
  errorMessage,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5"
    role="dialog"
    aria-modal="true"
    aria-label={title}
    onClick={isPending ? undefined : onCancel}
  >
    <section
      className="w-full max-w-[360px] rounded-lg bg-white p-6 shadow-[0_18px_60px_rgba(25,31,40,0.18)]"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center gap-2">
        <img src={WarningIcon} alt="" className="h-5 w-5" />
        <h2 className="text-lg font-extrabold text-[#191f28]">{title}</h2>
      </div>
      <p className="mt-3 whitespace-pre-line text-sm font-medium text-[#4e5968]">
        {message}
      </p>
      {errorMessage && (
        <p className="mt-3 text-sm font-medium text-[#e5484d]">
          {errorMessage}
        </p>
      )}
      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="h-11 rounded-md border border-[#d8dde5] text-sm font-bold text-[#4e5968] transition hover:bg-gray-500 disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className={`h-11 rounded-md text-sm font-bold text-white transition disabled:opacity-60 ${
            isDestructive
              ? 'bg-[#e5484d] hover:bg-[#d13438]'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isPending ? '처리 중...' : confirmLabel}
        </button>
      </div>
    </section>
  </div>
);

export default ConfirmModal;
