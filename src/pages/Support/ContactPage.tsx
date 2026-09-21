import { useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { CameraIcon } from '@/components/ui/icons';
import { useDocumentTitle } from '@/hooks';
import SupportPageLayout from './SupportPageLayout';

const ATTACHMENT_SLOTS = 3;

const inputClass =
  'h-12 w-full rounded-sm border border-[#d8dde5] px-4 text-sm outline-none placeholder:text-[#b0b8c1] focus:border-blue-600';

/** 동의 항목은 기존 법적 문서와 연결한다 (명세: 기존 개인정보 관련 문서와 연결되는 구조) */
const AGREEMENTS = [
  {
    id: 'privacy',
    label: '개인정보 수집·이용에 동의합니다.',
    required: true,
    to: '/privacy',
    docLabel: '개인정보처리방침',
  },
  {
    id: 'terms',
    label: '이용약관에 동의합니다.',
    required: true,
    to: '/terms',
    docLabel: '이용약관',
  },
] as const;

type AgreementId = (typeof AGREEMENTS)[number]['id'];

/**
 * 문의하기 — 1차는 화면만 구성한다.
 * 접수 API(이메일 전달 또는 DB 저장)가 아직 정해지지 않아 제출 버튼은 비활성화해 두고,
 * 입력 상태만 관리한다. API가 붙으면 handleSubmit에 연결하면 된다.
 */
const ContactPage = () => {
  useDocumentTitle('문의하기');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // 미리보기 URL은 파일이 바뀔 때 해제해 메모리에 남지 않게 한다.
  const [attachments, setAttachments] = useState<
    ({ file: File; previewUrl: string } | null)[]
  >(Array.from({ length: ATTACHMENT_SLOTS }, () => null));
  const [agreements, setAgreements] = useState<Record<AgreementId, boolean>>({
    privacy: false,
    terms: false,
  });

  const handleAttachmentChange =
    (slot: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      setAttachments((current) =>
        current.map((item, index) => {
          if (index !== slot) return item;
          if (item) URL.revokeObjectURL(item.previewUrl);
          return file ? { file, previewUrl: URL.createObjectURL(file) } : null;
        })
      );
    };

  return (
    <SupportPageLayout title="문의하기">
      <form
        onSubmit={(event) => event.preventDefault()}
        className="rounded-lg bg-white p-5 shadow-sm md:p-6"
      >
        <p className="border-b border-[#e5e8eb] pb-4 text-sm text-[#191f28]">
          문의하실 내용을 하단에 입력해주세요.
        </p>

        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="sr-only">제목</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목"
              className={inputClass}
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

          <div className="flex flex-wrap items-center gap-4 rounded-sm border border-[#d8dde5] px-4 py-4">
            <span className="text-sm text-[#191f28]">첨부파일</span>
            <div className="flex gap-3">
              {attachments.map((attachment, slot) => (
                <label
                  key={slot}
                  className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-dashed border-[#d8dde5] text-[#c4c7cb] transition hover:border-blue-600 hover:text-blue-600"
                  title={attachment?.file.name ?? `첨부파일 ${slot + 1}`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAttachmentChange(slot)}
                    className="sr-only"
                  />
                  {attachment ? (
                    <img
                      src={attachment.previewUrl}
                      alt={attachment.file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <CameraIcon className="h-6 w-6" />
                  )}
                </label>
              ))}
            </div>
          </div>

          <fieldset className="rounded-sm border border-[#d8dde5] px-4 py-4">
            <legend className="px-1 text-sm text-[#191f28]">약관동의</legend>
            <div className="space-y-2 text-sm text-[#191f28]">
              {AGREEMENTS.map((agreement) => (
                <label
                  key={agreement.id}
                  className="flex min-h-9 items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={agreements[agreement.id]}
                    onChange={(event) =>
                      setAgreements((current) => ({
                        ...current,
                        [agreement.id]: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-[#d8dde5] accent-blue-600"
                  />
                  <span className="flex-1">
                    <span className="mr-1 text-xs font-bold text-blue-600">
                      {agreement.required ? '[필수]' : '[선택]'}
                    </span>
                    {agreement.label}
                  </span>
                  <Link
                    to={agreement.to}
                    className="shrink-0 text-xs font-bold text-blue-600 hover:underline"
                  >
                    {agreement.docLabel} 보기
                  </Link>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <button
          type="submit"
          disabled
          title="문의 접수 기능은 준비 중입니다."
          className="mt-5 h-12 w-full rounded-md bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#c4c7cb]"
        >
          문의하기
        </button>
        <p className="mt-3 text-center text-xs text-gray-46">
          문의 접수 기능은 준비 중입니다. 급한 문의는{' '}
          <a
            href="mailto:seedbusiness0@gmail.com"
            className="font-bold text-blue-600 hover:underline"
          >
            seedbusiness0@gmail.com
          </a>
          으로 보내주세요.
        </p>
      </form>
    </SupportPageLayout>
  );
};

export default ContactPage;
