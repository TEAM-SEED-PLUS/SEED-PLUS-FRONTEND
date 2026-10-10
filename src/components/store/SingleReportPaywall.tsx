interface SingleReportPaywallProps {
  onConfirm: () => void;
}

/**
 * 생존율 상세 잠금 안내 (Figma '단건 결제' 팝업).
 * 블러 처리된 결과 영역 위에 띄우며, [확인]은 단건 결제 화면으로 보낸다.
 */
const SingleReportPaywall = ({ onConfirm }: SingleReportPaywallProps) => (
  <div className="absolute inset-0 z-10 flex items-start justify-center px-2 pt-16">
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="single-report-paywall-title"
      className="w-full max-w-[400px] rounded-lg border border-[#e5e8eb] bg-white p-7 shadow-[0_18px_60px_rgba(25,31,40,0.18)]"
    >
      <h3
        id="single-report-paywall-title"
        className="border-b border-[#e5e8eb] pb-4 text-xl font-extrabold text-[#191f28]"
      >
        안내
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-[#333d4b]">
        이 화면은 단건 결제 진행 시 확인하실 수 있습니다!
        <br />
        단건 결제는 9,000원으로, 잠금 해제 시 해당 상가에 대한 정보를 PDF로
        저장하실 수 있습니다.
      </p>
      <button
        type="button"
        onClick={onConfirm}
        className="mt-6 h-12 w-full rounded-md bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700"
      >
        확인
      </button>
    </section>
  </div>
);

export default SingleReportPaywall;
