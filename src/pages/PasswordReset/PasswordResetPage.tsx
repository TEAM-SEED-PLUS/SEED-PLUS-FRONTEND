import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage, resetPassword } from '@/api';
import { HeaderUser } from '@/components/layout';
import { useDocumentTitle } from '@/hooks';
import {
  normalizeEmail,
  validateEmail,
  validatePasswordConfirm,
  validateSignupPassword,
} from '@/utils/authValidation';

const inputClass =
  'h-12 w-full rounded-sm border border-[#d8dde5] px-4 text-sm text-[#191f28] outline-none placeholder:text-[#b0b8c1] focus:border-blue-600';
const errorInputClass = 'border-[#e5484d] focus:border-[#e5484d]';
const labelClass = 'mb-2 block text-sm font-medium text-gray-46';

/**
 * 비밀번호 변경 화면.
 * 백엔드 계약(POST /api/v1/auth/password/reset)이 현재 비밀번호를 요구하므로
 * '분실 찾기'가 아니라 아는 비밀번호를 바꾸는 화면이다. 비로그인 접근 가능.
 */
const PasswordResetPage = () => {
  const navigate = useNavigate();
  useDocumentTitle('비밀번호 변경');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [confirmationError, setConfirmationError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const validateCurrentPassword = (value: string) =>
    value ? '' : '현재 비밀번호를 입력해주세요';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    const nextEmailError = validateEmail(email);
    const nextCurrentError = validateCurrentPassword(currentPassword);
    const nextNewError = validateSignupPassword(newPassword);
    const nextConfirmError = validatePasswordConfirm(newPassword, confirmation);
    setEmailError(nextEmailError);
    setCurrentPasswordError(nextCurrentError);
    setNewPasswordError(nextNewError);
    setConfirmationError(nextConfirmError);

    if (
      nextEmailError ||
      nextCurrentError ||
      nextNewError ||
      nextConfirmError
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({
        email: normalizeEmail(email),
        currentPassword,
        newPassword,
        newPasswordConfirmation: confirmation,
      });
      setIsDone(true);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gray-500">
      <HeaderUser />
      <main className="flex min-h-[100dvh] items-center justify-center px-0 pt-[var(--header-height)] md:px-6">
        <section className="w-full max-w-150 border-[#d8dde5] bg-white px-5 py-7 md:rounded-lg md:border md:px-6">
          {isDone ? (
            <div className="py-10 text-center">
              <h1 className="text-xl font-extrabold text-[#191f28]">
                비밀번호가 변경되었습니다
              </h1>
              <p className="mt-4 text-sm font-medium text-[#4e5968]">
                새 비밀번호로 다시 로그인해주세요.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="mt-8 h-14 w-full rounded-md bg-blue-600 text-base font-extrabold text-white transition-colors hover:bg-[#1f6fe5]"
              >
                로그인하러 가기
              </button>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-xl font-extrabold text-[#191f28]">
                  비밀번호 변경
                </h1>
                <p className="mt-5 text-sm font-medium text-[#4e5968]">
                  가입 이메일과 현재 비밀번호로 본인을 확인합니다.
                </p>
              </div>

              <form className="mt-8" onSubmit={handleSubmit}>
                <label className="block">
                  <span className={labelClass}>가입 이메일</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (emailError) {
                        setEmailError(validateEmail(event.target.value));
                      }
                    }}
                    onBlur={() => setEmailError(validateEmail(email))}
                    placeholder="ex) seedplus@example.com"
                    className={`${inputClass} ${emailError ? errorInputClass : ''}`}
                    aria-invalid={Boolean(emailError)}
                  />
                  {emailError && (
                    <p className="mt-1 text-xs font-medium text-[#e5484d]">
                      {emailError}
                    </p>
                  )}
                </label>

                <label className="mt-4 block">
                  <span className={labelClass}>현재 비밀번호</span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(event) => {
                      setCurrentPassword(event.target.value);
                      if (currentPasswordError) {
                        setCurrentPasswordError(
                          validateCurrentPassword(event.target.value)
                        );
                      }
                    }}
                    onBlur={() =>
                      setCurrentPasswordError(
                        validateCurrentPassword(currentPassword)
                      )
                    }
                    placeholder="현재 비밀번호를 입력해주세요."
                    className={`${inputClass} ${currentPasswordError ? errorInputClass : ''}`}
                    aria-invalid={Boolean(currentPasswordError)}
                  />
                  {currentPasswordError && (
                    <p className="mt-1 text-xs font-medium text-[#e5484d]">
                      {currentPasswordError}
                    </p>
                  )}
                </label>

                <label className="mt-4 block">
                  <span className={labelClass}>새 비밀번호</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => {
                      setNewPassword(event.target.value);
                      if (newPasswordError) {
                        setNewPasswordError(
                          validateSignupPassword(event.target.value)
                        );
                      }
                    }}
                    onBlur={() =>
                      setNewPasswordError(validateSignupPassword(newPassword))
                    }
                    placeholder="8자 이상, 영문/숫자/특수문자 포함"
                    className={`${inputClass} ${newPasswordError ? errorInputClass : ''}`}
                    aria-invalid={Boolean(newPasswordError)}
                  />
                  {newPasswordError && (
                    <p className="mt-1 text-xs font-medium text-[#e5484d]">
                      {newPasswordError}
                    </p>
                  )}
                </label>

                <label className="mt-4 block">
                  <span className={labelClass}>새 비밀번호 확인</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={confirmation}
                    onChange={(event) => {
                      setConfirmation(event.target.value);
                      if (confirmationError) {
                        setConfirmationError(
                          validatePasswordConfirm(
                            newPassword,
                            event.target.value
                          )
                        );
                      }
                    }}
                    onBlur={() =>
                      setConfirmationError(
                        validatePasswordConfirm(newPassword, confirmation)
                      )
                    }
                    placeholder="새 비밀번호를 다시 입력해주세요."
                    className={`${inputClass} ${confirmationError ? errorInputClass : ''}`}
                    aria-invalid={Boolean(confirmationError)}
                  />
                  {confirmationError && (
                    <p className="mt-1 text-xs font-medium text-[#e5484d]">
                      {confirmationError}
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
                  className="mt-6 h-14 w-full rounded-md bg-blue-600 text-base font-extrabold text-white transition-colors hover:bg-[#1f6fe5] disabled:cursor-not-allowed disabled:bg-[#b0c4f5]"
                >
                  {isSubmitting ? '변경 중...' : '비밀번호 변경'}
                </button>
              </form>

              <div className="mt-8 text-center text-sm font-medium text-gray-46">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex min-h-11 items-center px-1 font-bold text-blue-600"
                >
                  로그인으로 돌아가기
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default PasswordResetPage;
