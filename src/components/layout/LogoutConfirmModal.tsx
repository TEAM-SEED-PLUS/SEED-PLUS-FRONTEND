import WarningIcon from '@/assets/icons/warning-icon.svg';

interface LogoutConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmModal = ({
  onConfirm,
  onCancel,
}: LogoutConfirmModalProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5"
    role="dialog"
    aria-modal="true"
    aria-label="로그아웃 확인"
    onClick={onCancel}
  >
    <section
      className="w-full max-w-[360px] rounded-lg bg-white p-6 shadow-[0_18px_60px_rgba(25,31,40,0.18)]"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center gap-2">
        <img src={WarningIcon} alt="" className="h-5 w-5" />
        <h2 className="text-lg font-extrabold text-[#191f28]">로그아웃</h2>
      </div>
      <p className="mt-3 text-sm font-medium text-[#4e5968]">
        정말 로그아웃 하시겠습니까?
      </p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-md border border-[#d8dde5] text-sm font-bold text-[#4e5968] transition hover:bg-gray-500"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="h-11 rounded-md bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          로그아웃
        </button>
      </div>
    </section>
  </div>
);

export default LogoutConfirmModal;
