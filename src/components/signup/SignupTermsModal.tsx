import type { TermsBlock } from './signupTermsContent';
import {
  signupTermsDocuments,
  TERMS_EFFECTIVE_DATE,
} from './signupTermsContent';

export type TermsAgreement = {
  service: boolean;
  privacy: boolean;
  thirdParty: boolean;
};

interface SignupTermsModalProps {
  agreement: TermsAgreement;
  onChangeAgreement: (agreement: TermsAgreement) => void;
  onClose: () => void;
}

const TermsBlockView = ({ block }: { block: TermsBlock }) => {
  if (block.kind === 'heading') {
    return (
      <p className="mt-3 text-[13px] font-bold text-[#191f28] first:mt-0">
        {block.text}
      </p>
    );
  }

  if (block.kind === 'paragraph') {
    return <p className="mt-1 leading-relaxed">{block.text}</p>;
  }

  return (
    <div className="mt-2 space-y-2">
      {block.rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="rounded-sm border border-[#e5e8eb] bg-white p-2"
        >
          {row.map((field) => (
            <div key={field.label} className="flex gap-1.5 py-0.5">
              <span className="shrink-0 font-semibold text-[#4e5968]">
                {field.label}
              </span>
              <span className="text-[#8b95a1]">{field.value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const SignupTermsModal = ({
  agreement,
  onChangeAgreement,
  onClose,
}: SignupTermsModalProps) => {
  const isAllChecked =
    agreement.service && agreement.privacy && agreement.thirdParty;

  const setAll = (checked: boolean) => {
    onChangeAgreement({
      service: checked,
      privacy: checked,
      thirdParty: checked,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-0 md:items-center md:px-5"
      role="dialog"
      aria-modal="true"
      aria-label="약관 동의"
      onClick={onClose}
    >
      <section
        className="flex max-h-[85dvh] w-full max-w-[520px] flex-col rounded-t-2xl bg-white p-5 shadow-[0_18px_60px_rgba(25,31,40,0.18)] md:max-h-[85vh] md:rounded-lg md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#191f28]">약관 동의</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-xl font-light text-[#6b7684] transition hover:bg-[#f2f4f6] hover:text-[#191f28]"
          >
            ×
          </button>
        </div>
        <p className="mt-1 text-xs text-[#8b95a1]">
          시행일 {TERMS_EFFECTIVE_DATE}
        </p>

        <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          {signupTermsDocuments.map((doc) => (
            <div
              key={doc.id}
              className="rounded-md border border-[#e5e8eb] bg-[#fafbfc]"
            >
              <label className="flex min-h-11 items-center gap-2 border-b border-[#e5e8eb] px-3 py-2.5 text-sm font-bold text-[#191f28]">
                <input
                  type="checkbox"
                  checked={agreement[doc.id]}
                  onChange={(event) =>
                    onChangeAgreement({
                      ...agreement,
                      [doc.id]: event.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-[#d8dde5] accent-blue-600"
                />
                {doc.checkboxLabel}
              </label>
              <div className="max-h-[180px] overflow-y-auto px-3 py-3 text-[11px] text-[#4e5968]">
                {doc.blocks.map((block, index) => (
                  <TermsBlockView key={index} block={block} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <label className="mt-4 flex min-h-11 items-center gap-2 border-t border-[#e5e8eb] pt-4 text-sm font-extrabold text-[#191f28]">
          <input
            type="checkbox"
            checked={isAllChecked}
            onChange={(event) => setAll(event.target.checked)}
            className="h-4 w-4 rounded border-[#d8dde5] accent-blue-600"
          />
          전체 동의 (선택 항목 포함)
        </label>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 h-12 w-full shrink-0 rounded-md bg-blue-600 text-base font-extrabold text-white transition-colors hover:bg-[#1f6fe5]"
        >
          확인
        </button>
      </section>
    </div>
  );
};

export default SignupTermsModal;
