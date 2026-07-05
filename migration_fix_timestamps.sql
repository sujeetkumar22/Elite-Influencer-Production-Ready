-- Fix: "portfolios" has no attribute "updated_at"
-- The live portfolios table was created from an older schema without
-- timestamp columns, but the handle_updated_at trigger (moddatetime)
-- references updated_at — so every save fails.
-- Run this ONCE in the Supabase SQL Editor.

ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Ensure the trigger exists and works (recreate is safe)
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;
DROP TRIGGER IF EXISTS handle_updated_at ON portfolios;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime(updated_at);
