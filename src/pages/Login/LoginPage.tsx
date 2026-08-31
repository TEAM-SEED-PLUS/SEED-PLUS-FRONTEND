import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '@/api';
import { useAuth } from '@/auth';
import { HeaderUser } from '@/components/layout';
import { useDocumentTitle } from '@/hooks';
import { validatePassword } from '@/utils/formValidation';
import { validateLoginId } from '@/utils/authValidation';

type LoginMethod = 'loginId' | 'social';

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
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('loginId');
  const [loginId, setLoginId] = useState('');
  const [loginIdError, setLoginIdError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const signupComplete = (location.state as LocationState | null)
    ?.signupComplete;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    const nextLoginIdError = validateLoginId(loginId);
    const nextPasswordError = validatePassword(password);
    setLoginIdError(nextLoginIdError);
    setPasswordError(nextPasswordError);

    if (nextLoginIdError || nextPasswordError) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login({
        loginId: loginId.trim(),
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
    <div className="min-h-[100dvh] bg-gray-500">
      <HeaderUser />
      <main className="flex min-h-[100dvh] items-center justify-center px-0 pt-[var(--header-height)] md:px-6">
        <section className="w-full max-w-150 border-[#d8dde5] bg-white px-5 py-7 md:rounded-lg md:border md:px-6">
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
              onClick={() => setLoginMethod('loginId')}
              className={tabClass('loginId')}
              aria-current={loginMethod === 'loginId' ? 'page' : undefined}
            >
              아이디로 로그인
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

          {loginMethod === 'loginId' ? (
            <form className="mt-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-46">
                  아이디
                </span>
                <input
                  type="text"
                  autoComplete="username"
                  value={loginId}
                  onChange={(event) => {
                    setLoginId(event.target.value);
                    if (loginIdError) {
                      setLoginIdError(validateLoginId(event.target.value));
                    }
                  }}
                  onBlur={() => setLoginIdError(validateLoginId(loginId))}
                  placeholder="ex) seedplus01"
                  className={`${inputClass} ${loginIdError ? errorInputClass : ''}`}
                  aria-invalid={Boolean(loginIdError)}
                />
                {loginIdError && (
                  <p className="mt-1 text-xs font-medium text-[#e5484d]">
                    {loginIdError}
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
              비밀번호를 바꾸시겠어요?{' '}
              <button
                type="button"
                onClick={() => navigate('/password-reset')}
                className="inline-flex min-h-11 items-center px-1 font-bold text-blue-600"
              >
                비밀번호 변경
              </button>
            </div>
            <div className="text-gray-46">
              아직 회원이 아니신가요?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="inline-flex min-h-11 items-center px-1 font-bold text-blue-600"
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
