import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { createInquiry, getApiErrorMessage } from '@/api';
import { useAuth } from '@/auth';
import { AUTH_INPUT_CLASS } from '@/components/ui/formStyles';
import {
  INQUIRY_TYPES,
  INQUIRY_TYPE_LABEL,
  type InquiryType,
} from '@/content/supportTypes';
import { useDocumentTitle } from '@/hooks';
import SupportPageLayout from './SupportPageLayout';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 문의하기 — BE가 운영 메일(seedbusiness0@gmail.com)로 전달하고, 문의자 이메일을 Reply-To로 둔다.
 * 로그인 사용자는 회원 정보의 이름·이메일을 그대로 보내고, 비회원이거나 회원 정보에 이메일이 없으면 입력받는다.
 * 첨부파일은 BE가 아직 받지 않아 1차에서 뺐다.
 */
const ContactPage = () => {
  useDocumentTitle('문의하기');
  const { status: authStatus, user } = useAuth();
  const [type, setType] = useState<InquiryType | ''>('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const memberName = authStatus === 'authenticated' ? user?.name : undefined;
  const memberEmail = authStatus === 'authenticated' ? user?.email : undefined;
  const name = (memberName ?? guestName).trim();
  const email = (memberEmail ?? guestEmail).trim();

  const canSubmit =
    authStatus !== 'loading' &&
    type !== '' &&
    name !== '' &&
    EMAIL_PATTERN.test(email) &&
    title.trim() !== '' &&
    content.trim() !== '' &&
    consent &&
    !isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await createInquiry({
        type,
        name,
        email,
        title: title.trim(),
        content: content.trim(),
        personalInformationConsent: consent,
      });
      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setType('');
    setTitle('');
    setContent('');
    setConsent(false);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <SupportPageLayout title="문의하기">
        <div
          role="status"
          className="flex flex-col items-center gap-3 rounded-lg bg-white px-5 py-16 text-center shadow-sm"
        >
          <p className="text-lg font-extrabold text-[#191f28]">
            문의가 접수되었습니다.
          </p>
          <p className="text-sm leading-relaxed text-[#4e5968]">
            답변은 <span className="font-bold text-[#191f28]">{email}</span>
            으로 보내드립니다.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="h-10 rounded-md border border-[#d8dde5] px-4 text-sm font-bold text-[#4e5968] transition hover:border-blue-600 hover:text-blue-600"
            >
              추가 문의하기
            </button>
            <Link
              to="/faq"
              className="inline-flex h-10 items-center rounded-md bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              FAQ 보기
            </Link>
          </div>
        </div>
      </SupportPageLayout>
    );
  }

  return (
    <SupportPageLayout title="문의하기">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-lg bg-white p-5 shadow-sm md:p-6"
      >
        <p className="border-b border-[#e5e8eb] pb-4 text-sm text-[#191f28]">
          문의하실 내용을 하단에 입력해주세요.
        </p>

        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="sr-only">문의 유형</span>
            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value as InquiryType | '')
              }
              className={`${AUTH_INPUT_CLASS} bg-white ${
                type === '' ? 'text-[#b0b8c1]' : ''
              }`}
            >
              <option value="" disabled>
                문의 유형
              </option>
              {INQUIRY_TYPES.map((inquiryType) => (
                <option
                  key={inquiryType}
                  value={inquiryType}
                  className="text-[#191f28]"
                >
                  {INQUIRY_TYPE_LABEL[inquiryType]}
                </option>
              ))}
            </select>
          </label>

          {memberName === undefined && (
            <label className="block">
              <span className="sr-only">이름</span>
              <input
                type="text"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="이름"
                autoComplete="name"
                className={AUTH_INPUT_CLASS}
              />
            </label>
          )}

          {memberEmail === undefined && (
            <label className="block">
              <span className="sr-only">답변 받을 이메일</span>
              <input
                type="email"
                value={guestEmail}
                onChange={(event) => setGuestEmail(event.target.value)}
                placeholder="답변 받을 이메일"
                autoComplete="email"
                className={AUTH_INPUT_CLASS}
              />
            </label>
          )}

          <label className="block">
            <span className="sr-only">제목</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목"
              className={AUTH_INPUT_CLASS}
            />
          </label>

          <label className="block">
            <span className="sr-only">문의사항</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="문의사항"
              rows={6}
              className="w-full resize-y rounded-sm border border-[#d8dde5] px-4 py-3 text-sm outline-none placeholder:text-[#b0b8c1] focus:border-blue-600"
            />
          </label>

          {memberEmail !== undefined && (
            <p className="text-xs text-gray-46">
              답변은 회원 정보의 이메일(
              <span className="font-bold text-[#4e5968]">{memberEmail}</span>
              )로 보내드립니다.
            </p>
          )}

          <fieldset className="rounded-sm border border-[#d8dde5] px-4 py-4">
            <legend className="px-1 text-sm text-[#191f28]">약관동의</legend>
            <label className="flex min-h-9 items-center gap-2 text-sm text-[#191f28]">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="h-4 w-4 rounded border-[#d8dde5] accent-blue-600"
              />
              <span className="flex-1">
                <span className="mr-1 text-xs font-bold text-blue-600">
                  [필수]
                </span>
                개인정보 수집·이용에 동의합니다.
              </span>
              <Link
                to="/privacy"
                className="shrink-0 text-xs font-bold text-blue-600 hover:underline"
              >
                개인정보처리방침 보기
              </Link>
            </label>
          </fieldset>
        </div>

        {errorMessage && (
          <p role="alert" className="mt-4 text-sm text-[#e5484d]">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-5 h-12 w-full rounded-md bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#c4c7cb]"
        >
          {isSubmitting ? '접수 중…' : '문의하기'}
        </button>
      </form>
    </SupportPageLayout>
  );
};

export default ContactPage;
