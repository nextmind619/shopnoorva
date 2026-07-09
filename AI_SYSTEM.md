# NOORVA AI Ecommerce System

Fully automated ecommerce operations layer for Morocco (COD-first).

## What runs automatically

| Capability | Endpoint / Trigger |
|---|---|
| Answer customers | `POST /api/ai/support` + Evolution webhook |
| Recover abandoned carts | `PUT /api/ai/cart` + hourly cron |
| Upsell / Cross-sell | On every confirmed order |
| Track shipments | `GET/POST /api/ai/shipments` |
| Detect fake orders | Fraud scoring in order pipeline |
| Detect duplicate orders | 30-minute duplicate window |
| Generate invoices | HTML invoice → MinIO |
| WhatsApp / SMS / Email | `POST /api/ai/messages` |
| Daily / monthly analytics | `GET/POST /api/ai/analytics` |
| Predict best sellers + stock | `GET /api/ai/inventory` |
| Auto reorder | Stock alerts + purchase orders |
| Cron tick | `POST /api/ai/cron` |

## Stack connections

- **OpenAI** — support replies, fraud narrative, upsell copy, reports
- **Evolution API** — WhatsApp inbound/outbound
- **n8n** — orchestration webhooks + hourly cron
- **PostgreSQL** — schema in `db/schema.sql`
- **Redis** — job queue (`noorva:jobs`)
- **MinIO** — invoices + analytics reports
- **Google Sheets** — daily analytics / orders sync via webhook
- **Meta + TikTok** — server-side conversion events
- **EasyPanel** — deploy compose + cron against `/api/ai/cron`

## Quick start

```bash
# 1) Infrastructure
docker compose up -d

# 2) App env
cp .env.example .env.local
# set OPENAI_API_KEY, EVOLUTION_*, N8N_*, REDIS_URL, DATABASE_URL, MINIO_*

# 3) App
npm run dev

# 4) Open AI control room
http://localhost:3000/admin/ai
```

## EasyPanel cron

```
POST https://your-app/api/ai/cron
Header: x-cron-secret: $CRON_SECRET
Body: {"task":"tick"}
Schedule: every 15-60 minutes

Monthly:
Body: {"task":"monthly"}
Schedule: 1st of month 06:00 Africa/Casablanca
```

## Evolution webhook

Point Evolution instance webhook to:

```
POST https://your-app/api/ai/webhooks/evolution
```

Inbound WhatsApp messages are answered automatically.

## Checkout integration

Store checkout already routes through AI:

`POST /api/orders` → fraud check → invoice → WhatsApp/SMS/Email → shipment → Meta/TikTok → Sheets → n8n → stock reorder

## Dry-run mode

If keys are missing, connectors log dry-run events and continue.
This lets the full automation path work locally without external services.
