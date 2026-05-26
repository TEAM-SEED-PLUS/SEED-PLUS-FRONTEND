import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '@/api';
import { useAuth } from '@/auth';
import LoginTermsModal from '@/components/login/LoginTermsModal';
import { HeaderUser } from '@/components/layout';
import SignupOnboarding from '@/components/signup/SignupOnboarding';

type SignupStage = 'form' | 'terms' | 'onboarding';

const inputClass =
  'h-12 w-full rounded-sm border border-[#d8dde5] px-4 text-sm text-[#191f28] outline-none placeholder:text-[#b0b8c1] focus:border-blue-600';
const labelClass = 'mb-2 block text-sm font-medium text-gray-46';

const toApiBirthDate = (value: string) => {
  if (!/^\d{8}$/.test(value)) {
    return null;
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
};

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [stage, setStage] = useState<SignupStage>('form');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [requiredTerms, setRequiredTerms] = useState({
    personalInfo: false,
    thirdParty: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = () => {
    navigate('/login', { state: { signupComplete: true } });
  };

  const submitSignup = async () => {
    setErrorMessage('');
    const formattedBirthDate = toApiBirthDate(birthDate);

    if (!name.trim() || !phoneNumber.trim() || !password) {
      setErrorMessage('이름, 생년월일, 휴대폰 번호, 비밀번호를 입력해주세요.');
      setStage('form');
      return;
    }

    if (!formattedBirthDate) {
      setErrorMessage('생년월일은 YYYYMMDD 형식으로 정확히 입력해주세요.');
      setStage('form');
      return;
    }

    if (password.length < 8 || password.length > 72) {
      setErrorMessage('비밀번호는 8자 이상 72자 이하로 입력해주세요.');
      setStage('form');
      return;
    }

    if (!requiredTerms.personalInfo || !requiredTerms.thirdParty) {
      setErrorMessage('필수 약관에 모두 동의해주세요.');
      setStage('terms');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        name: name.trim(),
        birthDate: formattedBirthDate,
        phoneNumber: phoneNumber.replaceAll('-', ''),
        password,
      });
      setStage('onboarding');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
      setStage('form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitSignup();
  };

  return (
    <div className="min-h-screen bg-gray-500">
      <HeaderUser />
      <main
        className={`flex min-h-screen justify-center px-6 py-5 pt-[calc(var(--header-height)+20px)] ${
          stage === 'onboarding' ? 'items-start' : 'items-center'
        }`}
      >
        <section className="w-full max-w-150 rounded-lg border border-[#d8dde5] bg-white px-6 py-7">
          {stage === 'onboarding' ? (
            <SignupOnboarding onComplete={handleComplete} />
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-xl font-extrabold text-[#191f28]">
                  회원가입
                </h1>
                <p className="mt-5 text-sm font-medium text-[#4e5968]">
                  지금 가입하고 사장님만을 위한 맞춤 정보를 만나보세요.
                </p>
              </div>

              {stage === 'terms' ? (
                <LoginTermsModal
                  requiredTerms={requiredTerms}
                  onChangeTerms={setRequiredTerms}
                  onSubmit={() => void submitSignup()}
                  submitLabel="가입하기"
                  isSubmitting={isSubmitting}
                  errorMessage={errorMessage}
                />
              ) : (
                <>
                  <div className="mt-8 grid grid-cols-2 text-center text-sm font-medium text-[#191f28]">
                    <div className="border-b-2 border-blue-600 pb-3">
                      휴대폰 번호로 가입
                    </div>
                    <div className="border-b border-[#e5e8eb] pb-3 text-[#8b95a1]">
                      소셜계정으로 가입
                    </div>
                  </div>

                  <form className="mt-5" onSubmit={handleSubmit}>
                    <label className="block">
                      <span className={labelClass}>이름</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="이름을 입력해주세요."
                        className={inputClass}
                      />
                    </label>

                    <label className="mt-4 block">
                      <span className={labelClass}>생년월일</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={birthDate}
                        onChange={(event) => setBirthDate(event.target.value)}
                        placeholder="ex) 19900101"
                        className={inputClass}
                      />
                    </label>

                    <label className="mt-4 block">
                      <span className={labelClass}>휴대폰 번호</span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        placeholder="ex) 01012345678"
                        className={inputClass}
                      />
                    </label>

                    <label className="mt-4 block">
                      <span className={labelClass}>비밀번호</span>
                      <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="8자 이상 입력해주세요."
                        className={inputClass}
                      />
                    </label>

                    <div className="mt-5 space-y-3 text-sm text-[#191f28]">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={requiredTerms.personalInfo}
                          onChange={() => setStage('terms')}
                          className="h-4 w-4 rounded border-[#d8dde5] accent-blue-600"
                        />
                        <span>개인정보 수집·이용 동의 (점포주 인증)</span>
                        <button
                          type="button"
                          onClick={() => setStage('terms')}
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
                            setRequiredTerms((previous) => ({
                              ...previous,
                              thirdParty: event.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded border-[#d8dde5] accent-blue-600"
                        />
                        <span>개인정보 제3자 제공 동의 (데이터 분석)</span>
                        <button
                          type="button"
                          onClick={() => setStage('terms')}
                          className="font-bold text-blue-600"
                        >
                          내용보기
                        </button>
                      </label>
                    </div>

                    {errorMessage && (
                      <p className="mt-4 text-sm font-medium text-[#e5484d]">
                        {errorMessage}
                      </p>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-14 rounded-md bg-blue-600 text-base font-extrabold text-white transition-colors hover:bg-[#1f6fe5] disabled:cursor-not-allowed disabled:bg-[#b0c4f5]"
                      >
                        {isSubmitting ? '처리 중...' : '가입하기'}
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
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default SignupPage;
