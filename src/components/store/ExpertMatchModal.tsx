export type ExpertProfile = {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatar: string;
  quote: string;
  highlights: string[];
};

interface ExpertMatchModalProps {
  expert: ExpertProfile;
  onClose: () => void;
}

const roleOptions = [
  '변호사 보기',
  '세무사 보기',
  '중개사 보기',
  '회계사 보기',
];

const ExpertMatchModal = ({ expert, onClose }: ExpertMatchModalProps) => {
  return (
    <div className="fixed inset-0 z-40 flex justify-center bg-white/70 backdrop-blur-[1px] px-6 pt-[calc(var(--header-height)+16px)]">
      <section className="relative h-fit w-full max-w-[594px] bg-white px-6 pb-6 pt-5 shadow-[0_18px_60px_rgba(25,31,40,0.12)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-2 top-1 flex h-8 w-8 items-center justify-center text-3xl font-light text-[#4e5968] transition hover:text-[#191f28]"
        >
          ×
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#191f28]">
              전문가 매칭
            </h2>
            <p className="mt-1 text-xs font-medium text-[#4e5968]">
              인증된 전문가들만 모여 있습니다.
            </p>
          </div>

          <select
            defaultValue={roleOptions[0]}
            className="mr-5 h-10 rounded-sm border border-[#e5e8eb] bg-white px-3 text-sm font-medium text-[#191f28] outline-none focus:border-blue-600"
          >
            {roleOptions.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="mt-6 rounded-md border border-[#d8dde5] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-[#191f28]">
              지금 이 전문가는 어때요?
            </h3>
            <div className="rounded-sm border border-[#d8dde5] px-6 py-2 text-sm font-medium text-[#191f28]">
              {expert.name}
            </div>
          </div>

          <article className="min-h-101 rounded-md bg-[#f5f6f8] px-5 py-5">
            <div className="flex items-start gap-7">
              <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-extrabold text-blue-600 shadow-sm">
                {expert.avatar}
              </div>

              <div className="pt-1">
                <blockquote className="text-2xl font-black leading-snug text-black">
                  “{expert.quote}”
                </blockquote>
                <p className="mt-1 text-xl font-black text-black">
                  {expert.role}
                </p>
              </div>
            </div>

            <ul className="mt-10 space-y-2 pl-6 text-xl font-black leading-snug text-black">
              {expert.highlights.map((highlight) => (
                <li key={highlight} className="list-disc">
                  {highlight}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <button
          type="button"
          className="mt-3 h-10 w-full rounded-md bg-blue-600 text-lg font-extrabold text-white transition hover:bg-blue-700"
        >
          상담하기
        </button>
      </section>
    </div>
  );
};

export default ExpertMatchModal;
