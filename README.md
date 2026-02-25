## Branch Convention

```
`main`: 제품 출시 브랜치
`develop`: 출시를 위해 개발하는 브랜치
`feat/{기능명}`: 새로운 기능 개발하는 브랜치
`refactor/{기능명}`: 개발된 기능을 리팩터링하는 브랜치
`hotfix`: 출시 버전에서 발생한 버그를 수정하는 브랜치
```

## Commit Convention

### Commit 메시지 형식 :

```
[TYPE]: subject

body (선택사항)

// TYPE은 항상 대문자로 작성
// [TYPE]을 제외한 모든 커밋 내용에 한글 사용 가능
```

### Type:

```
// TYPE은 항상 대문자로 작성

[INIT]: 프로젝트 초기화
[FEAT]: 새로운 기능 추가
[UPDATE] : 기타 변경사항 (빌드 스크립트 수정, 기초적 로직 수정 등)
[FIX]: 버그 수정
[REFACTOR]: 리팩토링
[DOCS]: 문서 작업
[DESIGN]: 디자인 (UI 컴포넌트 생성 및 변경 등)
```

### 예시:

```
[FEAT]: 회원가입 및 로그인 기능 추가

회원가입 기능, 로그인 기능 추가
```

### breakchange :

브레이크 체인지가 존재하는 커밋의 경우에는 제목 뒤에 '!' 추가

```
[FEAT!] 랭킹 점수 계산 공식 변경
// 변경(change)되었으니 잠깐 멈춰서(break) 이 커밋을 읽어주세요!
```

기존 개발하는 방식에 비해 많이 변경된 경우를 알리기 위한 표시
또한, 브레이크 체인지가 존재하는 경우 변경내용에 대한 설명을 body에 작성해야 함

### footer :

```
[FEAT]: 회원가입 및 로그인 기능 추가

SMS, 이메일 중복확인 API 개발

// footer
Resolves: #123
Ref: #456
Related to: #48, #45
```

- optional하게 사용하고 이슈 트래커 ID를 작성
- `"Issue Tracker Type: #Issue 번호"` 형식으로 사용
- 여러 개의 이슈 번호를 적을 때는 `,`로 구분

### Issue Tracker Type :

```
Fixes: Issue 수정중 (아직 해결되지 않은 경우)
Resolves: Issue를 해결했을 때 사용
Ref: 참고할 Issue가 있을 때 사용
Related to: 해당 커밋에 관련된 Issue 번호 (아직 해결되지 않은 경우)
```

## PR Convention

```
## 요약(Summary)
// 작업한 부분에 대한 간단한 요약

## 변경 사항(Changes)
// 기존과 비교했을 때 해당 PR에서 변경된 내용
// 어떤 부분을 왜 수정했는지 작성

## 리뷰 요구사항
// 해당 PR에서 중점적으로 혹은 꼭 리뷰가 필요한 사항들
// 체크리스트 등 자유 형식으로 작성

## 확인 방법 (선택)
// 화면 스크린샷, 기능 구동 gif 등 작업 결과를 한 눈에 볼 수 있는 자료
```

## Issue Template

```
"[TYPE] 이슈 제목"

## 요약(Summary)
// 간단하게 현재 해결하고자 하는 문제나 추가 기능 요약
// 예) 새로운 회원가입 API 명세 정리 및 구현 준비

## 상세설명(Description)
// 이슈 상세 설명, 필요 시 요구사항, 고려사항, 디자인 목업 등 추가
// 예) 현재 회원가입 API의 중복 확인 로직이 누락되어 있어 개선이 필요

## 추가사항(Additional Context)
// 추가하고 싶은 내용이나 참고가 필요한 정보를 작성
// 외부 API(구글, 페이스북 등) 인증 연동 관련 참고

---

// Commit Convention의 footer 양식에 따라 작성
Fixes: #
Resolves: #
Ref: #
Related to: #
```

### Issue Type

```markdown
[INIT]: 프로젝트 초기 세팅, 기본 구조 구축 등에 관한 이슈
[FEAT]: 새로운 기능 구현이나 추가 사항에 관한 이슈
[UPDATE]: 빌드 스크립트 수정, 기초적인 로직 또는 의존성 업데이트 등에 관한 이슈
[FIX]: 버그 수정에 관한 이슈
[REFACTOR]: 기존 코드 구조나 로직을 개선하는 리팩토링 이슈
[DOCS]: 문서 작업에 관한 이슈
[DESIGN]: UI/UX 디자인 및 컴포넌트 수정, 생성 등에 관한 이슈
```
