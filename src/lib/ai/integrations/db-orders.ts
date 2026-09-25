import { getPool, isDbConfigured } from "@/lib/db";
import { logIntegration } from "./logger";
import type { StoredOrder } from "@/lib/ai/memory-store";

/**
 * Write-through persistence to the real Postgres database (db/schema.sql).
 * Mirrors the dry-run pattern used by the other integrations: if
 * DATABASE_URL is not configured, this logs and continues so the order
 * pipeline keeps working locally without infra.
 */
export async function persistOrderToDb(order: StoredOrder): Promise<void> {
  if (!isDbConfigured()) {
    await logIntegration("postgres", "insert-order", "ok", { orderNumber: order.orderNumber }, { dryRun: true });
    return;
  }

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const orderResult = await client.query(
      `INSERT INTO orders (
        order_number, phone, email, city, address,
        subtotal, shipping, discount, total,
        payment_method, status, fraud_score, fraud_flags,
        is_duplicate, tracking_number, invoice_url, source, metadata, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'website',$17,$18)
      ON CONFLICT (order_number) DO NOTHING
      RETURNING id`,
      [
        order.orderNumber,
        order.phone,
        order.email || null,
        order.city,
        order.address,
        order.subtotal,
        order.shipping,
        order.discount,
        order.total,
        order.paymentMethod,
        order.status,
        order.fraudScore,
        JSON.stringify(order.fraudFlags || []),
        order.isDuplicate,
        order.trackingNumber || null,
        order.invoiceUrl || null,
        JSON.stringify({
          firstName: order.firstName,
          lastName: order.lastName,
          attribution: order.attribution || null,
        }),
        order.createdAt,
      ]
    );

    const orderId = orderResult.rows[0]?.id;
    if (orderId) {
      for (const item of order.items) {
        await client.query(
          `INSERT INTO order_items (order_id, sku, name, quantity, unit_price, line_total)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [orderId, item.sku, item.name, item.quantity, item.unitPrice, item.lineTotal]
        );
      }
    }

    await client.query("COMMIT");
    await logIntegration("postgres", "insert-order", "ok", { orderNumber: order.orderNumber }, { orderId });
  } catch (error) {
    await client.query("ROLLBACK");
    await logIntegration("postgres", "insert-order", "error", { orderNumber: order.orderNumber }, {
      error: error instanceof Error ? error.message : "db_insert_failed",
    });
  } finally {
    client.release();
  }
}

function asNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function mapOrderRows(
  rows: Array<Record<string, unknown>>
): StoredOrder[] {
  return rows.map((row) => {
    const meta =
      row.metadata && typeof row.metadata === "object" ? (row.metadata as Record<string, unknown>) : {};
    const items = Array.isArray(row.items) ? row.items : [];
    return {
      id: `db-${row.order_number}`,
      orderNumber: String(row.order_number),
      firstName: typeof meta.firstName === "string" ? meta.firstName : undefined,
      lastName: typeof meta.lastName === "string" ? meta.lastName : undefined,
      phone: String(row.phone || ""),
      email: (row.email as string) || undefined,
      city: String(row.city || ""),
      address: String(row.address || ""),
      items: items.map((item: { sku?: string; name?: string; quantity?: unknown; unitPrice?: unknown; lineTotal?: unknown }) => ({
        sku: String(item.sku || ""),
        name: String(item.name || item.sku || "Produit"),
        quantity: asNumber(item.quantity, 1),
        unitPrice: asNumber(item.unitPrice),
        lineTotal: asNumber(item.lineTotal),
      })),
      subtotal: asNumber(row.subtotal),
      shipping: asNumber(row.shipping),
      discount: asNumber(row.discount),
      total: asNumber(row.total),
      paymentMethod: String(row.payment_method || "cod"),
      status: String(row.status || "confirmed"),
      fraudScore: asNumber(row.fraud_score),
      fraudFlags: Array.isArray(row.fraud_flags) ? row.fraud_flags.map(String) : [],
      isDuplicate: Boolean(row.is_duplicate),
      trackingNumber: (row.tracking_number as string) || undefined,
      invoiceUrl: (row.invoice_url as string) || undefined,
      createdAt:
        row.created_at instanceof Date
          ? row.created_at.toISOString()
          : String(row.created_at || new Date().toISOString()),
    };
  });
}

const ORDER_SELECT = `SELECT
        o.order_number,
        o.phone,
        o.email,
        o.city,
        o.address,
        o.subtotal,
        o.shipping,
        o.discount,
        o.total,
        o.payment_method,
        o.status,
        o.fraud_score,
        o.fraud_flags,
        o.is_duplicate,
        o.tracking_number,
        o.invoice_url,
        o.metadata,
        o.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'sku', i.sku,
              'name', i.name,
              'quantity', i.quantity,
              'unitPrice', i.unit_price,
              'lineTotal', i.line_total
            ) ORDER BY i.id
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'
        ) AS items
     FROM orders o
     LEFT JOIN order_items i ON i.order_id = o.id`;

export async function findOrdersByPhone(phoneOrOrder: string, limit = 5): Promise<StoredOrder[]> {
  if (!isDbConfigured()) return [];

  const digits = phoneOrOrder.replace(/\D/g, "");
  if (!digits && !phoneOrOrder.trim()) return [];

  const pool = getPool();
  const isLikelyOrder = /[A-Za-z]/.test(phoneOrOrder) || digits.length < 9;
  const phoneTail = digits.slice(-9) || "___nomatch___";
  const orderNeedle = isLikelyOrder ? phoneOrOrder.trim() : phoneTail;

  const result = await pool.query(
    `${ORDER_SELECT}
     WHERE (
       ($1 <> '___nomatch___' AND regexp_replace(COALESCE(o.phone, ''), '\\D', '', 'g') LIKE '%' || $1)
       OR o.order_number ILIKE '%' || $2 || '%'
     )
     GROUP BY o.id
     ORDER BY o.created_at DESC
     LIMIT $3`,
    [phoneTail, orderNeedle, Math.min(20, Math.max(1, limit))]
  );

  return mapOrderRows(result.rows as Array<Record<string, unknown>>);
}

export async function loadRecentOrdersFromDb(limit = 40): Promise<StoredOrder[]> {
  if (!isDbConfigured()) return [];

  const pool = getPool();
  const result = await pool.query(
    `${ORDER_SELECT}
     WHERE o.status IN ('confirmed', 'review', 'pending')
     GROUP BY o.id
     ORDER BY o.created_at DESC
     LIMIT $1`,
    [Math.min(100, Math.max(1, limit))]
  );

  return mapOrderRows(result.rows as Array<Record<string, unknown>>);
}
