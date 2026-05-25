import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginTermsModal from '@/components/login/LoginTermsModal';
import { HeaderUser } from '@/components/layout';
import { setMockAuthenticated } from '@/utils/auth';

const inputClass =
  'h-12 w-full rounded-sm border border-[#d8dde5] px-4 text-sm text-[#191f28] outline-none placeholder:text-[#b0b8c1] focus:border-blue-600';
const labelClass = 'mb-2 block text-sm font-medium text-gray-46';

const SignupPage = () => {
  const navigate = useNavigate();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [requiredTerms, setRequiredTerms] = useState({
    personalInfo: false,
    thirdParty: false,
  });

  const handleSignup = () => {
    setMockAuthenticated(true);
    navigate('/store-builder');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSignup();
  };

  const openTermsModal = () => {
    setIsTermsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-500">
      <HeaderUser />
      <main className="flex min-h-screen items-center justify-center px-6 pt-[var(--header-height)]">
        <section className="w-full max-w-150 rounded-lg border border-[#d8dde5] bg-white px-6 py-7">
          <div className="text-center">
            <h1 className="text-xl font-extrabold text-[#191f28]">회원가입</h1>
            <p className="mt-5 text-sm font-medium text-[#4e5968]">
              지금 가입하고 사장님만을 위한 맞춤 정보를 만나보세요.
            </p>
          </div>

          {isTermsModalOpen ? (
            <LoginTermsModal
              requiredTerms={requiredTerms}
              onChangeTerms={setRequiredTerms}
              onSubmit={handleSignup}
              submitLabel="가입하기"
            />
          ) : (
            <>
              <div className="mt-8 grid grid-cols-2 text-center text-sm font-medium text-[#191f28]">
                <div className="border-b-2 border-blue-600 pb-3">
                  휴대폰 번호로 로그인
                </div>
                <div className="border-b border-[#e5e8eb] pb-3">
                  소셜계정으로 로그인
                </div>
              </div>

              <form className="mt-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className={labelClass}>이름</span>
                  <input
                    type="text"
                    placeholder="이름을 입력해주세요."
                    className={inputClass}
                  />
                </label>

                <label className="mt-4 block">
                  <span className={labelClass}>생년월일</span>
                  <input
                    type="text"
                    placeholder="ex) 900101"
                    className={inputClass}
                  />
                </label>

                <label className="mt-4 block">
                  <span className={labelClass}>휴대폰 번호</span>
                  <input
                    type="tel"
                    placeholder="ex) 01000000000"
                    className={inputClass}
                  />
                </label>

                <label className="mt-4 block">
                  <span className={labelClass}>이메일 주소 (선택)</span>
                  <input
                    type="email"
                    placeholder="ex) 00000000@gmail.com"
                    className={inputClass}
                  />
                </label>

                <div className="mt-5 space-y-3 text-sm text-[#191f28]">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={requiredTerms.personalInfo}
                      onChange={openTermsModal}
                      className="h-4 w-4 rounded border-[#d8dde5] accent-blue-600"
                    />
                    <span>개인정보 수집·이용 동의 (점포주 인증)</span>
                    <button
                      type="button"
                      onClick={openTermsModal}
                      className="font-bold text-blue-600"
                    >
                      내용보기
                    </button>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={requiredTerms.thirdParty}
                      onChange={(event) =>
                        setRequiredTerms((prev) => ({
                          ...prev,
                          thirdParty: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-[#d8dde5] accent-blue-600"
                    />
                    <span>개인정보 제3자 제공 동의 (데이터 분석)</span>
                    <button
                      type="button"
                      onClick={openTermsModal}
                      className="font-bold text-blue-600"
                    >
                      내용보기
                    </button>
                  </label>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <button
                    type="submit"
                    className="h-14 rounded-md bg-blue-600 text-base font-extrabold text-white transition-colors hover:bg-[#1f6fe5]"
                  >
                    가입하기
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="h-14 rounded-md bg-[#dfe3eb] text-base font-extrabold text-white transition-colors hover:bg-[#cdd3dd]"
                  >
                    가입취소
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default SignupPage;
