-- Migration: Add campaigns table
-- Run this in Neon SQL Editor

CREATE TABLE IF NOT EXISTS campaigns (
  id VARCHAR(50) PRIMARY KEY,
  brand_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE logs ADD COLUMN IF NOT EXISTS campaign_id VARCHAR(50) REFERENCES campaigns(id) ON DELETE SET NULL;
