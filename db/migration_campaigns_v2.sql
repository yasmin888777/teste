-- Migration: Add period, start_date, end_date, samples to campaigns
-- Run this in Neon SQL Editor

ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS period VARCHAR(100) DEFAULT '';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS samples INT DEFAULT 0;
