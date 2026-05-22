import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginTermsModal from '@/components/login/LoginTermsModal';
import { HeaderUser } from '@/components/layout';
import { setMockAuthenticated } from '@/utils/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [requiredTerms, setRequiredTerms] = useState({
    personalInfo: false,
    thirdParty: false,
  });

  const handleLogin = () => {
    setMockAuthenticated(true);
    navigate('/store-builder');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleLogin();
  };

  const openTermsModal = () => {
    setIsTermsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-500">
      <HeaderUser />
      <main className="flex min-h-screen items-center justify-center px-6 pt-[var(--header-height)]">
        <section className="w-full max-w-[568px] rounded-lg border border-[#d8dde5] bg-white px-6 py-7">
          <div className="text-center">
            <h1 className="text-xl font-extrabold text-[#191f28]">
              점포주 로그인
            </h1>
            <p className="mt-5 text-sm font-medium text-[#4e5968]">
              내 점포 데이터를 관리하고 스마트하게 운영하세요
            </p>
          </div>

          {isTermsModalOpen ? (
            <LoginTermsModal
              requiredTerms={requiredTerms}
              onChangeTerms={setRequiredTerms}
              onSubmit={handleLogin}
            />
          ) : (
            <>
              <div className="mt-8 grid grid-cols-2 text-center text-sm font-medium text-[#191f28]">
                <button
                  type="button"
                  className="border-b-2 border-blue-600 pb-3"
                  aria-current="page"
                >
                  휴대폰 번호로 로그인
                </button>
                <button
                  type="button"
                  className="border-b border-[#e5e8eb] pb-3"
                >
                  소셜 계정으로 로그인
                </button>
              </div>

              <form className="mt-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-46">
                    이름
                  </span>
                  <input
                    type="text"
                    placeholder="이름을 입력해주세요."
                    className="h-12 w-full rounded-sm border border-[#d8dde5] px-4 text-sm outline-none placeholder:text-[#b0b8c1] focus:border-blue-600"
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-medium text-gray-46">
                    생년월일
                  </span>
                  <input
                    type="text"
                    placeholder="ex) 900101"
                    className="h-12 w-1/2 rounded-sm border border-[#d8dde5] px-4 text-sm outline-none placeholder:text-[#b0b8c1] focus:border-blue-600"
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-medium text-gray-46">
                    휴대폰 번호
                  </span>
                  <input
                    type="tel"
                    placeholder="ex) 01000000000"
                    className="h-12 w-full rounded-sm border border-[#d8dde5] px-4 text-sm outline-none placeholder:text-[#b0b8c1] focus:border-blue-600"
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

                <button
                  type="submit"
                  className="mt-5 h-14 w-full rounded-md bg-blue-600 text-base font-extrabold text-white transition-colors hover:bg-[#1f6fe5]"
                >
                  로그인
                </button>
              </form>
            </>
          )}

          <div className="mt-4 space-y-1.5 text-center text-sm font-medium">
            <Link
              to="/home"
              className="text-gray-46 transition-colors hover:text-blue-600"
            >
              앱 없이 로그인하기
            </Link>
            <div className="text-gray-46">
              아직 회원이 아니신가요?{' '}
              <button type="button" className="font-bold text-blue-600">
                가입하기
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
