import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, validate and use it as the redirect URL
    const rawNext = searchParams.get("next") ?? "/dashboard";
    const isRelative = rawNext.startsWith("/") && !rawNext.startsWith("//");
    const next = isRelative ? rawNext : "/dashboard";

    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";
    const redirectBase = forwardedHost && !isLocalEnv ? `https://${forwardedHost}` : origin;

    if (code) {
        const supabase = await createClient();
        console.log("Exchanging code for session...");
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            console.log("Auth success! Redirecting to dashboard...");
            return NextResponse.redirect(`${redirectBase}${next}`);
        }
        console.error("Auth exchange error:", error.message);
        // Pass the error message to the error page
        return NextResponse.redirect(`${redirectBase}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`);
    } else {
        console.warn("No auth code found in callback URL.");
        return NextResponse.redirect(`${redirectBase}/auth/auth-code-error?error=No+code+found`);
    }
}
