type RequiredTerms = {
  personalInfo: boolean;
  thirdParty: boolean;
};

interface SignupTermsModalProps {
  requiredTerms: RequiredTerms;
  onChangeTerms: (terms: RequiredTerms) => void;
  onClose: () => void;
}

const termText =
  '서비스 이용 및 점포주 인증을 위해 필요한 약관 내용을 확인해주세요. 수집된 정보는 인증과 데이터 분석 목적 범위 안에서만 활용됩니다.';

const SignupTermsModal = ({
  requiredTerms,
  onChangeTerms,
  onClose,
}: SignupTermsModalProps) => {
  const isAllRequiredChecked =
    requiredTerms.personalInfo && requiredTerms.thirdParty;

  const handleAllRequiredChange = (checked: boolean) => {
    onChangeTerms({
      personalInfo: checked,
      thirdParty: checked,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5"
      role="dialog"
      aria-modal="true"
      aria-label="약관 동의"
      onClick={onClose}
    >
      <section
        className="max-h-[85vh] w-full max-w-[480px] overflow-y-auto rounded-lg bg-white p-6 shadow-[0_18px_60px_rgba(25,31,40,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#191f28]">약관 동의</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 items-center justify-center rounded-full text-xl font-light text-[#6b7684] transition hover:bg-[#f2f4f6] hover:text-[#191f28]"
          >
            ×
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-sm border border-[#d8dde5] px-4 py-5 text-sm leading-relaxed text-[#8b95a1]">
            <p>{termText}</p>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#191f28]">
            <input
              type="checkbox"
              checked={requiredTerms.personalInfo}
              onChange={(event) =>
                onChangeTerms({
                  ...requiredTerms,
                  personalInfo: event.target.checked,
                })
              }
              className="h-4 w-4 rounded border-[#d8dde5] accent-blue-600"
            />
            <span>개인정보 수집·이용 동의 (점포주 인증)</span>
          </label>

          <div className="rounded-sm border border-[#d8dde5] px-4 py-5 text-sm leading-relaxed text-[#8b95a1]">
            <p>{termText}</p>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#191f28]">
            <input
              type="checkbox"
              checked={requiredTerms.thirdParty}
              onChange={(event) =>
                onChangeTerms({
                  ...requiredTerms,
                  thirdParty: event.target.checked,
                })
              }
              className="h-4 w-4 rounded border-[#d8dde5] accent-blue-600"
            />
            <span>개인정보 제3자 제공 동의 (데이터 분석)</span>
          </label>

          <label className="flex items-center gap-2 pt-2 text-sm font-extrabold text-[#191f28]">
            <input
              type="checkbox"
              checked={isAllRequiredChecked}
              onChange={(event) =>
                handleAllRequiredChange(event.target.checked)
              }
              className="h-4 w-4 rounded border-[#d8dde5] accent-blue-600"
            />
            필수 약관에 모두 동의
          </label>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-12 w-full rounded-md bg-blue-600 text-base font-extrabold text-white transition-colors hover:bg-[#1f6fe5]"
        >
          확인
        </button>
      </section>
    </div>
  );
};

export default SignupTermsModal;
