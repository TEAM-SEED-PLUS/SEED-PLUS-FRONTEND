import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  COMMUNITY_LIMITS,
  createCommunityPost,
  getApiErrorMessage,
  getSeoulLegalDongs,
  type CommunityPostDetail,
  type RegionResponse,
} from '@/api';
import { ChevronDownIcon } from '@/components/ui/icons';

interface CommunityPostFormProps {
  onCreated: (post: CommunityPostDetail) => void;
}

const FIELD_CLASS =
  'min-w-0 flex-1 bg-transparent text-sm text-[#191f28] outline-none placeholder:text-[#b0b8c1]';

const SELECT_CLASS =
  'h-9 w-full cursor-pointer appearance-none rounded-md border border-[#d8dde5] bg-white pl-3 pr-9 text-sm text-[#191f28] outline-none focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#b0b8c1]';

const byKorean = (left: string, right: string) =>
  left.localeCompare(right, 'ko');

type RegionsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; dongsByGu: Map<string, string[]> };

/** 서울 법정동 목록을 구별 동 이름 목록으로 묶는다 (가나다순) */
const groupDongsByGu = (regions: RegionResponse[]) => {
  const dongsByGu = new Map<string, Set<string>>();
  for (const region of regions) {
    if (!region.dong) continue;
    const dongs = dongsByGu.get(region.sigungu) ?? new Set<string>();
    dongs.add(region.dong);
    dongsByGu.set(region.sigungu, dongs);
  }
  return new Map(
    [...dongsByGu.keys()]
      .sort(byKorean)
      .map((gu) => [gu, [...dongsByGu.get(gu)!].sort(byKorean)])
  );
};

/**
 * 시안 '피드-커뮤니티 (글쓰기 화면)' — 목록 위에 펼쳐지는 작성 카드.
 * 시안대로 제목·내용·위치(선택)만 받는다. 위치는 서울 구 → 동 드롭다운으로 골라
 * '마포구 서교동' 형태의 문자열로 보낸다. 지역·업종 태그는 시안이 없어 1차 범위 밖이다.
 */
const CommunityPostForm = ({ onCreated }: CommunityPostFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [gu, setGu] = useState('');
  const [dong, setDong] = useState('');
  const [regions, setRegions] = useState<RegionsState>({ status: 'loading' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ignore = false;
    getSeoulLegalDongs().then(
      (result) => {
        if (!ignore) {
          setRegions({ status: 'success', dongsByGu: groupDongsByGu(result) });
        }
      },
      (error: unknown) => {
        if (!ignore) {
          setRegions({ status: 'error', message: getApiErrorMessage(error) });
        }
      }
    );
    return () => {
      ignore = true;
    };
  }, []);

  const guOptions = useMemo(
    () => (regions.status === 'success' ? [...regions.dongsByGu.keys()] : []),
    [regions]
  );
  const dongOptions =
    regions.status === 'success' && gu ? (regions.dongsByGu.get(gu) ?? []) : [];
  // 시안 표기 '마포구 서교동'. 동은 고르지 않아도 된다.
  const location = [gu, dong].filter(Boolean).join(' ');

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
        location: location || undefined,
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

        <div className="flex flex-wrap items-center gap-2">
          <span className="shrink-0 text-base font-bold text-[#191f28]">
            위치 (선택) :
          </span>
          <div className="flex min-w-0 flex-1 gap-2">
            <label className="relative w-full max-w-[160px]">
              <span className="sr-only">구 선택</span>
              <select
                value={gu}
                onChange={(event) => {
                  setGu(event.target.value);
                  setDong('');
                }}
                disabled={regions.status !== 'success'}
                className={`${SELECT_CLASS} ${gu ? '' : 'text-[#b0b8c1]'}`}
              >
                <option value="">
                  {regions.status === 'loading' ? '불러오는 중…' : '구 선택'}
                </option>
                {guOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className="text-[#191f28]"
                  >
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                aria-hidden
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7684]"
              />
            </label>
            <label className="relative w-full max-w-[160px]">
              <span className="sr-only">동 선택</span>
              <select
                value={dong}
                onChange={(event) => setDong(event.target.value)}
                disabled={!gu}
                className={`${SELECT_CLASS} ${dong ? '' : 'text-[#b0b8c1]'}`}
              >
                <option value="">동 선택</option>
                {dongOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className="text-[#191f28]"
                  >
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                aria-hidden
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7684]"
              />
            </label>
          </div>
          {regions.status === 'error' && (
            <p role="alert" className="w-full text-xs text-[#e5484d]">
              지역 목록을 불러오지 못했습니다. ({regions.message}) 위치 없이도
              등록할 수 있습니다.
            </p>
          )}
        </div>
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
