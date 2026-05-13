import { useState } from 'react';

const LoginPage = () => {
  const [requiredTerms, setRequiredTerms] = useState({
    personalInfo: true,
    thirdParty: true,
  });

  const isAllRequiredChecked =
    requiredTerms.personalInfo && requiredTerms.thirdParty;

  const handleAllRequiredChange = (checked: boolean) => {
    setRequiredTerms({
      personalInfo: checked,
      thirdParty: checked,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-500 px-6">
      <main className="w-full max-w-[470px] rounded-lg border border-[#d8dde5] bg-white px-5 py-6">
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-[#191f28]">
            점포주 로그인
          </h1>
          <p className="mt-5 text-xs font-medium text-[#4e5968]">
            내 점포 데이터를 관리하고 스마트하게 운영하세요
          </p>
        </div>

        <div className="mt-7 border-b-2 border-blue-600 pb-3 text-center text-xs font-medium text-[#191f28]">
          휴대폰 번호로 로그인
        </div>

        <form className="mt-4">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-gray-46">
              이름
            </span>
            <input
              type="text"
              placeholder="이름을 입력해주세요."
              className="h-11 w-full rounded-sm border border-[#d8dde5] px-3 text-xs outline-none placeholder:text-[#b0b8c1] focus:border-blue-600"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-medium text-gray-46">
              생년월일
            </span>
            <input
              type="text"
              placeholder="ex) 900101"
              className="h-11 w-full rounded-sm border border-[#d8dde5] px-3 text-xs outline-none placeholder:text-[#b0b8c1] focus:border-blue-600"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-medium text-gray-46">
              휴대폰 번호
            </span>
            <input
              type="tel"
              placeholder="ex) 01000000000"
              className="h-11 w-full rounded-sm border border-[#d8dde5] px-3 text-xs outline-none placeholder:text-[#b0b8c1] focus:border-blue-600"
            />
          </label>

          <label className="mt-4 flex items-center gap-1.5 text-xs font-extrabold text-[#191f28]">
            <input
              type="checkbox"
              checked={isAllRequiredChecked}
              onChange={(event) =>
                handleAllRequiredChange(event.target.checked)
              }
              className="h-3.5 w-3.5 accent-blue-600"
            />
            필수 약관에 모두 동의
          </label>

          <div className="mt-3 space-y-3 text-xs text-[#191f28]">
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={requiredTerms.personalInfo}
                onChange={(event) =>
                  setRequiredTerms((prev) => ({
                    ...prev,
                    personalInfo: event.target.checked,
                  }))
                }
                className="h-3.5 w-3.5 accent-blue-600"
              />
              <span>개인정보 수집·이용 동의 (점포주 인증)</span>
              <button type="button" className="font-bold text-blue-600">
                내용보기
              </button>
            </label>

            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={requiredTerms.thirdParty}
                onChange={(event) =>
                  setRequiredTerms((prev) => ({
                    ...prev,
                    thirdParty: event.target.checked,
                  }))
                }
                className="h-3.5 w-3.5 accent-blue-600"
              />
              <span>개인정보 제3자 제공 동의 (데이터 분석)</span>
              <button type="button" className="font-bold text-blue-600">
                내용보기
              </button>
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 h-12 w-full rounded-md bg-blue-600 text-sm font-extrabold text-white transition-colors hover:bg-[#1f6fe5]"
          >
            로그인
          </button>
        </form>

        <div className="mt-4 space-y-1.5 text-center text-xs font-medium">
          <button type="button" className="text-gray-46">
            앱 없이 로그인하기
          </button>
          <div className="text-gray-46">
            아직 회원이 아니신가요?{' '}
            <button type="button" className="font-bold text-blue-600">
              가입하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
