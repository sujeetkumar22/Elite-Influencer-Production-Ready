import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh the session and get the user (do not remove â€” required
    // to keep server components' auth state in sync)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Subdomain routing: rewrite removeailabel.eliteinfluencer.in root to /ai-label-remover
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
    const isRemoveAiLabelSubdomain =
        host.startsWith("removeailabel.") ||
        host.includes("removeailabel.eliteinfluencer.in") ||
        host.includes("removeailabel.localhost");

    if (isRemoveAiLabelSubdomain) {
        if (request.nextUrl.pathname === "/") {
            const url = request.nextUrl.clone();
            url.pathname = "/ai-label-remover";
            const response = NextResponse.rewrite(url, { request });
            supabaseResponse.cookies.getAll().forEach((cookie) => {
                response.cookies.set(cookie);
            });
            return response;
        }

        if (request.nextUrl.pathname === "/ai-label-remover") {
            const url = request.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }

        // Redirect other application routes to main domain
        const isSystemPath =
            request.nextUrl.pathname.startsWith("/_next") ||
            request.nextUrl.pathname.startsWith("/api") ||
            request.nextUrl.pathname.startsWith("/auth") ||
            request.nextUrl.pathname === "/robots.txt" ||
            request.nextUrl.pathname === "/sitemap.xml" ||
            request.nextUrl.pathname === "/icon.png";

        if (!isSystemPath) {
            return NextResponse.redirect(
                new URL(
                    `${request.nextUrl.pathname}${request.nextUrl.search}`,
                    "https://eliteinfluencer.in"
                )
            );
        }
    }

    // Protect the dashboard server-side
    if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("next", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Run on all paths except static assets and images.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};

