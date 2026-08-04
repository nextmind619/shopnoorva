# Deploy NOORVA on EasyPanel

Repo: https://github.com/nextmind619/shopnoorva  
Domain: shopnoorva.shop  
Server: `187.77.180.117`

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

> **Critical:** Do not duplicate keys. In EasyPanel the **last** value wins.  
> Never leave `EVOLUTION_API_URL=https://your-evolution-api-host` — that breaks WhatsApp orders.  
> Hostnames: `{project}_{service}` (e.g. `shopnoorva_evolution-api`).  
> After Save → **restart** (or Deploy) so `web` reloads env.

```
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SITE_URL=https://shopnoorva.shop
DATABASE_URL=postgresql://noorva:CHANGE_PASSWORD@shopnoorva_noorva:5432/noorva_ai
REDIS_URL=redis://default:CHANGE_PASSWORD@shopnoorva_redis:6379
EVOLUTION_API_URL=http://shopnoorva_evolution-api:8080
EVOLUTION_API_KEY=CHANGE_EVOLUTION_API_KEY
EVOLUTION_INSTANCE=noorva
ADMIN_WHATSAPP=+212693428013
SUPPORT_WHATSAPP=+212693428013
OPENAI_API_KEY=
CRON_SECRET=change_this_secret
EMAIL_FROM=NOORVA <orders@shopnoorva.shop>
# Meta Pixel + Conversions API (prefer these names; legacy NEXT_PUBLIC_FB_PIXEL_ID / META_ACCESS_TOKEN still work)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=
FACEBOOK_ACCESS_TOKEN=
FACEBOOK_TEST_EVENT_CODE=
FACEBOOK_DATASET_ID=
```

### Google Sheets (order sync)

Share the spreadsheet with your service account email (Editor). Add to `web` env:

```
GOOGLE_SHEETS_ID=1zA2CxZKuLXU6AiP6JByxhGv2Mg-kXqCoKsaQN3wvp7k
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ORDER_SHEET=leads
```

Test locally: `npm run test:google-sheets` (requires `.env.local`).

## 3) Add Postgres
1. Add service → **Postgres** (or App named `noorva`)
2. User: `noorva`
3. Password: same as in `DATABASE_URL`
4. Database: `noorva_ai`
5. Init with `db/schema.sql` if supported

## 4) Add Redis
1. Add service → **Redis**, name: `redis`
2. Use hostname `shopnoorva_redis` in `REDIS_URL`

## 5) Add Evolution API (WhatsApp orders)
1. Add Evolution API service named `evolution-api`, port `8080`
2. API key must match `EVOLUTION_API_KEY` on `web`
3. Create instance **`noorva`** and scan QR until connected
4. On `web` use: `EVOLUTION_API_URL=http://shopnoorva_evolution-api:8080`

### WhatsApp checklist
- [ ] `evolution-api` green / running
- [ ] Instance `noorva` connected
- [ ] `web` has **one** set of `EVOLUTION_*` (no placeholders, no duplicates)
- [ ] Save + restart `web`
- [ ] Test COD order → admin gets WhatsApp `طلب جديد — NOORVA`

## 6) MinIO (optional)
Image `minio/minio`, command: `server /data --console-address ":9001"`, ports `9000`/`9001`.

## 7) n8n (optional)
Image `n8nio/n8n`, port `5678`, domain `n8n.shopnoorva.shop`.

## 8) Domains
1. `web` → Domains → `shopnoorva.shop` + `www.shopnoorva.shop` + HTTPS
2. DNS A records `@` and `www` → `187.77.180.117`

## 9) Deploy order
1. Postgres + Redis green
2. Evolution API + instance `noorva` connected
3. Deploy `web` with clean env
4. Attach domain; later MinIO + n8n

## 10) Test
- https://shopnoorva.shop/fr
- https://shopnoorva.shop/admin/ai
- Create test COD order → WhatsApp to `ADMIN_WHATSAPP`
