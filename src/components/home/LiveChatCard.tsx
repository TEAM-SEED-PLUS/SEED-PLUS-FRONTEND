import { mockChatMessages } from '@/api/homeMock';

interface LiveChatCardProps {
  isAuthenticated: boolean;
}

/** SEED+ 실시간 채팅 미리보기 (입력은 로그인 후 사용) */
const LiveChatCard = ({ isAuthenticated }: LiveChatCardProps) => (
  <section className="rounded-lg bg-white p-5 shadow-sm">
    <h3 className="text-sm font-extrabold text-[#191f28]">SEED+ 실시간 채팅</h3>

    <ul className="mt-4 space-y-2">
      {mockChatMessages.map((message) => (
        <li
          key={message.id}
          className="flex items-center gap-2 rounded-md bg-[#f7f8fa] px-3 py-2"
        >
          <span
            aria-hidden
            className="h-6 w-6 shrink-0 rounded-full bg-[#d8dde5]"
          />
          <p className="truncate text-[11px] text-[#191f28]">
            <strong className="font-bold">{message.name}:</strong>{' '}
            {message.text}
          </p>
        </li>
      ))}
    </ul>

    <div className="mt-4 flex gap-2">
      <button
        type="button"
        disabled={isAuthenticated}
        className="shrink-0 rounded-md bg-blue-600 px-3 text-xs font-bold text-white transition hover:bg-blue-700 disabled:bg-[#b0c4f5]"
      >
        {isAuthenticated ? '참여 중' : '로그인 후 참여하기'}
      </button>
      <input
        type="text"
        disabled={!isAuthenticated}
        placeholder="내용을 입력하세요."
        className="h-9 w-full rounded-md border border-[#e5e8eb] px-3 text-xs outline-none placeholder:text-[#b0b8c1] focus:border-blue-600 disabled:bg-[#f7f8fa]"
      />
    </div>
  </section>
);

export default LiveChatCard;
