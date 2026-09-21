import type { FaqItem } from './supportTypes';

// ※ 자리표시 데이터. 기획팀이 질문·답변을 전달하면 이 파일만 교체한다.
// 카테고리 목록은 항목에서 파생하므로 항목의 category 값만 맞추면 칩이 자동으로 생긴다.
// 검색 기능은 2차 범위라 넣지 않았다.
export const FAQ_CATEGORIES = [
  '서비스 이용',
  '계정',
  '상권날씨',
  '내 상가 만들기',
] as const;

export const faqItems: FaqItem[] = [
  {
    id: 'general-what-is-seedplus',
    audience: 'general',
    category: '서비스 이용',
    question: 'SEED+는 어떤 서비스인가요?',
    answer: [
      'SEED+는 예비 창업자와 소상공인이 상권과 상가를 데이터로 살펴볼 수 있도록 돕는 서비스입니다.',
      '(예시 문구입니다. 기획팀 전달 내용으로 교체 예정)',
    ],
  },
  {
    id: 'general-signup',
    audience: 'general',
    category: '계정',
    question: '회원가입은 어떻게 하나요?',
    answer: [
      '상단의 로그인 버튼을 누른 뒤 회원가입을 선택하면 아이디와 휴대폰 번호로 가입하실 수 있습니다.',
      '(예시 문구입니다. 기획팀 전달 내용으로 교체 예정)',
    ],
  },
  {
    id: 'general-weather-time-band',
    audience: 'general',
    category: '상권날씨',
    question: '상권날씨의 시간대는 어떻게 나뉘나요?',
    answer: [
      '심야(00~06시), 아침(06~12시), 점심(12~17시), 오후(17~20시), 저녁(20~24시)의 다섯 시간대로 나뉩니다.',
      '(예시 문구입니다. 기획팀 전달 내용으로 교체 예정)',
    ],
  },
  {
    id: 'general-store-builder-login',
    audience: 'general',
    category: '내 상가 만들기',
    question: '내 상가 만들기는 로그인해야 이용할 수 있나요?',
    answer: [
      '네, 내 상가 만들기는 로그인 후 이용하실 수 있습니다.',
      '(예시 문구입니다. 기획팀 전달 내용으로 교체 예정)',
    ],
  },
  {
    id: 'partner-register',
    audience: 'partner',
    category: '서비스 이용',
    question: '공인중개사·전문가로 참여하려면 어떻게 하나요?',
    answer: [
      '파트너 참여 방법은 준비 중입니다. 문의하기를 통해 남겨주시면 안내드리겠습니다.',
      '(예시 문구입니다. 기획팀 전달 내용으로 교체 예정)',
    ],
  },
  {
    id: 'partner-account',
    audience: 'partner',
    category: '계정',
    question: '파트너 계정은 일반 계정과 무엇이 다른가요?',
    answer: [
      '파트너 계정의 세부 기능은 준비 중입니다.',
      '(예시 문구입니다. 기획팀 전달 내용으로 교체 예정)',
    ],
  },
  {
    id: 'partner-weather-data',
    audience: 'partner',
    category: '상권날씨',
    question: '상권날씨 데이터의 출처는 무엇인가요?',
    answer: [
      '공공데이터를 바탕으로 실시간에 가깝게 집계합니다.',
      '(예시 문구입니다. 기획팀 전달 내용으로 교체 예정)',
    ],
  },
  {
    id: 'partner-store-builder',
    audience: 'partner',
    category: '내 상가 만들기',
    question: '내 상가 만들기의 상가 정보는 어떻게 등록되나요?',
    answer: [
      '상가 정보 등록 방식은 준비 중입니다.',
      '(예시 문구입니다. 기획팀 전달 내용으로 교체 예정)',
    ],
  },
];
