import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getApiErrorMessage,
  requestTemporaryPassword,
  resetPassword,
} from '@/api';
import { AppFooter, HeaderUser } from '@/components/layout';
import { useDocumentTitle } from '@/hooks';
import {
  normalizeEmail,
  validateEmail,
  validatePasswordConfirm,
  validateSignupPassword,
} from '@/utils/authValidation';
import {
  AUTH_INPUT_CLASS,
  ERROR_INPUT_CLASS,
} from '@/components/ui/formStyles';

const labelClass = 'mb-2 block text-sm font-medium text-gray-46';

type Step = 'request' | 'reset' | 'done';

/**
 * 비밀번호 찾기·변경 화면. 비로그인 접근 가능.
 * 1) 가입 이메일로 임시 비밀번호를 받는다 (POST /api/v1/auth/password/temporary)
 * 2) 받은 임시 비밀번호를 현재 비밀번호 자리에 넣어 새 비밀번호로 바꾼다
 *    (POST /api/v1/auth/password/reset — 현재 비밀번호를 요구하는 계약)
 * 비밀번호를 알고 있는 사용자는 1단계를 건너뛰고 바로 변경할 수 있다.
 */
const PasswordResetPage = () => {
  const navigate = useNavigate();
  useDocumentTitle('비밀번호 찾기');
  const [step, setStep] = useState<Step>('request');
  // 임시 비밀번호를 보낸 직후라면 2단계에서 그 사실을 안내한다.
  const [hasSentTemporary, setHasSentTemporary] = useState(false);
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

  const validateCurrentPassword = (value: string) =>
    value
      ? ''
      : hasSentTemporary
        ? '임시 비밀번호를 입력해주세요'
        : '현재 비밀번호를 입력해주세요';

  const goToStep = (nextStep: Step) => {
    setErrorMessage('');
    setStep(nextStep);
  };

  const handleRequestTemporary = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    const nextEmailError = validateEmail(email);
    setEmailError(nextEmailError);
    if (nextEmailError) {
      return;
    }

    setIsSubmitting(true);
    try {
      await requestTemporaryPassword(normalizeEmail(email));
      setHasSentTemporary(true);
      goToStep('reset');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

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
      goToStep('done');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailField = (
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
        className={`${AUTH_INPUT_CLASS} ${emailError ? ERROR_INPUT_CLASS : ''}`}
        aria-invalid={Boolean(emailError)}
      />
      {emailError && (
        <p className="mt-1 text-xs font-medium text-[#e5484d]">{emailError}</p>
      )}
    </label>
  );

  const errorText = errorMessage && (
    <p className="mt-4 text-sm font-medium text-[#e5484d]">{errorMessage}</p>
  );

  const backToLogin = (
    <div className="mt-8 text-center text-sm font-medium text-gray-46">
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="inline-flex min-h-11 items-center px-1 font-bold text-blue-600"
      >
        로그인으로 돌아가기
      </button>
    </div>
  );

  return (
    <div className="flex min-h-[100dvh] flex-col bg-gray-500">
      <HeaderUser />
      <main className="flex flex-1 items-center justify-center px-0 pt-[var(--header-height)] md:px-6">
        <section className="w-full max-w-150 border-[#d8dde5] bg-white px-5 py-7 md:rounded-lg md:border md:px-6">
          {step === 'done' ? (
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
          ) : step === 'request' ? (
            <>
              <div className="text-center">
                <h1 className="text-xl font-extrabold text-[#191f28]">
                  비밀번호 찾기
                </h1>
                <p className="mt-5 text-sm font-medium text-[#4e5968]">
                  가입하신 이메일로 임시 비밀번호를 보내드립니다.
                </p>
              </div>

              <form className="mt-8" onSubmit={handleRequestTemporary}>
                {emailField}
                {errorText}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 h-14 w-full rounded-md bg-blue-600 text-base font-extrabold text-white transition-colors hover:bg-[#1f6fe5] disabled:cursor-not-allowed disabled:bg-[#b0c4f5]"
                >
                  {isSubmitting ? '보내는 중...' : '임시 비밀번호 받기'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm font-medium text-gray-46">
                비밀번호를 알고 계신가요?{' '}
                <button
                  type="button"
                  onClick={() => goToStep('reset')}
                  className="inline-flex min-h-11 items-center px-1 font-bold text-blue-600"
                >
                  바로 변경하기
                </button>
              </div>
              {backToLogin}
            </>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-xl font-extrabold text-[#191f28]">
                  비밀번호 변경
                </h1>
                <p className="mt-5 text-sm font-medium text-[#4e5968]">
                  {hasSentTemporary
                    ? '가입된 이메일이라면 임시 비밀번호를 보냈습니다. 메일함을 확인한 뒤 임시 비밀번호로 새 비밀번호를 설정해주세요.'
                    : '가입 이메일과 현재 비밀번호로 본인을 확인합니다.'}
                </p>
              </div>

              <form className="mt-8" onSubmit={handleSubmit}>
                {emailField}

                <label className="mt-4 block">
                  <span className={labelClass}>
                    {hasSentTemporary ? '임시 비밀번호' : '현재 비밀번호'}
                  </span>
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
                    placeholder={
                      hasSentTemporary
                        ? '메일로 받은 임시 비밀번호를 입력해주세요.'
                        : '현재 비밀번호를 입력해주세요.'
                    }
                    className={`${AUTH_INPUT_CLASS} ${currentPasswordError ? ERROR_INPUT_CLASS : ''}`}
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
                    className={`${AUTH_INPUT_CLASS} ${newPasswordError ? ERROR_INPUT_CLASS : ''}`}
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
                    className={`${AUTH_INPUT_CLASS} ${confirmationError ? ERROR_INPUT_CLASS : ''}`}
                    aria-invalid={Boolean(confirmationError)}
                  />
                  {confirmationError && (
                    <p className="mt-1 text-xs font-medium text-[#e5484d]">
                      {confirmationError}
                    </p>
                  )}
                </label>

                {errorText}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 h-14 w-full rounded-md bg-blue-600 text-base font-extrabold text-white transition-colors hover:bg-[#1f6fe5] disabled:cursor-not-allowed disabled:bg-[#b0c4f5]"
                >
                  {isSubmitting ? '변경 중...' : '비밀번호 변경'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm font-medium text-gray-46">
                {hasSentTemporary
                  ? '메일을 받지 못하셨나요?'
                  : '비밀번호를 잊으셨나요?'}{' '}
                <button
                  type="button"
                  onClick={() => goToStep('request')}
                  className="inline-flex min-h-11 items-center px-1 font-bold text-blue-600"
                >
                  임시 비밀번호 {hasSentTemporary ? '다시 받기' : '받기'}
                </button>
              </div>
              {backToLogin}
            </>
          )}
        </section>
      </main>
      <AppFooter />
    </div>
  );
};

export default PasswordResetPage;
