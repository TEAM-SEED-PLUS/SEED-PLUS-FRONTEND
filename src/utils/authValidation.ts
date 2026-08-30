// 회원가입·로그인 기능명세서 v2.0 ③유효성·처리규칙 시트(V-01~V-07) 구현.
// 이메일 기반 전환용 규칙이며, 화면 연결은 백엔드 이메일 API 준비 후 진행한다.
// (기존 휴대폰 기반 검증은 formValidation.ts에 그대로 유지)
// V-08(로그인 실패 잠금)은 서버 책임이라 제외한다.

/** V-01 이메일 — RFC 5322 단순화 패턴 */
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
/** V-02 비밀번호 — 영문·숫자·특수문자 조합 8~64자 */
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,64}$/;
/** V-03 닉네임 — 한글/영문/숫자 2~12자 */
const NICKNAME_PATTERN = /^[가-힣A-Za-z0-9]{2,12}$/;
/** V-06 이름 — 한글/영문 2~30자 */
const NAME_PATTERN = /^[가-힣a-zA-Z\s]{2,30}$/;
/** V-05 인증코드 — 6자리 숫자 */
const VERIFY_CODE_PATTERN = /^\d{6}$/;

/** V-04 프로필 이미지 제약 */
export const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const PROFILE_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];

/** V-05 인증코드 만료(초) */
export const VERIFY_CODE_TTL_SECONDS = 300;
/** V-05 재전송 쿨다운(초) */
export const VERIFY_CODE_RESEND_COOLDOWN_SECONDS = 60;

/** 가입 가능 최소 연령 (개인정보보호법 제22조의2) */
export const MIN_SIGNUP_AGE = 14;

/** 서버가 소문자로 정규화해 저장하므로 클라이언트도 동일하게 맞춘다 */
export const normalizeEmail = (value: string) => value.trim().toLowerCase();

/** V-01 */
export const validateEmail = (value: string) => {
  const email = value.trim();

  if (!email) {
    return '이메일을 입력해주세요';
  }

  if (!EMAIL_PATTERN.test(email)) {
    return '올바른 이메일 형식이 아닙니다';
  }

  return '';
};

/** V-02 */
export const validateSignupPassword = (value: string) => {
  if (!value) {
    return '비밀번호를 입력해주세요';
  }

  if (!PASSWORD_PATTERN.test(value)) {
    return '8자 이상, 영문/숫자/특수문자를 포함해주세요';
  }

  return '';
};

/** V-02 보조 — 강도바·체크리스트 표시에 사용 */
export type PasswordChecklist = {
  hasLetter: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  hasMinLength: boolean;
};

export const getPasswordChecklist = (value: string): PasswordChecklist => ({
  hasLetter: /[A-Za-z]/.test(value),
  hasNumber: /\d/.test(value),
  hasSpecial: /[!@#$%^&*]/.test(value),
  hasMinLength: value.length >= 8 && value.length <= 64,
});

export type PasswordStrength = 'weak' | 'medium' | 'strong';

export const getPasswordStrength = (value: string): PasswordStrength => {
  const checklist = getPasswordChecklist(value);
  const passed = Object.values(checklist).filter(Boolean).length;

  if (passed <= 2) return 'weak';
  if (passed === 3) return 'medium';
  return 'strong';
};

/** 비밀번호 확인 일치 여부 */
export const validatePasswordConfirm = (
  password: string,
  confirmValue: string
) => {
  if (!confirmValue) {
    return '비밀번호를 한 번 더 입력해주세요';
  }

  if (password !== confirmValue) {
    return '비밀번호가 일치하지 않습니다';
  }

  return '';
};

/** V-03 */
export const validateNickname = (value: string) => {
  const nickname = value.trim();

  if (!nickname) {
    return '닉네임을 입력해주세요';
  }

  if (!NICKNAME_PATTERN.test(nickname)) {
    return '2~12자의 한글/영문/숫자만 사용 가능합니다';
  }

  return '';
};

/** V-06 */
export const validateSignupName = (value: string) => {
  const name = value.trim();

  if (!name) {
    return '이름을 입력해주세요';
  }

  if (!NAME_PATTERN.test(name)) {
    return '이름을 정확히 입력해주세요';
  }

  return '';
};

/** V-05 */
export const validateVerifyCode = (value: string) => {
  if (!value.trim()) {
    return '인증번호를 입력해주세요';
  }

  if (!VERIFY_CODE_PATTERN.test(value.trim())) {
    return '인증번호 6자리를 정확히 입력해주세요';
  }

  return '';
};

/** V-04 — 클라이언트 1차 검증. 서버에서 MIME·매직넘버 재검증이 필요하다. */
export const validateProfileImage = (file: File) => {
  if (!PROFILE_IMAGE_MIME_TYPES.includes(file.type)) {
    return '활용할 수 있는 파일 형식이 아닙니다, JPG, PNG 파일로 변환하거나 해당 파일로 업로드해주세요';
  }

  if (file.size > PROFILE_IMAGE_MAX_BYTES) {
    return '5MB 이하의 이미지만 업로드할 수 있습니다';
  }

  return '';
};

/** 생년월일(YYYYMMDD)에서 만 나이를 계산한다 */
export const getAge = (birthDate: string, today: Date = new Date()) => {
  const year = Number(birthDate.slice(0, 4));
  const month = Number(birthDate.slice(4, 6));
  const day = Number(birthDate.slice(6, 8));

  let age = today.getFullYear() - year;
  const beforeBirthday =
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day);

  if (beforeBirthday) {
    age -= 1;
  }

  return age;
};

/** V-07 — 유효 날짜 + 미래 차단 + 만 14세 이상 */
export const validateBirthDateWithAge = (
  value: string,
  today: Date = new Date()
) => {
  const birthDate = value.trim();

  if (!birthDate) {
    return '생년월일을 입력해주세요';
  }

  if (!/^\d{8}$/.test(birthDate)) {
    return '생년월일 8자리(YYYYMMDD)를 숫자로 입력해주세요';
  }

  const year = Number(birthDate.slice(0, 4));
  const month = Number(birthDate.slice(4, 6));
  const day = Number(birthDate.slice(6, 8));
  const date = new Date(Date.UTC(year, month - 1, day));

  const isRealDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day;

  if (!isRealDate) {
    return '존재하지 않는 날짜입니다. 생년월일을 확인해주세요';
  }

  const todayStart = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  if (date.getTime() > todayStart.getTime()) {
    return '미래 날짜는 입력할 수 없습니다';
  }

  if (getAge(birthDate, today) < MIN_SIGNUP_AGE) {
    return `만 ${MIN_SIGNUP_AGE}세 이상부터 가입 가능합니다`;
  }

  return '';
};
