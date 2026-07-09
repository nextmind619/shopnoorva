import { store, type StoredOrder } from "./memory-store";
import { uploadBufferObject } from "./integrations/minio";
import { aiConfig } from "./config";

export async function generateInvoice(order: StoredOrder): Promise<{
  invoiceNumber: string;
  invoiceUrl: string;
  html: string;
}> {
  const invoiceNumber = `INV-${order.orderNumber.replace(/[^A-Z0-9]/gi, "").slice(-10)}`;
  const html = buildInvoiceHtml(order, invoiceNumber);
  const buffer = Buffer.from(html, "utf-8");

  const invoiceUrl =
    (await uploadBufferObject(
      `invoices/${invoiceNumber}.html`,
      buffer,
      "text/html"
    )) || `memory://invoices/${invoiceNumber}.html`;

  order.invoiceUrl = invoiceUrl;

  return { invoiceNumber, invoiceUrl, html };
}

function buildInvoiceHtml(order: StoredOrder, invoiceNumber: string): string {
  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${i.name}<br/><span style="color:#888;font-size:12px">${i.sku}</span></td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${i.unitPrice.toFixed(2)} MAD</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${i.lineTotal.toFixed(2)} MAD</td>
      </tr>`
    )
    .join("");

  return `<!doctype html>
<html>
<head><meta charset="utf-8"/><title>${invoiceNumber}</title></head>
<body style="font-family:Georgia,serif;color:#0B0E17;max-width:720px;margin:40px auto;padding:0 20px">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px">
    <div>
      <div style="font-size:28px;letter-spacing:0.2em;font-weight:600">NOOR<span style="color:#C9A962">VA</span></div>
      <div style="color:#888;margin-top:6px">Premium Ambient Lighting · Morocco</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:18px">Invoice</div>
      <div style="color:#C9A962;font-weight:600">${invoiceNumber}</div>
      <div style="color:#888;font-size:13px;margin-top:4px">${new Date(order.createdAt).toLocaleDateString("fr-MA")}</div>
    </div>
  </div>

  <div style="display:flex;gap:40px;margin-bottom:28px">
    <div>
      <div style="font-size:12px;letter-spacing:0.12em;color:#888;text-transform:uppercase">Bill To</div>
      <div style="margin-top:8px">${order.phone}</div>
      <div>${order.email || ""}</div>
      <div>${order.address}</div>
      <div>${order.city}, Morocco</div>
    </div>
    <div>
      <div style="font-size:12px;letter-spacing:0.12em;color:#888;text-transform:uppercase">Order</div>
      <div style="margin-top:8px">${order.orderNumber}</div>
      <div>Payment: ${order.paymentMethod.toUpperCase()}</div>
      <div>Status: ${order.status}</div>
    </div>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <thead>
      <tr style="background:#0B0E17;color:#fff">
        <th style="padding:10px;text-align:left">Item</th>
        <th style="padding:10px;text-align:center">Qty</th>
        <th style="padding:10px;text-align:right">Price</th>
        <th style="padding:10px;text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div style="margin-left:auto;width:280px">
    <div style="display:flex;justify-content:space-between;padding:6px 0;color:#666"><span>Subtotal</span><span>${order.subtotal.toFixed(2)} MAD</span></div>
    <div style="display:flex;justify-content:space-between;padding:6px 0;color:#666"><span>Shipping</span><span>${order.shipping.toFixed(2)} MAD</span></div>
    <div style="display:flex;justify-content:space-between;padding:6px 0;color:#666"><span>Discount</span><span>-${order.discount.toFixed(2)} MAD</span></div>
    <div style="display:flex;justify-content:space-between;padding:10px 0;border-top:2px solid #0B0E17;font-size:18px;font-weight:600"><span>Total</span><span style="color:#C9A962">${order.total.toFixed(2)} MAD</span></div>
  </div>

  <p style="margin-top:40px;color:#888;font-size:12px">Generated automatically by NOORVA AI · ${aiConfig.brand.supportWhatsApp}</p>
</body>
</html>`;
}

export function listInvoices() {
  return store.orders
    .filter((o) => o.invoiceUrl)
    .map((o) => ({
      orderNumber: o.orderNumber,
      invoiceUrl: o.invoiceUrl,
      total: o.total,
      createdAt: o.createdAt,
    }));
}
