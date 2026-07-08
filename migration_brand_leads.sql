-- ============================================================
-- Brand leads table for the /for-brands page
-- Run this in the Supabase SQL editor (entire file).
-- ============================================================

CREATE TABLE IF NOT EXISTS brand_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL,
  contact_name text NOT NULL,
  work_email text NOT NULL,
  phone text,
  website text,
  budget_range text,
  campaign_goal text,
  target_niche text,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE brand_leads ENABLE ROW LEVEL SECURITY;

-- RLS policies only take effect on top of a base table GRANT — without
-- this, Postgres reports the failure as an RLS violation even though
-- the real cause is a missing privilege for the anon/authenticated role.
GRANT INSERT ON brand_leads TO anon, authenticated;
GRANT SELECT, DELETE ON brand_leads TO authenticated;

-- Anyone (including logged-out brands) can submit the form...
DROP POLICY IF EXISTS "brand_leads_public_insert" ON brand_leads;
CREATE POLICY "brand_leads_public_insert" ON brand_leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- ...but only admins can read/manage the leads.
DROP POLICY IF EXISTS "brand_leads_admin_select" ON brand_leads;
CREATE POLICY "brand_leads_admin_select" ON brand_leads
  FOR SELECT TO authenticated
  USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "brand_leads_admin_delete" ON brand_leads;
CREATE POLICY "brand_leads_admin_delete" ON brand_leads
  FOR DELETE TO authenticated
  USING (is_admin(auth.uid()));

SELECT 'brand_leads table ready' AS status;
