# Domain: shopnoorva.shop

Official store domain for **NOORVA**.

## After purchase — DNS setup

### If hosting on Vercel
1. Vercel → Project → Settings → Domains → Add `shopnoorva.shop` and `www.shopnoorva.shop`
2. At your registrar, set:

| Type | Name | Value |
|------|------|--------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

### If using Cloudflare DNS (recommended)
1. Add site `shopnoorva.shop` to Cloudflare
2. Change nameservers at registrar to Cloudflare NS
3. Proxy ON (orange cloud)
4. SSL/TLS → Full (strict)
5. Point to Vercel / EasyPanel as above

## Env
```
NEXT_PUBLIC_SITE_URL=https://shopnoorva.shop
EMAIL_FROM=NOORVA <orders@shopnoorva.shop>
```

## Brand handles (suggested)
- Instagram: `@shopnoorva` or `@noorva.shop`
- TikTok: `@shopnoorva`
- WhatsApp Business: link in bio → `https://shopnoorva.shop/fr`
