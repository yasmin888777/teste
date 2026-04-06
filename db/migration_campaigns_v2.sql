-- Migration: Add period, start_date, end_date, samples, custom_fields to campaigns
-- Run this in Neon SQL Editor

ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS period VARCHAR(100) DEFAULT '';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS samples INT DEFAULT 0;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS custom_fields TEXT DEFAULT '[]';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS shipment_status VARCHAR(50) DEFAULT '';
