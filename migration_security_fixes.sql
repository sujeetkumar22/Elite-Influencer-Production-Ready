-- ============================================================
-- Elite Influencer — Security & Feature Migration (July 2026)
-- Run this ONCE in the Supabase SQL Editor.
-- ============================================================

-- ------------------------------------------------------------
-- 1. ADMINS TABLE
-- Fixes: previously ANY logged-in user could post brand offers
-- and articles to the public site. Now only listed admins can.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Everyone can check whether a given user is an admin (needed by the
-- app to show/hide admin UI). Rows contain no sensitive data.
DROP POLICY IF EXISTS "Admins readable by authenticated users" ON admins;
CREATE POLICY "Admins readable by authenticated users"
ON admins FOR SELECT
TO authenticated
USING ( true );

-- Nobody can insert/update/delete admins through the API.
-- Manage admins in the Supabase Table Editor (service role bypasses RLS).

-- Helper used inside policies (SECURITY DEFINER avoids RLS recursion)
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = uid);
$$;

-- >>> IMPORTANT: add yourself as the first admin. Replace the email below. <<<
INSERT INTO admins (user_id)
SELECT id FROM auth.users WHERE email = 'eliteinfluencer.in@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- ------------------------------------------------------------
-- 2. LOCK DOWN brand_offers (admins only)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Admin can insert offers" ON brand_offers;
CREATE POLICY "Admin can insert offers"
ON brand_offers FOR INSERT
WITH CHECK ( is_admin(auth.uid()) AND auth.uid() = admin_id );

DROP POLICY IF EXISTS "Admin can update offers" ON brand_offers;
CREATE POLICY "Admin can update offers"
ON brand_offers FOR UPDATE
USING ( is_admin(auth.uid()) );

DROP POLICY IF EXISTS "Admin can delete offers" ON brand_offers;
CREATE POLICY "Admin can delete offers"
ON brand_offers FOR DELETE
USING ( is_admin(auth.uid()) );

-- ------------------------------------------------------------
-- 3. LOCK DOWN articles (admins only)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Users can insert own articles" ON articles;
CREATE POLICY "Users can insert own articles"
ON articles FOR INSERT
WITH CHECK ( is_admin(auth.uid()) AND auth.uid() = author_id );

DROP POLICY IF EXISTS "Users can update own articles" ON articles;
CREATE POLICY "Users can update own articles"
ON articles FOR UPDATE
USING ( is_admin(auth.uid()) );

DROP POLICY IF EXISTS "Users can delete own articles" ON articles;
CREATE POLICY "Users can delete own articles"
ON articles FOR DELETE
USING ( is_admin(auth.uid()) );

-- ------------------------------------------------------------
-- 4. PORTFOLIOS: profile photo + earned verification
-- ------------------------------------------------------------
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS profile_image text;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Users may NOT set is_verified themselves — grant it via Table Editor.

-- ------------------------------------------------------------
-- 5. STORAGE BUCKET for profile photos
-- ------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view avatars (public bucket), users manage only their own
-- folder: avatars/<user_id>/avatar.jpg
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );
