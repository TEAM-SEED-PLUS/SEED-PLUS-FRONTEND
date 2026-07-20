import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '@/api';
import { useAuth } from '@/auth';
import { HeaderUser } from '@/components/layout';
import { useDocumentTitle } from '@/hooks';
import {
  normalizePhoneNumber,
  validatePassword,
  validatePhoneNumber,
} from '@/utils/formValidation';

type LoginMethod = 'phone' | 'social';

type LocationState = {
  signupComplete?: boolean;
};

const inputClass =
  'h-12 w-full rounded-sm border border-[#d8dde5] px-4 text-sm outline-none placeholder:text-[#b0b8c1] focus:border-blue-600';
const errorInputClass = 'border-[#e5484d] focus:border-[#e5484d]';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  useDocumentTitle('로그인');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const signupComplete = (location.state as LocationState | null)
    ?.signupComplete;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    const nextPhoneError = validatePhoneNumber(phoneNumber);
    const nextPasswordError = validatePassword(password);
    setPhoneError(nextPhoneError);
    setPasswordError(nextPasswordError);

    if (nextPhoneError || nextPasswordError) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login({
        phoneNumber: normalizePhoneNumber(phoneNumber),
        password,
      });
      navigate('/store-builder');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabClass = (method: LoginMethod) =>
    `border-b-2 pb-3 transition-colors ${
      loginMethod === method
        ? 'border-blue-600 text-[#191f28]'
        : 'border-transparent text-[#4e5968] hover:text-blue-600'
    }`;

  return (
    <div className="min-h-screen bg-gray-500">
      <HeaderUser />
      <main className="flex min-h-screen items-center justify-center px-6 pt-[var(--header-height)]">
        <section className="w-full max-w-150 rounded-lg border border-[#d8dde5] bg-white px-6 py-7">
          <div className="text-center">
            <h1 className="text-xl font-extrabold text-[#191f28]">
              점포주 로그인
            </h1>
            <p className="mt-5 text-sm font-medium text-[#4e5968]">
              내 점포 데이터를 관리하고 스마트하게 운영하세요
            </p>
          </div>

          {signupComplete && (
            <p className="mt-6 rounded-md bg-blue-300 px-4 py-3 text-sm font-medium text-blue-600">
              회원가입이 완료되었습니다. 로그인해주세요.
            </p>
          )}

          <div className="mt-8 grid grid-cols-2 text-center text-sm font-medium">
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={tabClass('phone')}
              aria-current={loginMethod === 'phone' ? 'page' : undefined}
            >
              휴대폰 번호로 로그인
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('social')}
              className={tabClass('social')}
              aria-current={loginMethod === 'social' ? 'page' : undefined}
            >
              소셜계정으로 로그인
            </button>
          </div>

          {loginMethod === 'phone' ? (
            <form className="mt-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-46">
                  휴대폰 번호
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) => {
                    setPhoneNumber(event.target.value);
                    if (phoneError) {
                      setPhoneError(validatePhoneNumber(event.target.value));
                    }
                  }}
                  onBlur={() => setPhoneError(validatePhoneNumber(phoneNumber))}
                  placeholder="ex) 01012345678"
                  className={`${inputClass} ${phoneError ? errorInputClass : ''}`}
                  aria-invalid={Boolean(phoneError)}
                />
                {phoneError && (
                  <p className="mt-1 text-xs font-medium text-[#e5484d]">
                    {phoneError}
                  </p>
                )}
              </label>

              <label className="mt-4 block">
                <span className="mb-2 block text-sm font-medium text-gray-46">
                  비밀번호
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (passwordError) {
                      setPasswordError(validatePassword(event.target.value));
                    }
                  }}
                  onBlur={() => setPasswordError(validatePassword(password))}
                  placeholder="비밀번호를 입력해주세요."
                  className={`${inputClass} ${passwordError ? errorInputClass : ''}`}
                  aria-invalid={Boolean(passwordError)}
                />
                {passwordError && (
                  <p className="mt-1 text-xs font-medium text-[#e5484d]">
                    {passwordError}
                  </p>
                )}
              </label>

              {errorMessage && (
                <p className="mt-4 text-sm font-medium text-[#e5484d]">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 h-14 w-full rounded-md bg-blue-600 text-base font-extrabold text-white transition-colors hover:bg-[#1f6fe5] disabled:cursor-not-allowed disabled:bg-[#b0c4f5]"
              >
                {isSubmitting ? '로그인 중...' : '로그인'}
              </button>
            </form>
          ) : (
            <div className="py-16 text-center">
              <p className="text-sm font-medium text-[#8b95a1]">
                소셜계정 로그인은 준비 중입니다.
              </p>
            </div>
          )}

          <div className="mt-10 space-y-1.5 text-center text-sm font-medium">
            <div className="text-gray-46">
              아직 회원이 아니신가요?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="font-bold text-blue-600"
              >
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
