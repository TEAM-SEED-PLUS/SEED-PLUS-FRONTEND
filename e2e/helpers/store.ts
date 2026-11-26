import type { Page } from '@playwright/test';
import { corsHeaders, fulfillJson } from './auth';

const districts = [
  {
    regionId: 10,
    sido: '서울특별시',
    sigungu: '강남구',
    code: '11680',
    codeType: 'SIGUNGU',
  },
  {
    regionId: 11,
    sido: '서울특별시',
    sigungu: '마포구',
    code: '11440',
    codeType: 'SIGUNGU',
  },
];

const legalDongs = [
  {
    regionId: 101,
    sido: '서울특별시',
    sigungu: '강남구',
    dong: '역삼동',
    code: '1168010100',
    codeType: 'LEGAL_DONG',
  },
  {
    regionId: 111,
    sido: '서울특별시',
    sigungu: '마포구',
    dong: '서교동',
    code: '1144012000',
    codeType: 'LEGAL_DONG',
  },
];

/** 내 상가 만들기의 업종·지역 목록. mockLoggedIn 뒤에 불러야 적용된다. */
export const mockStoreMetadata = async (page: Page) => {
  await page.route('**/api/v1/industries*', (route) =>
    fulfillJson(route, [
      { industryId: 1, industryCode: 'I2', name: '음식점', level: 'LARGE' },
      { industryId: 2, industryCode: 'I1', name: '카페/음료', level: 'LARGE' },
    ])
  );

  // 지역 API는 공통 봉투 없이 배열을 그대로 돌려준다.
  // 자치구와 법정동이 같은 주소를 쓰고 codeType 값으로만 갈린다.
  await page.route('**/api/v1/regions*', (route) => {
    const codeType = new URL(route.request().url()).searchParams.get(
      'codeType'
    );

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: corsHeaders,
      body: JSON.stringify(codeType === 'LEGAL_DONG' ? legalDongs : districts),
    });
  });
};
