-- Migration: Add users table for authentication
-- Run this in Neon SQL Editor BEFORE deploying the new code

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),           -- NULL = first login, must set password
  role VARCHAR(20) DEFAULT 'member',    -- 'admin' or 'member'
  member_id VARCHAR(50) REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin: Yasmin
INSERT INTO users (email, role, member_id)
VALUES (
  'yasmin.digituly@gmail.com',
  'admin',
  (SELECT id FROM members WHERE LOWER(name) LIKE '%yasmin%' ORDER BY created_at LIMIT 1)
) ON CONFLICT (email) DO NOTHING;

-- Admin: Allen
INSERT INTO users (email, role, member_id)
VALUES (
  'sm.ymlima@gmail.com',
  'admin',
  (SELECT id FROM members WHERE LOWER(name) LIKE '%allen%' ORDER BY created_at LIMIT 1)
) ON CONFLICT (email) DO NOTHING;

-- Member: Rafael (email to be set later)
INSERT INTO users (email, role, member_id)
VALUES (
  'rafael@digituly.internal',
  'member',
  (SELECT id FROM members WHERE LOWER(name) LIKE '%rafael%' ORDER BY created_at LIMIT 1)
) ON CONFLICT (email) DO NOTHING;

-- Member: Rairla (email to be set later)
INSERT INTO users (email, role, member_id)
VALUES (
  'rairla@digituly.internal',
  'member',
  (SELECT id FROM members WHERE LOWER(name) LIKE '%rairla%' OR LOWER(name) LIKE '%raira%' ORDER BY created_at LIMIT 1)
) ON CONFLICT (email) DO NOTHING;
