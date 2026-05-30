const PHONE_NUMBER_PATTERN = /^01[016789]\d{7,8}$/;

export const normalizePhoneNumber = (value: string) =>
  value.replace(/[\s-]/g, '');

export const validatePhoneNumber = (value: string) => {
  const normalizedValue = normalizePhoneNumber(value);

  if (!normalizedValue) {
    return '필수 입력 항목입니다';
  }

  if (!PHONE_NUMBER_PATTERN.test(normalizedValue)) {
    return '올바른 휴대폰 번호 형식이 아닙니다';
  }

  return '';
};
