-- NOORVA AI Ecommerce System Schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(32) NOT NULL UNIQUE,
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  city VARCHAR(100),
  locale VARCHAR(5) DEFAULT 'fr',
  total_orders INT DEFAULT 0,
  total_spent NUMERIC(12,2) DEFAULT 0,
  risk_score NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(64) UNIQUE NOT NULL,
  slug VARCHAR(160) UNIQUE NOT NULL,
  name_fr VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  name_en VARCHAR(255),
  price NUMERIC(12,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  reorder_point INT NOT NULL DEFAULT 20,
  reorder_qty INT NOT NULL DEFAULT 50,
  sold_30d INT DEFAULT 0,
  predicted_demand_30d INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(40) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(255),
  city VARCHAR(100),
  address TEXT,
  subtotal NUMERIC(12,2) NOT NULL,
  shipping NUMERIC(12,2) DEFAULT 0,
  discount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) NOT NULL,
  payment_method VARCHAR(32) DEFAULT 'cod',
  status VARCHAR(32) DEFAULT 'pending',
  fraud_score NUMERIC(5,2) DEFAULT 0,
  fraud_flags JSONB DEFAULT '[]',
  is_duplicate BOOLEAN DEFAULT FALSE,
  duplicate_of UUID REFERENCES orders(id),
  tracking_number VARCHAR(100),
  carrier VARCHAR(64),
  invoice_url TEXT,
  source VARCHAR(64) DEFAULT 'website',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  sku VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(128) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  phone VARCHAR(32),
  email VARCHAR(255),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(12,2) DEFAULT 0,
  recovery_stage INT DEFAULT 0,
  recovered BOOLEAN DEFAULT FALSE,
  recovered_order_id UUID REFERENCES orders(id),
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel VARCHAR(32) NOT NULL, -- whatsapp | email | sms | web
  customer_id UUID REFERENCES customers(id),
  phone VARCHAR(32),
  email VARCHAR(255),
  status VARCHAR(32) DEFAULT 'open',
  locale VARCHAR(5) DEFAULT 'fr',
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(16) NOT NULL, -- customer | assistant | system
  content TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tracking_number VARCHAR(100) UNIQUE,
  carrier VARCHAR(64),
  status VARCHAR(32) DEFAULT 'pending',
  events JSONB DEFAULT '[]',
  estimated_delivery DATE,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  invoice_number VARCHAR(40) UNIQUE NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(8) DEFAULT 'MAD',
  pdf_url TEXT,
  storage_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel VARCHAR(16) NOT NULL, -- whatsapp | sms | email
  recipient VARCHAR(255) NOT NULL,
  template_key VARCHAR(64),
  subject VARCHAR(255),
  body TEXT NOT NULL,
  status VARCHAR(32) DEFAULT 'queued',
  provider_id VARCHAR(128),
  related_type VARCHAR(32),
  related_id UUID,
  error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS upsell_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  customer_id UUID REFERENCES customers(id),
  offered_product_ids UUID[] DEFAULT '{}',
  accepted_product_ids UUID[] DEFAULT '{}',
  channel VARCHAR(32),
  revenue NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stock_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  current_stock INT NOT NULL,
  reorder_point INT NOT NULL,
  suggested_qty INT NOT NULL,
  status VARCHAR(32) DEFAULT 'open', -- open | ordered | closed
  auto_po_created BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number VARCHAR(40) UNIQUE NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  status VARCHAR(32) DEFAULT 'draft',
  supplier VARCHAR(128) DEFAULT 'default',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day DATE UNIQUE NOT NULL,
  orders_count INT DEFAULT 0,
  revenue NUMERIC(12,2) DEFAULT 0,
  aov NUMERIC(12,2) DEFAULT 0,
  abandoned_carts INT DEFAULT 0,
  recovered_carts INT DEFAULT 0,
  recovery_revenue NUMERIC(12,2) DEFAULT 0,
  fake_orders_blocked INT DEFAULT 0,
  duplicates_blocked INT DEFAULT 0,
  messages_sent INT DEFAULT 0,
  ai_replies INT DEFAULT 0,
  top_products JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_monthly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month DATE UNIQUE NOT NULL,
  orders_count INT DEFAULT 0,
  revenue NUMERIC(12,2) DEFAULT 0,
  aov NUMERIC(12,2) DEFAULT 0,
  recovery_rate NUMERIC(5,2) DEFAULT 0,
  fraud_rate NUMERIC(5,2) DEFAULT 0,
  best_sellers JSONB DEFAULT '[]',
  stock_predictions JSONB DEFAULT '[]',
  report_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type VARCHAR(64) NOT NULL,
  payload JSONB DEFAULT '{}',
  status VARCHAR(32) DEFAULT 'queued',
  attempts INT DEFAULT 0,
  last_error TEXT,
  run_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(64) NOT NULL,
  action VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL,
  request JSONB,
  response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_abandoned_phone ON abandoned_carts(phone);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_status ON ai_jobs(status, run_at);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
