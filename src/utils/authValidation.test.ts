import { describe, expect, it } from 'vitest';
import {
  getAge,
  validateLoginId,
  getPasswordChecklist,
  getPasswordStrength,
  normalizeEmail,
  validateBirthDateWithAge,
  validateEmail,
  validateNickname,
  validatePasswordConfirm,
  validateProfileImage,
  validateSignupName,
  validateSignupPassword,
  validateVerifyCode,
} from './authValidation';

// 기능명세서 v2.0 ③유효성·처리규칙(V-01~V-07) 기준.
// 규칙이 바뀌면 이 테스트가 명세와의 불일치를 잡아준다.

describe('V-01 이메일', () => {
  it('올바른 형식을 통과시킨다', () => {
    expect(validateEmail('seedplus@email.com')).toBe('');
    expect(validateEmail('a.b+tag@sub.domain.co.kr')).toBe('');
  });

  it('빈 값과 잘못된 형식을 구분해 안내한다', () => {
    expect(validateEmail('')).toBe('이메일을 입력해주세요');
    expect(validateEmail('   ')).toBe('이메일을 입력해주세요');
    const msg = '올바른 이메일 형식이 아닙니다';
    expect(validateEmail('seedplus')).toBe(msg);
    expect(validateEmail('seedplus@')).toBe(msg);
    expect(validateEmail('seedplus@email')).toBe(msg);
    expect(validateEmail('@email.com')).toBe(msg);
  });

  it('앞뒤 공백은 무시한다', () => {
    expect(validateEmail('  seedplus@email.com  ')).toBe('');
  });

  it('서버 저장 규칙에 맞춰 소문자로 정규화한다', () => {
    expect(normalizeEmail('  SeedPlus@Email.COM ')).toBe('seedplus@email.com');
  });
});

describe('V-02 비밀번호', () => {
  it('영문·숫자·특수문자 조합 8~64자를 통과시킨다', () => {
    expect(validateSignupPassword('abcd1234!')).toBe('');
    expect(validateSignupPassword(`a1!${'x'.repeat(61)}`)).toBe(''); // 64자
  });

  it('조합이 빠지거나 길이를 벗어나면 안내한다', () => {
    const msg = '8자 이상, 영문/숫자/특수문자를 포함해주세요';
    expect(validateSignupPassword('abcdefgh')).toBe(msg); // 숫자·특수 없음
    expect(validateSignupPassword('abcd1234')).toBe(msg); // 특수 없음
    expect(validateSignupPassword('abc123!')).toBe(msg); // 7자
    expect(validateSignupPassword(`a1!${'x'.repeat(62)}`)).toBe(msg); // 65자
  });

  it('빈 값은 별도 문구로 안내한다', () => {
    expect(validateSignupPassword('')).toBe('비밀번호를 입력해주세요');
  });

  it('체크리스트와 강도를 계산한다', () => {
    expect(getPasswordChecklist('abcd1234!')).toEqual({
      hasLetter: true,
      hasNumber: true,
      hasSpecial: true,
      hasMinLength: true,
    });
    expect(getPasswordStrength('abcd')).toBe('weak');
    expect(getPasswordStrength('abcd1234')).toBe('medium');
    expect(getPasswordStrength('abcd1234!')).toBe('strong');
  });

  it('비밀번호 확인 일치를 검사한다', () => {
    expect(validatePasswordConfirm('abcd1234!', 'abcd1234!')).toBe('');
    expect(validatePasswordConfirm('abcd1234!', 'abcd1234?')).toBe(
      '비밀번호가 일치하지 않습니다'
    );
    expect(validatePasswordConfirm('abcd1234!', '')).toBe(
      '비밀번호를 한 번 더 입력해주세요'
    );
  });
});

describe('V-03 닉네임', () => {
  it('한글/영문/숫자 2~12자를 통과시킨다', () => {
    expect(validateNickname('세드플러스')).toBe('');
    expect(validateNickname('seed123')).toBe('');
    expect(validateNickname('가'.repeat(12))).toBe('');
  });

  it('길이·문자 규칙 위반을 안내한다', () => {
    const msg = '2~12자의 한글/영문/숫자만 사용 가능합니다';
    expect(validateNickname('가')).toBe(msg);
    expect(validateNickname('가'.repeat(13))).toBe(msg);
    expect(validateNickname('seed plus')).toBe(msg); // 공백 불가
    expect(validateNickname('seed!')).toBe(msg); // 특수문자 불가
  });
});

