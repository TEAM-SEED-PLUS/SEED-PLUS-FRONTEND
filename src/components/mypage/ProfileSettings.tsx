import { useState } from 'react';
import { getApiErrorMessage, updateMyProfile } from '@/api';
import { useAuth } from '@/auth';
import { SpinnerIcon } from '@/components/ui/icons';
import { validateName } from '@/utils/formValidation';
import {
  validatePasswordConfirm,
  validateSignupPassword,
} from '@/utils/authValidation';

const inputClass =
  'h-11 w-full rounded-md border border-[#d8dde5] bg-white px-3 text-sm text-[#191f28] outline-none placeholder:text-[#b0b8c1] focus:border-blue-600';
const errorInputClass = 'border-[#e5484d] focus:border-[#e5484d]';
const labelClass = 'mb-2 block text-sm font-medium text-[#4e5968]';

/** 설정 화면의 프로필 수정 — PATCH /api/v1/users/me (이름·비밀번호) */
const ProfileSettings = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [nameError, setNameError] = useState('');
  const [nameMessage, setNameMessage] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [confirmationError, setConfirmationError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const saveName = async () => {
    setNameMessage('');
    const nextNameError = validateName(name);
    setNameError(nextNameError);
    if (nextNameError) {
      return;
    }

    setIsSavingName(true);
    try {
      await updateMyProfile({ name: name.trim() });
      await refreshUser();
      setNameMessage('이름이 변경되었습니다.');
    } catch (error) {
      setNameMessage(getApiErrorMessage(error));
    } finally {
      setIsSavingName(false);
    }
  };

  const savePassword = async () => {
    setPasswordMessage('');
    const nextNewError = validateSignupPassword(newPassword);
    const nextConfirmError = validatePasswordConfirm(newPassword, confirmation);
    setNewPasswordError(nextNewError);
    setConfirmationError(nextConfirmError);
    if (nextNewError || nextConfirmError) {
      return;
    }

    setIsSavingPassword(true);
    try {
      await updateMyProfile({ password: newPassword });
      setNewPassword('');
      setConfirmation('');
      setPasswordMessage('비밀번호가 변경되었습니다.');
    } catch (error) {
      setPasswordMessage(getApiErrorMessage(error));
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-base font-extrabold text-[#191f28]">프로필 수정</h2>

      {(user?.loginId || user?.email) && (
        <dl className="mt-4 space-y-1 text-sm font-medium text-[#4e5968]">
          {user.loginId && (
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-gray-46">아이디</dt>
              <dd>{user.loginId}</dd>
            </div>
          )}
          {user.email && (
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-gray-46">이메일</dt>
              <dd>{user.email}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-5 border-t border-[#eef1f4] pt-5">
        <label className="block">
          <span className={labelClass}>이름</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (nameError) {
                  setNameError(validateName(event.target.value));
                }
              }}
              placeholder="이름을 입력해주세요."
              className={`${inputClass} ${nameError ? errorInputClass : ''}`}
              aria-invalid={Boolean(nameError)}
            />
            <button
              type="button"
              onClick={() => void saveName()}
              disabled={isSavingName}
              className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#b0c4f5]"
            >
              {isSavingName && <SpinnerIcon className="h-4 w-4" />}
              변경
            </button>
          </div>
          {nameError && (
            <p className="mt-1 text-xs font-medium text-[#e5484d]">
              {nameError}
            </p>
          )}
          {nameMessage && (
            <p className="mt-2 text-xs font-medium text-[#4e5968]">
              {nameMessage}
            </p>
          )}
        </label>
      </div>

      <div className="mt-5 border-t border-[#eef1f4] pt-5">
        <label className="block">
          <span className={labelClass}>새 비밀번호</span>
          <input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
              if (newPasswordError) {
                setNewPasswordError(validateSignupPassword(event.target.value));
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

        <label className="mt-3 block">
          <span className={labelClass}>새 비밀번호 확인</span>
          <input
            type="password"
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => {
              setConfirmation(event.target.value);
              if (confirmationError) {
                setConfirmationError(
                  validatePasswordConfirm(newPassword, event.target.value)
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

        {passwordMessage && (
          <p className="mt-3 text-xs font-medium text-[#4e5968]">
            {passwordMessage}
          </p>
        )}

        <button
          type="button"
          onClick={() => void savePassword()}
          disabled={isSavingPassword}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#b0c4f5]"
        >
          {isSavingPassword && <SpinnerIcon className="h-4 w-4" />}
          비밀번호 변경
        </button>
      </div>
    </section>
  );
};

export default ProfileSettings;
