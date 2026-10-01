// 로그인·회원가입·비밀번호 재설정·프로필 설정이 함께 쓰는 입력창 스타일.
// 계산기·필터 모달은 화면 밀도가 달라 각 파일의 스타일을 그대로 둔다.

export const AUTH_INPUT_CLASS =
  'h-12 w-full rounded-sm border border-[#d8dde5] px-4 text-sm text-[#191f28] outline-none placeholder:text-[#b0b8c1] focus:border-blue-600';

/** 검증 오류가 있을 때 입력창 클래스 뒤에 덧붙인다 */
export const ERROR_INPUT_CLASS = 'border-[#e5484d] focus:border-[#e5484d]';