describe('V-06 이름', () => {
  it('한글/영문 2~30자를 통과시킨다', () => {
    expect(validateSignupName('홍길동')).toBe('');
    expect(validateSignupName('Hong Gildong')).toBe('');
  });

  it('숫자·특수문자·길이 위반을 안내한다', () => {
    const msg = '이름을 정확히 입력해주세요';
    expect(validateSignupName('홍')).toBe(msg);
    expect(validateSignupName('홍길동2')).toBe(msg);
    expect(validateSignupName('홍길동!')).toBe(msg);
    expect(validateSignupName('가'.repeat(31))).toBe(msg);
  });
});

describe('V-05 인증코드', () => {
  it('6자리 숫자를 통과시킨다', () => {
    expect(validateVerifyCode('123456')).toBe('');
  });

  it('자리수·문자 위반을 안내한다', () => {
    const msg = '인증번호 6자리를 정확히 입력해주세요';
    expect(validateVerifyCode('12345')).toBe(msg);
    expect(validateVerifyCode('1234567')).toBe(msg);
    expect(validateVerifyCode('12345a')).toBe(msg);
    expect(validateVerifyCode('')).toBe('인증번호를 입력해주세요');
  });
});

describe('V-04 프로필 이미지', () => {
  const makeFile = (type: string, size: number) => ({ type, size }) as File;

  it('jpg/png 5MB 이하를 통과시킨다', () => {
    expect(validateProfileImage(makeFile('image/jpeg', 1024))).toBe('');
    expect(validateProfileImage(makeFile('image/png', 5 * 1024 * 1024))).toBe(
      ''
    );
  });

  it('허용되지 않은 형식을 안내한다', () => {
    expect(validateProfileImage(makeFile('image/gif', 1024))).toBe(
      '활용할 수 있는 파일 형식이 아닙니다, JPG, PNG 파일로 변환하거나 해당 파일로 업로드해주세요'
    );
  });

  it('5MB 초과를 안내한다', () => {
    expect(
      validateProfileImage(makeFile('image/png', 5 * 1024 * 1024 + 1))
    ).toBe('5MB 이하의 이미지만 업로드할 수 있습니다');
  });
});

describe('V-07 생년월일 · 만 14세', () => {
  const today = new Date('2026-08-28T00:00:00');

  it('만 14세 이상을 통과시킨다', () => {
    expect(validateBirthDateWithAge('19900101', today)).toBe('');
    expect(validateBirthDateWithAge('20120828', today)).toBe(''); // 생일 당일 만 14세
  });

  it('만 14세 미만을 차단한다', () => {
    const msg = '만 14세 이상부터 가입 가능합니다';
    expect(validateBirthDateWithAge('20120829', today)).toBe(msg); // 하루 차이로 13세
    expect(validateBirthDateWithAge('20200101', today)).toBe(msg);
  });

  it('미래 날짜를 차단한다', () => {
    expect(validateBirthDateWithAge('20261231', today)).toBe(
      '미래 날짜는 입력할 수 없습니다'
    );
  });

  it('형식·존재하지 않는 날짜를 안내한다', () => {
    expect(validateBirthDateWithAge('', today)).toBe('생년월일을 입력해주세요');
    expect(validateBirthDateWithAge('1990-01-01', today)).toBe(
      '생년월일 8자리(YYYYMMDD)를 숫자로 입력해주세요'
    );
    expect(validateBirthDateWithAge('20220230', today)).toBe(
      '존재하지 않는 날짜입니다. 생년월일을 확인해주세요'
    );
  });

  it('만 나이를 생일 기준으로 계산한다', () => {
    expect(getAge('20000827', today)).toBe(26); // 생일 지남
    expect(getAge('20000828', today)).toBe(26); // 생일 당일
    expect(getAge('20000829', today)).toBe(25); // 생일 전
  });
});

describe('validateLoginId', () => {
  it('영문·숫자 4~20자를 허용한다', () => {
    expect(validateLoginId('seedplus01')).toBe('');
    expect(validateLoginId('abcd')).toBe('');
    expect(validateLoginId('a'.repeat(20))).toBe('');
  });

  it('빈 값을 거부한다', () => {
    expect(validateLoginId('')).not.toBe('');
    expect(validateLoginId('   ')).not.toBe('');
  });

  it('길이·문자 제약을 벗어나면 거부한다', () => {
    expect(validateLoginId('abc')).not.toBe(''); // 3자
    expect(validateLoginId('a'.repeat(21))).not.toBe(''); // 21자
    expect(validateLoginId('한글아이디1')).not.toBe('');
    expect(validateLoginId('seed plus')).not.toBe(''); // 공백 포함
    expect(validateLoginId('seed_plus')).not.toBe(''); // 특수문자
  });
});
