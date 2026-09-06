import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using Service Role key (if available) or Anon key
function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, leadId, email, data } = body;

        const supabase = getSupabaseAdmin();

        if (action === 'create') {
            const { name, email: leadEmail, instagram, phone, quote_price, niche_category, experience_level, city, followers } = data || {};

            if (!leadEmail && !phone) {
                return NextResponse.json({ error: 'Email or phone is required' }, { status: 400 });
            }

            const { data: inserted, error } = await supabase
                .from('leads')
                .insert({
                    name: name || null,
                    email: leadEmail || null,
                    instagram: instagram || null,
                    phone: phone || null,
                    quote_price: quote_price ? String(quote_price) : null,
                    niche_category: niche_category || null,
                    experience_level: experience_level || null,
                    city: city || null,
                    followers: followers ? String(followers) : null
                })
                .select('id')
                .single();

            if (error) {
                console.error('Lead creation error:', error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json({ success: true, id: inserted.id });
        }

        if (action === 'update_survey') {
            const { niche_category, experience_level } = data || {};

            if (!leadId && !email) {
                return NextResponse.json({ error: 'Lead ID or email required for survey update' }, { status: 400 });
            }

            let query = supabase.from('leads').update({
                niche_category: niche_category || null,
                experience_level: experience_level || null
            });

            if (leadId) {
                query = query.eq('id', leadId);
            } else if (email) {
                query = query.eq('email', email);
            }

            const { error } = await query;

            if (error) {
                console.error('Survey update error:', error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Lead API unexpected error:', message);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
