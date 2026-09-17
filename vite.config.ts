/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // 상권날씨 AI(FastAPI)는 CORS 미들웨어가 없어 브라우저 직접 호출이 막힌다.
      // 로컬에서는 같은 오리진으로 프록시해 우회하며, 경로는 배포 환경의
      // Nginx 프록시(/ai)와 동일하게 맞춘다.
      // 기본 대상은 uvicorn 기본 포트(8000). 다른 포트면 AI_API_PROXY_TARGET로 지정.
      '/ai': {
        target: process.env.AI_API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/ai/, ''),
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
