# Stage 1: Build Node.js application (Vite)
FROM node:22-alpine AS builder
WORKDIR /app

# 패키지 설치
COPY package.json package-lock.json* ./
RUN npm ci

# 소스코드 및 GitHub Actions가 생성한 .env 파일 복사
COPY . .

# Vite 빌드 실행 (.env 변수가 정적 파일에 하드코딩됨)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# 기본 설정 파일 삭제 및 커스텀 Nginx 설정 파일 복사
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# 빌드된 정적 파일 복사
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Changed: 443 포트 제거, 80 포트만 노출
# 443 포트의 경우 Ansible로 구성한 리버스 프록시단에서 처리
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]