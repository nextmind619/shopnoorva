# Deploy NOORVA on EasyPanel

Repo: https://github.com/nextmind619/shopnoorva  
Domain: shopnoorva.shop

## 1) Create Project
1. Open EasyPanel Dashboard
2. Click **+ New** (Projects)
3. Name: `shopnoorva`
4. Create

## 2) Add App service (storefront)
Inside project `shopnoorva`:
1. Click **+** (Add service)
2. Choose **App**
3. Source: **GitHub**
4. Repository: `nextmind619/shopnoorva`
5. Branch: `master`
6. Build method: **Dockerfile**
7. Port: `3000`
8. Create service (name: `web`)

### Environment variables (web)
```
NEXT_PUBLIC_SITE_URL=https://shopnoorva.shop
NODE_ENV=production
PORT=3000
CRON_SECRET=change_this_secret
OPENAI_API_KEY=
DATABASE_URL=postgresql://noorva:CHANGE_PASSWORD@postgres:5432/noorva_ai
REDIS_URL=redis://redis:6379
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=noorva
MINIO_SECRET_KEY=CHANGE_MINIO_SECRET
MINIO_BUCKET=noorva
MINIO_USE_SSL=false
N8N_WEBHOOK_BASE=https://n8n.shopnoorva.shop/webhook
EMAIL_FROM=NOORVA <orders@shopnoorva.shop>
SUPPORT_WHATSAPP=+212600000000
```

## 3) Add Postgres
1. Add service → **Postgres**
2. Name: `postgres`
3. User: `noorva`
4. Password: strong password
5. Database: `noorva_ai`
6. Mount/init: paste content of `db/schema.sql` if EasyPanel supports init SQL, otherwise run it once after start

## 4) Add Redis
1. Add service → **Redis**
2. Name: `redis`

## 5) Add MinIO (optional first launch)
1. Add service → **App** from image `minio/minio`
2. Command: `server /data --console-address ":9001"`
3. Ports: `9000`, `9001`
4. Env:
```
MINIO_ROOT_USER=noorva
MINIO_ROOT_PASSWORD=CHANGE_MINIO_SECRET
```

## 6) Add n8n (optional first launch)
1. Add service → **App** from image `n8nio/n8n`
2. Port: `5678`
3. Domain later: `n8n.shopnoorva.shop`

## 7) Connect domain
1. Open service `web` → **Domains**
2. Add: `shopnoorva.shop`
3. Add: `www.shopnoorva.shop`
4. Enable HTTPS

### DNS at your domain registrar
Point to your EasyPanel server IP: `187.77.180.117`

| Type | Name | Value |
|------|------|--------|
| A | `@` | `187.77.180.117` |
| A | `www` | `187.77.180.117` |

## 8) Deploy order (recommended)
1. Create project `shopnoorva`
2. Add `postgres` + `redis` first and wait green
3. Add `web` (GitHub + Dockerfile) and deploy
4. Attach domain
5. Later add MinIO + n8n + Evolution

## 9) Test
- https://shopnoorva.shop/fr
- https://shopnoorva.shop/admin/ai
- Create a test COD order
