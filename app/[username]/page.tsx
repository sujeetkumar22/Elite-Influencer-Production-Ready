import { supabase } from "@/utils/supabase/client";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 0; // Disable caching to see updates immediately

export default async function PortfolioPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;

    // Fetch portfolio data
    const { data: portfolio } = await supabase
        .from("portfolios")
        .select("*")
        .eq("username", username)
        .single();

    if (!portfolio) {
        return notFound();
    }

    // Fetch thumbnails in parallel
    const workLinksWithThumbnails = await Promise.all(
        (portfolio.work_links || []).map(async (link: any) => {
            const thumbnail = await getThumbnail(link.url);
            return { ...link, thumbnail };
        })
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#8406f9] selection:text-white">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black italic tracking-tighter hover:opacity-80 transition-opacity">
                        ELITE <span className="text-[#8406f9]">INFLUENCER</span>
                    </Link>
                    <a
                        href={`mailto:${portfolio.contact_email}`}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-full font-bold text-sm transition-all"
                    >
                        Contact Me
                    </a>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header Profile */}
                    <div className="text-center mb-16 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8406f9] rounded-full blur-[120px] opacity-20 -z-10 animate-pulse"></div>

                        <div className="inline-block p-1 rounded-full bg-gradient-to-tr from-[#8406f9] to-transparent mb-6">
                            <div className="w-32 h-32 rounded-full bg-[#111] flex items-center justify-center text-4xl font-black uppercase text-white/20">
                                {portfolio.full_name?.[0] || "?"}
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
                            {portfolio.full_name}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/60 font-medium max-w-2xl mx-auto">
                            {portfolio.tagline}
                        </p>

                        <div className="flex items-center justify-center gap-6 mt-8">
                            {portfolio.city && (
                                <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm font-bold text-white/60 border border-white/5">
                                    📍 {portfolio.city}
                                </span>
                            )}
                            {portfolio.is_available && (
                                <span className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full text-sm font-bold text-green-500 border border-green-500/20">
                                    ⚡ Available for work
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                        <StatCard label="Followers" value={portfolio.stats?.followers || "-"} />
                        <StatCard label="Monthly Reach" value={portfolio.stats?.reach || "-"} />
                        <StatCard label="Engagement" value="High" />
                        <StatCard
                            label={portfolio.stats?.platform === "youtube" ? "YouTube" : "Instagram"}
                            value={<PlatformIcon platform={portfolio.stats?.platform || "instagram"} />}
                            isLink={true}
                            linkUrl={portfolio.stats?.platform_url}
                        />
                    </div>

                    {/* Bio */}
                    {portfolio.bio && (
                        <div className="mb-20 bg-[#111] border border-white/5 p-8 md:p-12 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8406f9] rounded-full blur-[100px] opacity-10"></div>
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <span className="w-8 h-1 bg-[#8406f9] rounded-full"></span>
                                About Me
                            </h2>
                            <p className="text-lg text-white/70 leading-relaxed whitespace-pre-wrap">
                                {portfolio.bio}
                            </p>
                        </div>
                    )}

                    {/* Work / Videos */}
                    {workLinksWithThumbnails.length > 0 && (
                        <div className="mb-20">
                            <h2 className="text-3xl font-black mb-10 text-center">Featured Work</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {workLinksWithThumbnails.map((link: any, i: number) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        className="group relative aspect-video bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-[#8406f9]/50 transition-all"
                                    >
                                        {link.thumbnail ? (
                                            <img
                                                src={link.thumbnail}
                                                alt={link.title}
                                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#050505]"></div>
                                        )}

                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                                                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                            </div>
                                        </div>

                                        {/* Gradient overlay for text readability */}
                                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                            <h3 className="font-bold text-lg text-white group-hover:text-[#8406f9] transition-colors">{link.title || "Untitled Video"}</h3>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Brands */}
                    {portfolio.brands && portfolio.brands.length > 0 && (
                        <div className="text-center mb-20">
                            <p className="text-sm font-bold uppercase tracking-widest text-white/30 mb-8">Trusted by World Class Brands</p>
                            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
                                {portfolio.brands.map((brand: string, i: number) => (
                                    <span key={i} className="px-6 py-3 bg-white/5 rounded-xl border border-white/5 font-bold text-white/50 hover:text-white hover:border-white/20 transition-colors cursor-default">
                                        {brand}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact Footer */}
                    <div className="text-center py-20 border-t border-white/5">
                        <h2 className="text-4xl md:text-6xl font-black mb-8">Let's Create Magic</h2>
                        <p className="text-white/50 mb-10 text-lg">Ready to take your brand to the next level?</p>
                        <a
                            href={`mailto:${portfolio.contact_email}`}
                            className="inline-block bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold text-xl px-12 py-5 rounded-2xl transition-all shadow-[0_10px_40px_-10px_rgba(132,6,249,0.5)] hover:-translate-y-1"
                        >
                            Work With Me
                        </a>
                    </div>

                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, isLink, linkUrl }: { label: string; value: string | React.ReactNode; isLink?: boolean; linkUrl?: string }) {
    const content = (
        <div className={`bg-[#111] border border-white/5 p-6 rounded-2xl text-center hover:bg-white/5 transition-colors group ${isLink ? "cursor-pointer hover:border-[#8406f9]/50" : ""}`}>
            <div className="text-2xl md:text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform origin-center flex items-center justify-center h-10">
                {value}
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">{label}</p>
        </div>
    );

    if (isLink && linkUrl) {
        return <a href={linkUrl} target="_blank" rel="noopener noreferrer">{content}</a>;
    }
    return content;
}

function PlatformIcon({ platform }: { platform: string }) {
    if (platform === "youtube") {
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-600">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        );
    }
    // Default to Instagram
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#E1306C]">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.846-10.405a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88z" />
        </svg>
    );
}

async function getThumbnail(url: string) {
    if (!url) return null;

    // 1. Check for YouTube
    const ytId = getYouTubeId(url);
    if (ytId) {
        return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
    }

    // 2. Check for Instagram (Server-side fetch to get og:image)
    if (url.includes("instagram.com")) {
        try {
            // Instagram blocks many scrapers, so we try our best.
            // Using a generic user agent sometimes helps.
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
                },
                next: { revalidate: 3600 } // Cache for 1 hour to avoid hitting limits
            });

            if (!response.ok) return null;

            const html = await response.text();
            // Regex to find og:image meta tag
            const match = html.match(/<meta property="og:image" content="([^"]+)"/);
            return match ? match[1] : null;
        } catch (error) {
            console.error("Failed to fetch Instagram thumbnail:", error);
            return null;
        }
    }

    return null;
}

function getYouTubeId(url: string) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
