import { createClient } from "@supabase/supabase-js";

// Cookie-free client for fetching PUBLIC data in server components.
// Unlike the server client (which reads auth cookies and forces every
// request to be dynamic), pages using this client can be cached with ISR.
export const supabasePublic = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
);
