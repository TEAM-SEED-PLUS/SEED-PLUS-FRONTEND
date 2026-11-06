// BM 1차 상품 정의 (BM구조 기획록 기준). 가격·혜택 문구를 한곳에서 관리한다.
// EXPERT는 2차 구현 대상이라 판매하지 않고, 요금제 소개에서도 블러로만 노출한다.

export type CheckoutProductId = 'pro-monthly' | 'pro-yearly' | 'single-report';

export const FREE_FEATURES = [
  '상권날씨, 뉴스 무제한',
  '생존율 계산기 요약 결과 제공',
  '상가 저장 3개',
  '커뮤니티 읽기, 글 작성 가능',
];

export const PRO_FEATURES = [
  '상권날씨, 뉴스 무제한',
  '생존율 계산기 전체 결과 제공',
  '생존율 계산기 PDF 저장 가능',
  'Property score 제공',
  '상가 무제한 저장 가능',
  '상가 1대1 비교 가능',
  '저장 상권 최신화 알림 전송',
];

export const SINGLE_REPORT_FEATURES = [
  '블러 처리된 생존율 상세 결과 해제',
  '해당 리포트 PDF 저장 가능',
];

type CheckoutProduct = {
  title: string;
  /** 큰 글씨 가격 줄 */
  price: string;
  priceUnit?: string;
  /** 가격 아래 보조 줄 */
  priceNote?: string;
  features: string[];
};

export const CHECKOUT_PRODUCTS: Record<CheckoutProductId, CheckoutProduct> = {
  'pro-monthly': {
    title: 'PRO 요금제',
    price: '5,900원',
    priceUnit: '/ 월',
    priceNote: '연간 결제시 59,000원 / 16% 할인',
    features: PRO_FEATURES,
  },
  'pro-yearly': {
    title: 'PRO 요금제 (연간)',
    price: '59,000원',
    priceUnit: '/ 년',
    priceNote: '월 5,900원 대비 16% 할인',
    features: PRO_FEATURES,
  },
  'single-report': {
    title: '생존율 리포트 단건 결제',
    price: '9,000원',
    priceNote: '해당 리포트 1건',
    features: SINGLE_REPORT_FEATURES,
  },
};

export const isCheckoutProductId = (
  value: string | null
): value is CheckoutProductId =>
  value === 'pro-monthly' ||
  value === 'pro-yearly' ||
  value === 'single-report';

/** 결제방법 (Figma '요금제 선택 후 결제 화면') */
export const PAYMENT_METHODS = [
  '카카오페이',
  '토스페이',
  '페이코',
  '네이버페이',
  '카드',
  '현금',
  '휴대폰',
] as const;
