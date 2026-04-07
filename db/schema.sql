-- Pulse Dashboard — Neon PostgreSQL Schema
-- Run this in the Neon SQL Editor after creating your project

-- ══════════════════════════════════════════════
-- TABLES
-- ════════���════════════════���════════════════════

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'member',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brands (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20) NOT NULL,
  goal_confirmed INT DEFAULT 0,
  goal_videos INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS members (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  avatar_url TEXT DEFAULT '',
  user_id INT REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS member_brands (
  member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
  brand_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT '',
  PRIMARY KEY (member_id, brand_id)
);

CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
  brand_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  kols_sourced INT DEFAULT 0,
  kols_contacted INT DEFAULT 0,
  kols_replied INT DEFAULT 0,
  kols_followedup INT DEFAULT 0,
  prelim_agree INT DEFAULT 0,
  confirmed INT DEFAULT 0,
  vids_published INT DEFAULT 0,
  note TEXT DEFAULT '',
  UNIQUE(member_id, brand_id, date)
);

CREATE TABLE IF NOT EXISTS camp_logs (
  id SERIAL PRIMARY KEY,
  brand_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  videos INT DEFAULT 0,
  shipped INT DEFAULT 0,
  received INT DEFAULT 0,
  UNIQUE(brand_id, date)
);

CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(50) PRIMARY KEY,
  value TEXT
);

-- ═══════════════════════════���══════════════════
-- SEED DATA
-- ══════════════════���═══════════════════════════

INSERT INTO settings (key, value) VALUES ('appName', 'Pulse') ON CONFLICT (key) DO NOTHING;

INSERT INTO brands (id, name, color, goal_confirmed, goal_videos) VALUES
  ('mywlk',    'MYWLK',    '#3b7ef8', 20, 15),
  ('solohour', 'Solohour',  '#10b981', 15, 10),
  ('lydsto',   'Lydsto',    '#f59e0b', 25, 20)
ON CONFLICT (id) DO NOTHING;

INSERT INTO members (id, name, avatar_url) VALUES
  ('yasmin', 'Yasmin', 'https://i.pinimg.com/1200x/4a/71/bc/4a71bc7279716b06bcac67ae818fd7df.jpg'),
  ('rafael', 'Rafael', 'https://i.pinimg.com/736x/02/4d/2a/024d2a7f3bde8791a90d5b6c4b24e710.jpg'),
  ('raira',  'Raira',  'https://i.pinimg.com/736x/87/3d/4e/873d4eb70606f3ae9fdbadecd928f90a.jpg')
ON CONFLICT (id) DO NOTHING;

INSERT INTO member_brands (member_id, brand_id, role) VALUES
  ('yasmin', 'mywlk',    'owner'),
  ('yasmin', 'solohour', 'owner'),
  ('yasmin', 'lydsto',   'owner'),
  ('rafael', 'mywlk',    'support'),
  ('rafael', 'solohour', 'owner'),
  ('raira',  'lydsto',   'owner')
ON CONFLICT (member_id, brand_id) DO NOTHING;

-- ── Contract Templates ─────────────────────────
CREATE TABLE IF NOT EXISTS contract_templates (
  id VARCHAR(50) PRIMARY KEY,
  brand_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  fields JSONB DEFAULT '[]',
  body_html TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── Contracts (generated instances) ────────────
CREATE TABLE IF NOT EXISTS contracts (
  id SERIAL PRIMARY KEY,
  template_id VARCHAR(50) REFERENCES contract_templates(id) ON DELETE SET NULL,
  brand_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  values JSONB DEFAULT '{}',
  body_html TEXT DEFAULT '',
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
