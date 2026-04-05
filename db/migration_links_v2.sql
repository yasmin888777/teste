-- Migration v2: Add year + campaign fields to links, widen quarter column
-- Run this in Neon SQL Editor

ALTER TABLE links ADD COLUMN IF NOT EXISTS year INT;
ALTER TABLE links ADD COLUMN IF NOT EXISTS campaign VARCHAR(200) DEFAULT '';
-- Widen quarter to support multi-quarter values like "Q1,Q2,Q3"
ALTER TABLE links ALTER COLUMN quarter TYPE VARCHAR(50);
