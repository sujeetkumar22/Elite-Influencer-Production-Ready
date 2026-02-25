import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = await createClient();
        console.log("Exchanging code for session...");
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            console.log("Auth success! Redirecting to dashboard...");
            return NextResponse.redirect(`${origin}${next}`);
        }
        console.error("Auth exchange error:", error.message);
    } else {
        console.warn("No auth code found in callback URL.");
    }

    // return the user to an error page with instructions
    console.log("Redirecting to error page...");
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
