// 백엔드 검증 규칙과 일치시킨 클라이언트 검증.
// - 휴대폰: ^010\d{8}$ (010으로 시작하는 11자리)
// - 비밀번호: 8~72자 (BCrypt 입력 제한)
// - 이름: 1~100자, 공백만 불가
// - 생년월일: 실재하는 YYYYMMDD
const PHONE_NUMBER_PATTERN = /^010\d{8}$/;

export const normalizePhoneNumber = (value: string) =>
  value.replace(/[\s-]/g, '');

export const validatePhoneNumber = (value: string) => {
  const normalizedValue = normalizePhoneNumber(value);

  if (!normalizedValue) {
    return '휴대폰 번호를 입력해주세요';
  }

  if (!PHONE_NUMBER_PATTERN.test(normalizedValue)) {
    return '010으로 시작하는 11자리 숫자를 입력해주세요';
  }

  return '';
};

export const validatePassword = (value: string) => {
  if (!value) {
    return '비밀번호를 입력해주세요';
  }

  if (value.length < 8) {
    return '비밀번호는 8자 이상 입력해주세요';
  }

  if (value.length > 72) {
    return '비밀번호는 72자 이하로 입력해주세요';
  }

  return '';
};

export const validateName = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return '이름을 입력해주세요';
  }

  if (trimmed.length > 100) {
    return '이름은 100자 이하로 입력해주세요';
  }

  return '';
};

export const validateBirthDate = (value: string) => {
  if (!value.trim()) {
    return '생년월일을 입력해주세요';
  }

  if (!/^\d{8}$/.test(value)) {
    return '생년월일 8자리(YYYYMMDD)를 숫자로 입력해주세요';
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const date = new Date(Date.UTC(year, month - 1, day));

  const isRealDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day;

  if (!isRealDate) {
    return '존재하지 않는 날짜입니다. 생년월일을 확인해주세요';
  }

  return '';
};
