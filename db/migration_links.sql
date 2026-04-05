-- Migration: Add links table for admin private bookmarks
-- Run this in Neon SQL Editor

CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  url TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);
