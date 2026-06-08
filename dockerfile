FROM oven/bun:1.3 AS base

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM nginx:alpine AS prod

RUN rm -rf /usr/share/nginx/html/* \
    && sed -i 's|error_log.*|error_log /dev/stderr warn;|' /etc/nginx/nginx.conf \
    && sed -i 's|access_log.*|access_log /dev/stdout main;|' /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*
COPY --from=base /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
