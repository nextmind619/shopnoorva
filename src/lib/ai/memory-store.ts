/**
 * In-memory fallback store when Postgres/Redis are not running.
 * Production uses DATABASE_URL + REDIS_URL; this keeps automation testable locally.
 */

export type JobStatus = "queued" | "running" | "done" | "failed";

export interface AiJob {
  id: string;
  jobType: string;
  payload: Record<string, unknown>;
  status: JobStatus;
  attempts: number;
  lastError?: string;
  runAt: string;
  createdAt: string;
  finishedAt?: string;
}

export interface StoredOrder {
  id: string;
  orderNumber: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  items: Array<{ sku: string; name: string; quantity: number; unitPrice: number; lineTotal: number }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: string;
  fraudScore: number;
  fraudFlags: string[];
  isDuplicate: boolean;
  duplicateOf?: string;
  trackingNumber?: string;
  invoiceUrl?: string;
  createdAt: string;
}

export interface AbandonedCart {
  id: string;
  sessionId: string;
  phone?: string;
  email?: string;
  items: Array<{ productId: string; variantId: string; quantity: number; name: string; price: number }>;
  subtotal: number;
  recoveryStage: number;
  recovered: boolean;
  lastNotifiedAt?: string;
  recoveredOrderId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ConversationMessage {
  role: "customer" | "assistant" | "system";
  content: string;
  aiGenerated?: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  channel: "whatsapp" | "email" | "sms" | "web";
  phone?: string;
  email?: string;
  locale: string;
  messages: ConversationMessage[];
  status: "open" | "closed";
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  channel: "whatsapp" | "sms" | "email";
  recipient: string;
  templateKey?: string;
  subject?: string;
  body: string;
  status: "queued" | "sent" | "failed";
  createdAt: string;
  sentAt?: string;
  error?: string;
}

export interface DailyAnalytics {
  day: string;
  ordersCount: number;
  revenue: number;
  aov: number;
  abandonedCarts: number;
  recoveredCarts: number;
  recoveryRevenue: number;
  fakeOrdersBlocked: number;
  duplicatesBlocked: number;
  messagesSent: number;
  aiReplies: number;
  topProducts: Array<{ sku: string; name: string; units: number; revenue: number }>;
}

export interface StockAlert {
  id: string;
  sku: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  suggestedQty: number;
  status: "open" | "ordered" | "closed";
  autoPoCreated: boolean;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  sku: string;
  quantity: number;
  status: "draft" | "sent" | "received";
  createdAt: string;
}

class MemoryStore {
  orders: StoredOrder[] = [];
  carts: AbandonedCart[] = [];
  conversations: Conversation[] = [];
  notifications: NotificationRecord[] = [];
  jobs: AiJob[] = [];
  daily: DailyAnalytics[] = [];
  stockAlerts: StockAlert[] = [];
  purchaseOrders: PurchaseOrder[] = [];
  inventory: Record<string, number> = {
    "NRV-CRYSTAL-01": 86,
    "NRV-CAROUSEL-01": 120,
    "NRV-STAR-01": 64,
    "NRV-ASTRO-01": 72,
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __noorvaAiStore: MemoryStore | undefined;
}

export const store: MemoryStore = globalThis.__noorvaAiStore ?? new MemoryStore();
if (!globalThis.__noorvaAiStore) globalThis.__noorvaAiStore = store;

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
