# Stage 1: Build Node.js application (Vite)
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# 베이스 이미지에 남아있는 OS 패키지 보안 패치를 적용한다.
# (예: CVE-2026-14456 openssl 3.5.7-r0 → 3.5.8-r0)
# 이 단계가 없으면 베이스 이미지 갱신 전까지 CI의 Trivy 취약점 스캔이 실패한다.
RUN apk upgrade --no-cache

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]