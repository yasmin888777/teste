-- Migration: Add links table for admin private bookmarks
-- Run this in Neon SQL Editor

CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  url TEXT,
  category VARCHAR(100) DEFAULT 'General',
  notes TEXT DEFAULT '',
  brand_id VARCHAR(50),
  quarter VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);

-- If table already exists, add new columns:
ALTER TABLE links ADD COLUMN IF NOT EXISTS brand_id VARCHAR(50);
ALTER TABLE links ADD COLUMN IF NOT EXISTS quarter VARCHAR(10);
ALTER TABLE links ADD COLUMN IF NOT EXISTS url TEXT;
