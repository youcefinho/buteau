-- Schéma D1 — Équipe Buteau
-- Créé via : bunx wrangler d1 create equipe-buteau-leads
-- Appliqué via : bunx wrangler d1 execute equipe-buteau-leads --remote --file=./src/db/schema.sql

-- Table principale : tous les leads capturés via /api/lead
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  source TEXT,                -- 'home_contact_form' | 'calculator_cta' | 'institutions_missing' | etc.
  consent_at TEXT NOT NULL,   -- timestamp ISO du consentement Loi 25 (audit trail)
  ip_hash TEXT,                -- SHA-256 de l'IP (pas l'IP claire — Loi 25 minimisation)
  user_agent TEXT,
  ghl_pushed_at TEXT,
  ghl_status TEXT              -- 'success' | 'error' | NULL si pas encore pushé
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Rate limiting : 1 tentative max par IP / 30s
CREATE TABLE IF NOT EXISTS rate_limits (
  ip_hash TEXT PRIMARY KEY,
  last_attempt_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_last_attempt ON rate_limits(last_attempt_at);
