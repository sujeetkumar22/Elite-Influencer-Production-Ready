-- Diagnostic only — paste the full output back, nothing here modifies data.

-- 1. Confirm RLS is on and list every policy currently attached to the table
SELECT relrowsecurity, relforcerowsecurity
FROM pg_class WHERE relname = 'brand_leads';

SELECT policyname, cmd, roles, permissive, qual, with_check
FROM pg_policies
WHERE tablename = 'brand_leads';

-- 2. Confirm the anon/authenticated roles actually have the table grant
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'brand_leads';

-- 3. Force PostgREST to drop any stale schema cache (harmless, instant)
NOTIFY pgrst, 'reload schema';
