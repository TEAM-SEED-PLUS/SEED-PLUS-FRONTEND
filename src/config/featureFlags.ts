/**
 * 프로덕션 노출 여부를 한곳에서 관리하는 스위치.
 *
 * 기능은 만들어져 있지만 연동할 백엔드가 없거나 데이터가 준비되지 않아
 * 프로덕션에 내보내기 이른 화면을 잠시 감춰두는 용도다.
 * 코드를 지우지 않고 플래그만 false로 두어, 준비되면 true 한 줄로 되살린다.
 *
 * 되살릴 때는 각 항목의 '해제 조건'을 먼저 확인할 것.
 */
export const FEATURE_FLAGS = {
  /**
   * 마이페이지 '소통 활동 내역' 섹션.
   * 해제 조건: 내가 쓴 글 목록 API + 커뮤니티 글쓰기 기능
   */
  MYPAGE_ACTIVITY_POSTS: false,

  /**
   * 설정 화면 '알림 설정'(실시간 뉴스 / 커뮤니티 댓글 알림).
   * 해제 조건: 알림 설정 저장 API + 실제 발송 채널
   */
  NOTIFICATION_SETTINGS: false,

  /**
   * 랜딩 '비회원으로 둘러보기' CTA (목적지: mock 홈 /home).
   *
   * 헤더 '홈' 탭은 이제 상권날씨 대시보드(/weather)를 가리키며 이 플래그와 무관하다.
   * 이 CTA는 여전히 mock 데이터 화면으로 들어가므로 감춰둔다.
   *
   * 해제 조건: CTA 목적지를 실 API 화면(/weather)으로 바꾸거나 /home이 실 API를 쓰게 될 때
   */
  HOME_TAB: false,

  /**
   * BM 1차 — 생존율 상세 잠금(블러 + 단건 결제 안내).
   *
   * 아직 '누가 PRO인지·어떤 리포트를 샀는지' 알려주는 권한 API와 PG 연동이 없어,
   * 켜면 모든 사용자가 결제할 방법 없이 잠긴다. 배포 환경에서는 꺼두고
   * 로컬에서만 VITE_ENABLE_BM_PHASE1=true로 켜서 화면을 확인한다.
   *
   * 해제 조건: BE 권한 API(plan / report_id unlock) + 결제 연동
   */
  BM_PHASE1: import.meta.env.VITE_ENABLE_BM_PHASE1 === 'true',
} as const;
