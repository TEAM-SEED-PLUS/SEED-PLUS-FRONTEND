# Figma 시안 → 코드 규칙

Figma 시안을 이 저장소의 React + Tailwind 코드로 옮길 때 따르는 규칙이다.
스택·스크립트·폴더 구조처럼 `package.json`과 `src/`를 열면 보이는 내용은 적지 않고,
코드만 봐서는 알기 어려운 관례와 함정을 적는다.

## 작업 순서

1. **시안 노드 찾기** — 아래 [Figma 파일](#figma-파일)의 페이지 목록에서 프레임을 찾는다.
   완료 기준: 구현할 프레임의 node id를 확보했다.
2. **시안 읽기** — `figma-design-to-code` 가이드를 먼저 로드한 뒤 `get_design_context`를 부른다.
   완료 기준: 화면에 보이는 모든 영역의 코드·스크린샷을 받았다(응답이 잘렸으면 섹션 단위로 다시 받는다).
3. **재사용할 것 찾기** — [공용 UI](#공용-ui), [아이콘](#아이콘), 같은 도메인 폴더의 기존 컴포넌트를 먼저 확인한다.
   완료 기준: 시안의 각 요소가 "기존 것 재사용 / 새로 작성" 중 하나로 정해졌다.
4. **구현** — 반환된 코드는 좌표를 고정한 프로토타입이다. [토큰](#색상-토큰)·[레이아웃](#레이아웃)·[반응형](#반응형) 규칙에 맞춰 다시 쓴다.
5. **검증** — `npm run verify:deploy` 통과, 그리고 시안 폭(보통 1546px)에서 섹션별 스크린샷을 시안과 나란히 비교한다.
   390px·820px·1280px에서 가로 스크롤이 없는지도 본다.
   완료 기준: 모든 섹션을 비교했고, 시안과 다르게 둔 부분은 이유와 함께 PR 본문에 적었다.

시안이 없는 화면은 만들지 않는다. 시안에 없는 상태(모바일, 로딩, 빈 목록, 오류)는 기존 화면의 패턴을 따르고 PR에 밝힌다.

## Figma 파일

- fileKey `0LB7pAU3chrsJfnDTDjvf6`
- 페이지
  - `0:1` SEED+ 웹디자인 — 로그인/회원가입, 홈, 상권날씨, 내 상가 만들기, 계산기, 피드, 마이페이지(+모바일)
  - `403:12` 브로슈어, 랜딩페이지, 회사 소개 페이지 — 랜딩 `983:1143`, 회사 소개 `1451:1903`
  - `800:952` SEED+ 로고
- 페이지 단위 `get_metadata`는 응답이 커서 잘리거나 파일로 저장된다. 프레임 이름으로 검색해 node id만 뽑아 쓴다.
  목록에 안 보인다고 "시안이 없다"고 결론 내리지 말고 node 링크를 요청한다.

## 색상 토큰

토큰은 `src/index.css`의 `@theme` 한 곳에만 있다(Tailwind v4). `tailwind.config.js`는 비어 있고 쓰이지 않는다.

```css
@theme {
  --color-white: #ffffff;
  --color-blue-300: #e8f3ff;
  --color-blue-600: #3182f6;
  --color-gray-500: #f9fafb;
  --color-gray-46: #6b7684;
}
```

이름이 Tailwind 기본 팔레트와 겹치지만 값은 다르다.

| Figma 값  | 클래스     | 쓰임                                           |
| --------- | ---------- | ---------------------------------------------- |
| `#3182f6` | `blue-600` | 주 색상(버튼, 링크, 강조)                      |
| `#e8f3ff` | `blue-300` | 옅은 파란 배경                                 |
| `#f9fafb` | `gray-500` | **페이지 배경**(밝은 회색이다)                 |
| `#6b7684` | `gray-46`  | 보조 글자                                      |
| —         | `blue-700` | 버튼 hover 전용. 토큰이 아니라 Tailwind 기본값 |

토큰에 없는 색은 시안의 hex를 그대로 쓴다. 자주 나오는 값:

| hex                                  | 쓰임                    |
| ------------------------------------ | ----------------------- |
| `text-[#191f28]`                     | 기본 글자               |
| `text-[#4e5968]`                     | 본문 보조 글자          |
| `text-[#8b95a1]`, `text-[#b0b8c1]`   | 흐린 글자, placeholder  |
| `border-[#e5e8eb]`                   | 카드·구분선             |
| `border-[#d8dde5]`                   | 입력창·보조 버튼 테두리 |
| `text-[#e5484d]`, `border-[#e5484d]` | 오류                    |
| `bg-[#f7f8fa]`, `bg-[#f2f4f6]`       | 옅은 회색 면            |

투명도는 `bg-blue-600/10`처럼 토큰에 붙여 쓴다(`rgba(49,130,246,0.1)` → `blue-600/10`).
데이터에 따라 정해지는 색(상권날씨 등급 등)은 클래스가 아니라 `weatherGradeStyle.ts`처럼 도메인 파일의 상수로 둔다.

## 타이포그래피

- 글꼴은 Pretendard 하나다(`index.css`에서 CDN으로 로드, `body`에 지정). 시안에 `Inter`로 찍힌 글자도 기본 글꼴 그대로 둔다.
- 크기는 Tailwind 기본 단계(`text-xs`~`text-2xl`)를 먼저 쓰고, 맞는 단계가 없을 때만 `text-[11px]`처럼 쓴다.
- 굵기: 제목 `font-extrabold`/`font-bold`, 본문 `font-medium`.
- 한글 문단은 `break-keep`으로 어절 단위 줄바꿈을 한다. 좁은 칸의 짧은 값(등급, 점수)은 `whitespace-nowrap`으로 한 덩어리로 묶는다.

## 레이아웃

| 영역                                                    | 틀                                                                                                                                                          |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 서비스 화면(상권날씨, 피드, 내 상가 만들기, 마이페이지) | `HeaderUser`(고정, 높이 `--header-height` 56px) + `<main className="mx-auto w-full max-w-[1500px] ... pt-[calc(var(--header-height)+20px)]">` + `AppFooter` |
| 랜딩                                                    | `LandingHeader`(sticky 88px) + 한 화면 높이 섹션 + `LandingFooter`                                                                                          |
| 고객 지원(공지·FAQ·문의)                                | `SupportPageLayout`                                                                                                                                         |
| 약관·개인정보                                           | `LegalPageLayout`                                                                                                                                           |

랜딩 섹션의 공통 클래스:

```tsx
<section className="w-full snap-start scroll-mt-[88px] bg-white py-30 md:flex md:min-h-[calc(100dvh-88px)] md:items-center">
  <div className="mx-auto w-full max-w-[1200px] px-6">…</div>
</section>
```

세로 스냅은 `html.landing-snap`으로 켜고, 페이지가 마운트된 동안만 붙인다(`LandingPage` 참고).

시안의 절대 좌표(`absolute left-[91px] top-[246px]`)는 flex/grid와 여백으로 바꾼다.
겹침이 본질인 요소(배지, 장식, 일러스트 내부)만 `absolute`로 남긴다.

## 반응형

- 시안은 대부분 데스크톱 프레임 하나다. 모바일 우선으로 쓰고 `md:`에서 데스크톱 배치로 바꾼다(`md` 114회, `lg` 31회, `sm` 26회 사용 중).
- 좁은 화면에서는 세로로 쌓는다. 표·지도처럼 줄일 수 없는 것은 그 영역만 가로 스크롤(`overflow-x-auto scrollbar-hide`)한다.
- 페이지 전체에 가로 스크롤이 생기지 않게 한다. 화면 밖으로 나가는 장식이 있는 섹션은 `overflow-hidden`.
- 움직임은 `motion-safe:`로 감싼다(`Skeleton` 참고).

## 공용 UI

새로 만들기 전에 `src/components/ui/`를 확인한다.

| 파일                        | 용도                                                                      |
| --------------------------- | ------------------------------------------------------------------------- |
| `ConfirmModal`              | 취소/확인 두 버튼 모달. 삭제는 `isDestructive`                            |
| `NoticeModal`               | 확인 한 버튼 안내 팝업                                                    |
| `LoadingOverlay`            | 수십 초 이상 걸리는 요청의 전체 덮개(경과 시간 + 취소)                    |
| `Skeleton`                  | 불러오는 중 자리 표시. '값 없음'(`?`) 표기를 대체하지 않는다              |
| `formStyles.ts`             | 로그인·가입·프로필 입력창 클래스(`AUTH_INPUT_CLASS`, `ERROR_INPUT_CLASS`) |
| `.app-select` (`index.css`) | 화살표 여백을 맞춘 select                                                 |

버튼·카드·모달은 공용 컴포넌트 없이 아래 클래스 조합을 화면마다 반복한다. 같은 조합을 따른다.

```tsx
// 주 버튼 — 높이만 자리에 맞게(h-9 / h-10 / h-11 / h-12)
<button className="h-11 rounded-md bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50" />
// 보조 버튼
<button className="h-11 rounded-md border border-[#d8dde5] text-sm font-bold text-[#4e5968] transition hover:bg-gray-500" />
// 모달
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5" role="dialog" aria-modal="true">
  <section className="w-full max-w-[360px] rounded-lg bg-white p-6 shadow-[0_18px_60px_rgba(25,31,40,0.18)]" />
</div>
```

모서리는 `rounded-md`(버튼·카드 기본), `rounded-lg`(모달·큰 카드), `rounded-full`(칩)을 쓴다.
쌓임 순서는 서비스 헤더 `z-30`, 모달·오버레이 `z-50`이다.

## 아이콘

시안의 아이콘은 한 세트가 아니라 Iconify 여러 세트(mdi, iconoir, boxicons, weui)와 Untitled UI가 섞여 있다.
Figma 레이어 이름이 Iconify ID다(예: `mdi:heart`).

- **색이 글자색을 따라가야 하는 아이콘** → `src/components/ui/icons.tsx`에 컴포넌트로 추가한다.
  `StrokeIcon`/`FillIcon` 래퍼에 Figma에서 내보낸 path를 그대로 넣는다. 이름은 `XxxIcon`.

  ```tsx
  import { HeartIcon } from '@/components/ui/icons';
  <HeartIcon className="h-4 w-4 text-[#e5484d]" />;
  ```

- **색이 고정된 아이콘·일러스트** → svg 파일로 저장해 `<img>`로 쓴다(svgr 없음).

  ```tsx
  import WarningIcon from '@/assets/icons/warning-icon.svg';
  <img src={WarningIcon} alt="" className="h-5 w-5" />;
  ```

아이콘은 Figma에서 내보낸 것을 쓴다. 장식 아이콘은 `alt=""`(svg 컴포넌트는 래퍼가 `aria-hidden`을 붙인다).

## 에셋

- `get_design_context`가 준 URL은 임시 주소다. `curl -L`로 받아 `src/assets/<도메인>/`에 의미 있는 이름으로 저장하고 `@/assets/...`로 import한다.
- 폴더: `icons/`(공용 아이콘), `Logo/`, `landing/`, `weather/`. 새 화면 전용 에셋은 그 도메인 이름의 폴더를 만든다.
- 시안이 같은 이미지를 여러 번 쓰면 URL이 달라도 파일이 같을 수 있다. `cmp`로 확인해 하나만 둔다.
- `public/`에는 주소가 고정되어야 하는 파일(favicon, og-image, robots, sitemap)만 둔다.
- 이미지 최적화 단계와 CDN은 없다. Vite가 해시 파일명으로 번들한다. 큰 이미지는 받기 전에 크기를 확인한다.

## 컴포넌트 배치

- 화면: `src/pages/<Name>/<Name>Page.tsx` → `src/pages/index.ts`에 export → `src/routes/Router.tsx`에 라우트.
- 화면을 이루는 조각: `src/components/<도메인>/`, 폴더마다 `index.ts`로 export. 한 화면에서만 쓰는 작은 조각은 그 `pages/<Name>/` 안에 둔다.
- 화면에 박아 두는 문구·표 데이터는 `src/content/`.
- 공개 페이지를 추가하면 `public/sitemap.xml`에도 넣는다.
- 준비되지 않은 기능의 화면은 `src/config/featureFlags.ts` 플래그로 진입점과 라우트를 함께 감춘다.
