interface NoticeModalProps {
  message: string;
  onClose: () => void;
}

/** 시안의 '안내' 팝업 — 제목 + 안내 문구 + [확인] 한 버튼 */
const NoticeModal = ({ message, onClose }: NoticeModalProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5"
    role="dialog"
    aria-modal="true"
    aria-labelledby="notice-modal-title"
    onClick={onClose}
  >
    <section
      className="w-full max-w-[400px] rounded-lg bg-white p-7 shadow-[0_18px_60px_rgba(25,31,40,0.18)]"
      onClick={(event) => event.stopPropagation()}
    >
      <h2
        id="notice-modal-title"
        className="border-b border-[#e5e8eb] pb-4 text-xl font-extrabold text-[#191f28]"
      >
        안내
      </h2>
      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[#333d4b]">
        {message}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 h-12 w-full rounded-md bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700"
      >
        확인
      </button>
    </section>
  </div>
);

export default NoticeModal;
