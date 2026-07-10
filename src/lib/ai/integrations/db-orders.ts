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
        JSON.stringify({ firstName: order.firstName, lastName: order.lastName }),
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
