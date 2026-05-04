-- Migration: content_blocks CMS table
-- Run: idempotent, safe to apply multiple times

CREATE TABLE IF NOT EXISTS content_blocks (
  key         TEXT PRIMARY KEY,
  section     TEXT        NOT NULL,
  pt          TEXT        NOT NULL DEFAULT '',
  en          TEXT        NOT NULL DEFAULT '',
  type        TEXT        NOT NULL DEFAULT 'text',
  updated_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_blocks_section ON content_blocks (section);
