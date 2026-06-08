FROM oven/bun:1.3 AS base

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM nginxinc/nginx-unprivileged:alpine3.23-perl AS prod

COPY --from=base /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
USER 101

CMD ["nginx", "-g", "daemon off;"]
