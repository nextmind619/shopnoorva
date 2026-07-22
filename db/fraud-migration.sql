-- Standalone migration for existing Postgres deployments
-- Safe to run multiple times (IF NOT EXISTS)

CREATE TABLE IF NOT EXISTS fraud_blacklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(32) NOT NULL,
  value VARCHAR(255) NOT NULL,
  reason TEXT NOT NULL,
  source VARCHAR(16) NOT NULL DEFAULT 'auto',
  hits INT NOT NULL DEFAULT 0,
  last_hit_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (type, value)
);

CREATE TABLE IF NOT EXISTS fraud_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(32),
  phone_normalized VARCHAR(32),
  full_name VARCHAR(255),
  address TEXT,
  ip VARCHAR(64),
  fingerprint VARCHAR(64),
  device_id VARCHAR(64),
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  decision VARCHAR(16) NOT NULL,
  reasons JSONB DEFAULT '[]',
  flags JSONB DEFAULT '[]',
  breakdown JSONB DEFAULT '[]',
  ip_risk VARCHAR(32),
  user_agent TEXT,
  device JSONB DEFAULT '{}',
  order_id UUID,
  order_number VARCHAR(40),
  duration_ms INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fraud_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(32) NOT NULL,
  full_name VARCHAR(255),
  address TEXT,
  address_key VARCHAR(255),
  ip VARCHAR(64),
  fingerprint VARCHAR(64),
  device_id VARCHAR(64),
  decision VARCHAR(16),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fraud_blacklist_type_value ON fraud_blacklist(type, value);
CREATE INDEX IF NOT EXISTS idx_fraud_logs_created ON fraud_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fraud_logs_decision ON fraud_logs(decision);
CREATE INDEX IF NOT EXISTS idx_fraud_logs_phone ON fraud_logs(phone_normalized);
CREATE INDEX IF NOT EXISTS idx_fraud_attempts_phone ON fraud_attempts(phone, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fraud_attempts_ip ON fraud_attempts(ip, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fraud_attempts_fp ON fraud_attempts(fingerprint, created_at DESC);
