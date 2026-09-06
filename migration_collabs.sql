-- ============================================================
-- Collab Requests Migration (Creator Networking Board)
-- Run this in the Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS collab_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  creator_name text NOT NULL,
  creator_username text,
  creator_avatar text,
  title text NOT NULL,
  description text NOT NULL,
  niche text NOT NULL,
  city text NOT NULL,
  collab_type text NOT NULL,
  follower_count text,
  contact_platform text DEFAULT 'instagram',
  contact_handle text NOT NULL,
  is_open boolean DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_collab_requests_open ON collab_requests(is_open);
CREATE INDEX IF NOT EXISTS idx_collab_requests_city ON collab_requests(city);
CREATE INDEX IF NOT EXISTS idx_collab_requests_niche ON collab_requests(niche);

ALTER TABLE collab_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view open collab requests" ON collab_requests;
CREATE POLICY "Public can view open collab requests"
ON collab_requests FOR SELECT
USING ( is_open = true );

DROP POLICY IF EXISTS "Authenticated users can create collab requests" ON collab_requests;
CREATE POLICY "Authenticated users can create collab requests"
ON collab_requests FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users can update own collab requests" ON collab_requests;
CREATE POLICY "Users can update own collab requests"
ON collab_requests FOR UPDATE
TO authenticated
USING ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users can delete own collab requests" ON collab_requests;
CREATE POLICY "Users can delete own collab requests"
ON collab_requests FOR DELETE
TO authenticated
USING ( auth.uid() = user_id );

-- Optional: Seed initial sample collabs if empty
INSERT INTO collab_requests (user_id, creator_name, creator_username, title, description, niche, city, collab_type, follower_count, contact_platform, contact_handle)
SELECT 
  id,
  'Karan Sharma',
  'karansharma_tech',
  'Looking for a tech / AI creator in Delhi NCR for a podcast interview',
  'I host a podcast focusing on consumer AI and startup growth. Looking for a co-creator with 10k-50k reach to record an in-person episode in Gurgaon.',
  'Tech',
  'Delhi NCR',
  'Podcast Guest',
  '35k',
  'instagram',
  '@karansharma_tech'
FROM auth.users
LIMIT 1
ON CONFLICT DO NOTHING;
