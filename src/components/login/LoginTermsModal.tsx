type RequiredTerms = {
  personalInfo: boolean;
  thirdParty: boolean;
};

interface LoginTermsModalProps {
  requiredTerms: RequiredTerms;
  onChangeTerms: (terms: RequiredTerms) => void;
  onSubmit: () => void;
  submitLabel?: string;
}

const termText =
  '서비스 이용 및 점포주 인증을 위해 필요한 약관 내용을 확인해주세요. 수집된 정보는 인증과 데이터 분석 목적 범위 안에서만 활용됩니다.';

const LoginTermsModal = ({
  requiredTerms,
  onChangeTerms,
  onSubmit,
  submitLabel = '로그인',
}: LoginTermsModalProps) => {
  const isAllRequiredChecked =
    requiredTerms.personalInfo && requiredTerms.thirdParty;

  const handleAllRequiredChange = (checked: boolean) => {
    onChangeTerms({
      personalInfo: checked,
      thirdParty: checked,
    });
  };

  return (
    <>
      <div className="mt-7 grid grid-cols-2 text-center text-sm font-medium text-[#191f28]">
        <button
          type="button"
          className="border-b-2 border-blue-600 pb-3"
          aria-current="page"
        >
          휴대폰 번호로 로그인
        </button>
        <button type="button" className="border-b border-[#e5e8eb] pb-3">
          소셜 계정으로 로그인
        </button>
      </div>

      <div className="mt-5 space-y-3">
        <div className="h-[124px] rounded-sm border border-[#d8dde5] px-4 py-6 text-sm leading-relaxed text-[#8b95a1]">
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
          <button type="button" className="font-bold text-blue-600">
            내용보기
          </button>
        </label>

        <div className="h-[124px] rounded-sm border border-[#d8dde5] px-4 py-6 text-sm leading-relaxed text-[#8b95a1]">
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
          <button type="button" className="font-bold text-blue-600">
            내용보기
          </button>
        </label>

        <label className="flex items-center gap-2 pt-2 text-sm font-extrabold text-[#191f28]">
          <input
            type="checkbox"
            checked={isAllRequiredChecked}
            onChange={(event) => handleAllRequiredChange(event.target.checked)}
            className="h-4 w-4 rounded border-[#d8dde5] accent-blue-600"
          />
          필수 약관에 모두 동의
        </label>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="mt-5 h-14 w-full rounded-md bg-blue-600 text-base font-extrabold text-white transition-colors hover:bg-[#1f6fe5]"
      >
        {submitLabel}
      </button>
    </>
  );
};

export default LoginTermsModal;
