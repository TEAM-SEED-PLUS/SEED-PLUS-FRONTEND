import { useState, type FormEvent } from 'react';
import {
  COMMUNITY_LIMITS,
  createCommunityPost,
  getApiErrorMessage,
  type CommunityPostDetail,
} from '@/api';

interface CommunityPostFormProps {
  onCreated: (post: CommunityPostDetail) => void;
}

const FIELD_CLASS =
  'min-w-0 flex-1 bg-transparent text-sm text-[#191f28] outline-none placeholder:text-[#b0b8c1]';

/**
 * 시안 '피드-커뮤니티 (글쓰기 화면)' — 목록 위에 펼쳐지는 작성 카드.
 * 시안대로 제목·내용·위치(선택)만 받는다. 지역·업종 태그는 시안이 없어 1차 범위 밖이다.
 */
const CommunityPostForm = ({ onCreated }: CommunityPostFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const canSubmit =
    title.trim() !== '' && content.trim() !== '' && !isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const post = await createCommunityPost({
        title: title.trim(),
        content: content.trim(),
        location: location.trim() || undefined,
      });
      onCreated(post);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-white px-5 py-5 shadow-sm"
      aria-label="글쓰기"
    >
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-9 rounded-md bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#c4c7cb]"
        >
          {isSubmitting ? '등록 중…' : '등록하기'}
        </button>
      </div>

      <div className="mt-2 space-y-4">
        <label className="flex items-center gap-2">
          <span className="shrink-0 text-base font-bold text-[#191f28]">
            제목:
          </span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={COMMUNITY_LIMITS.title}
            placeholder="제목을 입력해주세요."
            className={FIELD_CLASS}
          />
        </label>

        <label className="flex items-start gap-2">
          <span className="shrink-0 text-base font-bold text-[#191f28]">
            내용:
          </span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={COMMUNITY_LIMITS.content}
            placeholder="함께 나누고 싶은 이야기를 적어주세요."
            rows={4}
            className={`${FIELD_CLASS} resize-y pt-0.5 leading-relaxed`}
          />
        </label>

        <label className="flex items-center gap-2">
          <span className="shrink-0 text-base font-bold text-[#191f28]">
            위치 (선택) :
          </span>
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            maxLength={COMMUNITY_LIMITS.location}
            placeholder="예) 마포구 서교동"
            className={FIELD_CLASS}
          />
        </label>
      </div>

      {errorMessage && (
        <p role="alert" className="mt-4 text-sm text-[#e5484d]">
          {errorMessage}
        </p>
      )}
    </form>
  );
};

export default CommunityPostForm;
