import type { Page, Route } from '@playwright/test';

const APP_ORIGIN = 'http://localhost:5173';

// 브라우저의 출처 검사를 통과시키는 허가 헤더
export const corsHeaders = {
  'access-control-allow-origin': APP_ORIGIN,
  'access-control-allow-credentials': 'true',
};

// 백엔드 공통 봉투 모양으로 성공 응답을 돌려준다
export const fulfillJson = (route: Route, data: unknown) => {
  // 사전 확인 요청(OPTIONS)에는 허가만 돌려준다
  if (route.request().method() === 'OPTIONS') {
    return route.fulfill({
      status: 204,
      headers: {
        ...corsHeaders,
        'access-control-allow-methods': 'GET, POST, OPTIONS',
        'access-control-allow-headers':
          route.request().headers()['access-control-request-headers'] ?? '',
      },
    });
  }

  return route.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: corsHeaders,
    body: JSON.stringify({ status: 200, code: 0, message: 'OK', data }),
  });
};

/** 비회원 상태: 로그인 확인이 실패하게 한다 */
export const mockGuest = async (page: Page) => {
  await page.route('**/api/v1/auth/csrf', (route) =>
    route.fulfill({ status: 401 })
  );
};

/** 로그인 상태: 로그인 확인 요청 세 개에 성공 응답을 돌려준다 */
export const mockLoggedIn = async (page: Page) => {
  // 아래에서 따로 정하지 않은 API 요청은 실제 서버로 보내지 않고 실패시킨다.
  // (나중에 등록한 가로채기가 먼저 적용되므로, 이 줄이 가장 낮은 순위다.)
  await page.route('**/api/v1/**', (route) =>
    route.fulfill({ status: 503, headers: corsHeaders })
  );

  await page.route('**/api/v1/auth/csrf', (route) =>
    fulfillJson(route, {
      headerName: 'tester-csrf-header',
      parameterName: 'tester-csrf-parameter',
      token: 'tester-csrf-token',
    })
  );

  await page.route('**/api/v1/auth/reissue', (route) =>
    fulfillJson(route, {
      accessToken: 'tester-access-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
    })
  );

  await page.route('**/api/v1/users/me', (route) =>
    fulfillJson(route, {
      loginId: 'tester-login-id',
      email: 'tester@example.com',
      name: 'Tester',
      role: 'GENERAL',
      status: 'ACTIVE',
    })
  );
};
