import { describe, expect, it } from 'vitest';
import {
  normalizePhoneNumber,
  validateBirthDate,
  validateName,
  validatePassword,
  validatePhoneNumber,
} from './formValidation';

// 이 검증 규칙들은 백엔드 스펙(휴대폰 ^010\d{8}$, 비밀번호 8~72자 등)과
// 일치해야 하므로, 규칙이 바뀌면 이 테스트가 회귀를 잡아준다.

describe('normalizePhoneNumber', () => {
  it('공백과 하이픈을 제거한다', () => {
    expect(normalizePhoneNumber('010-1234-5678')).toBe('01012345678');
    expect(normalizePhoneNumber(' 010 1234 5678 ')).toBe('01012345678');
  });
});

describe('validatePhoneNumber', () => {
  it('정규화 후 010 11자리면 통과(빈 문자열)', () => {
    expect(validatePhoneNumber('010-1234-5678')).toBe('');
    expect(validatePhoneNumber('01012345678')).toBe('');
  });

  it('빈 값이면 입력 안내', () => {
    expect(validatePhoneNumber('')).toBe('휴대폰 번호를 입력해주세요');
    expect(validatePhoneNumber('  ')).toBe('휴대폰 번호를 입력해주세요');
  });

  it('010이 아니거나 자리수가 안 맞으면 형식 안내', () => {
    const msg = '010으로 시작하는 11자리 숫자를 입력해주세요';
    expect(validatePhoneNumber('01112345678')).toBe(msg); // 011
    expect(validatePhoneNumber('0101234567')).toBe(msg); // 10자리
    expect(validatePhoneNumber('010123456789')).toBe(msg); // 12자리
    expect(validatePhoneNumber('010abcd5678')).toBe(msg); // 숫자 아님
  });
});

describe('validatePassword', () => {
  it('8~72자면 통과', () => {
    expect(validatePassword('12345678')).toBe('');
    expect(validatePassword('a'.repeat(72))).toBe('');
  });

  it('빈 값 / 8자 미만 / 72자 초과를 각각 구분해 안내', () => {
    expect(validatePassword('')).toBe('비밀번호를 입력해주세요');
    expect(validatePassword('1234567')).toBe(
      '비밀번호는 8자 이상 입력해주세요'
    );
    expect(validatePassword('a'.repeat(73))).toBe(
      '비밀번호는 72자 이하로 입력해주세요'
    );
  });
});

describe('validateName', () => {
  it('1~100자면 통과', () => {
    expect(validateName('홍길동')).toBe('');
    expect(validateName('가'.repeat(100))).toBe('');
  });

  it('공백만 있으면 입력 안내', () => {
    expect(validateName('')).toBe('이름을 입력해주세요');
    expect(validateName('   ')).toBe('이름을 입력해주세요');
  });

  it('100자 초과면 길이 안내', () => {
    expect(validateName('가'.repeat(101))).toBe(
      '이름은 100자 이하로 입력해주세요'
    );
  });
});

describe('validateBirthDate', () => {
  it('실재하는 YYYYMMDD면 통과', () => {
    expect(validateBirthDate('19900101')).toBe('');
    expect(validateBirthDate('20240229')).toBe(''); // 윤년
  });

  it('빈 값이면 입력 안내', () => {
    expect(validateBirthDate('')).toBe('생년월일을 입력해주세요');
  });

  it('8자리 숫자가 아니면 형식 안내', () => {
    const msg = '생년월일 8자리(YYYYMMDD)를 숫자로 입력해주세요';
    expect(validateBirthDate('1990-01-01')).toBe(msg);
    expect(validateBirthDate('900101')).toBe(msg);
    expect(validateBirthDate('1990010a')).toBe(msg);
  });

  it('존재하지 않는 날짜면 안내', () => {
    const msg = '존재하지 않는 날짜입니다. 생년월일을 확인해주세요';
    expect(validateBirthDate('20220230')).toBe(msg); // 2월 30일
    expect(validateBirthDate('20231301')).toBe(msg); // 13월
    expect(validateBirthDate('20230229')).toBe(msg); // 평년 2월 29일
  });
});
