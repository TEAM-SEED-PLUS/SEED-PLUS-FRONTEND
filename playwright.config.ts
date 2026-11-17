import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  use: {
    baseURL: 'http://localhost:5173',
    // 실패한 테스트만 단계별 기록과 화면을 남긴다(test-results/). 통과한 것은 남기지 않는다.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
