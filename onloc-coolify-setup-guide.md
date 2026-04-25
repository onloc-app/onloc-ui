# onloc on Coolify — Setup Guide

## 1. Create a New Resource

In your Coolify project, click **+ New Resource** and select **"Docker Compose Empty"**.

---

## 2. Paste the Compose File

Open **"Edit Compose File"** and paste:

```yaml
services:
  api:
    image: 'calvicii/onloc-api:latest'
    environment:
      - 'DATABASE_URL=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@db:5432/$POSTGRES_DB?schema=public'
      - PORT=4000
    healthcheck:
      test:
        - CMD-SHELL
        - 'wget -qO- http://api:4000/api/health || exit 1'
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    volumes:
      - './uploads:/app/uploads:Z'
  ui:
    image: 'calvicii/onloc-ui:latest'
    environment:
      - PORT=3000
    healthcheck:
      test:
        - CMD-SHELL
        - 'wget -qO- http://ui:3000/health || exit 1'
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    depends_on:
      - api
    restart: unless-stopped
  db:
    image: 'postgres:16-alpine'
    environment:
      - 'POSTGRES_DB=${POSTGRES_DB:-onloc}'
      - 'POSTGRES_USER=${POSTGRES_USER:-onloc}'
      - 'POSTGRES_PASSWORD=${POSTGRES_PASSWORD}'
    volumes:
      - 'onloc-db-data:/var/lib/postgresql/data'
    healthcheck:
      test:
        - CMD-SHELL
        - 'pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}'
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    restart: unless-stopped
  caddy:
    image: 'caddy:2-alpine'
    restart: unless-stopped
    configs:
      -
        source: caddyfile
        target: /etc/caddy/Caddyfile
    healthcheck:
      test:
        - CMD-SHELL
        - 'wget -qO- http://caddy:80 || exit 1'
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    depends_on:
      api:
        condition: service_healthy
      ui:
        condition: service_healthy
configs:
  caddyfile:
    content: |-
      :80 {
          reverse_proxy /api* api:4000
          reverse_proxy /ws* api:4000
          reverse_proxy /docs* api:4000
          reverse_proxy /uploads* api:4000
          reverse_proxy ui:3000
      }
```

---

## 3. Set Environment Variables

In the **Environment Variables** section, set:

| Variable | Value |
|----------|-------|
| `POSTGRES_DB` | `onloc` (or custom) |
| `POSTGRES_DB_USER` | `onloc` (or custom) |
| `POSTGRES_DB_PASSWORD` | **choose a strong password** |

---

## 4. Assign the Domain

Assign your domain to the **`caddy`** service only, with port `80`:

```
https://onloc.yourdomain.com:80
```

Do not assign a domain to `api`, `ui`, or `db`.

---

## 5. Deploy

Click **Deploy** and wait for all four services to turn green in Coolify.

---

## 6. Restart the Proxy

Go to **Servers → your server → Proxy** and restart the proxy. This is required so Coolify generates the SSL certificate for your domain.

Once the proxy is back up, wait a moment for the SSL certificate to be issued and become valid — this can take up to several minutes. Then open your domain in the browser — onloc should be up and running.

---

## Troubleshooting

If one or more services stay red, check the service logs in Coolify for details and refer to the hints below.

**`db` is not healthy**
Make sure `POSTGRES_DB_USER` and `POSTGRES_DB_PASSWORD` are set correctly. The health check uses these variables internally — a mismatch will cause `pg_isready` to fail.

**`api` is not healthy**
The API depends on `db` being healthy first. If `db` is green but `api` stays red, check that the `DATABASE_URL` environment variable is correct and that all three Postgres variables (`POSTGRES_DB`, `POSTGRES_DB_USER`, `POSTGRES_DB_PASSWORD`) are consistent between the `api` and `db` services.

**`caddy` is not healthy**
Caddy only starts after both `api` and `ui` are healthy. If either of those is still red, fix them first — Caddy will follow automatically.

**Site not reachable in the browser**
Verify that the domain is assigned to the `caddy` service (not `api` or `ui`) and that the port is set to `80`. Coolify handles HTTPS in front of Caddy, so Caddy itself only needs to listen on port 80.
