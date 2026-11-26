import type { Page } from '@playwright/test';

/**
 * 운영 환경으로 보이게 한다.
 * 배포 서버가 하는 것처럼 env-config.js로 값을 내려 준다(index.html이 이 파일을 읽는다).
 */
export const mockProductionEnv = async (page: Page) => {
  await page.route('/env-config.js', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: `window.__ENV__ = ${JSON.stringify({
        VITE_APP_ENV: 'production',
        VITE_PROD_API_BASE_URL: 'http://localhost:5173',
      })};`,
    })
  );
};
