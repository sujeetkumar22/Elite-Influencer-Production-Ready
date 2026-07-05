import { supabasePublic as supabase } from "@/utils/supabase/public";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import ShareProfileButton from "@/components/ShareProfileButton";

// Cache profile pages for 60s — creators see edits within a minute,
// but repeat visits don't hammer the database.
export const revalidate = 60;

const BASE_URL = "https://eliteinfluencer.in";

interface WorkLink {
    title?: string;
    url: string;
    thumbnail?: string | null;
}

// Per-creator social previews: when a creator shares their link with a
// brand (WhatsApp, IG DM, email), the preview shows their name and stats.
export async function generateMetadata({
    params,
}: {
    params: Promise<{ username: string }>;
}): Promise<Metadata> {
    const { username } = await params;
    const { data: portfolio } = await supabase
        .from("portfolios")
        .select("full_name, tagline, bio, city, stats, profile_image")
        .eq("username", username)
        .single();

    if (!portfolio) {
        return { title: "Creator Not Found" };
    }

    const followers = portfolio.stats?.followers;
    const title = `${portfolio.full_name || username} — Creator Portfolio`;
    const description = [
        portfolio.tagline,
        followers && `${followers} followers`,
        portfolio.city,
    ]
        .filter(Boolean)
        .join(" • ") || `Check out ${portfolio.full_name || username}'s creator portfolio on Elite Influencer.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "profile",
            ...(portfolio.profile_image ? { images: [{ url: portfolio.profile_image }] } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function PortfolioPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;

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
        ((portfolio.work_links as WorkLink[]) || []).map(async (link) => {
            const thumbnail = await getThumbnail(link.url);
            return { ...link, thumbnail };
        })
    );

    // ---- Derived, real data (no fabricated claims) ----
    const firstName = portfolio.full_name?.split(" ")[0] || username;
    const profileUrl = `${BASE_URL}/${portfolio.username}`;
    const platform = portfolio.stats?.platform === "youtube" ? "YouTube" : "Instagram";
    const platformUrl: string | undefined = portfolio.stats?.platform_url || undefined;
    const handle: string | undefined = portfolio.stats?.instagram || undefined;
    const brandCount = portfolio.brands?.length || 0;
    const memberSince = portfolio.created_at
        ? new Date(portfolio.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : null;
    const phoneDigits = (portfolio.contact_phone || "").replace(/\D/g, "");
    const whatsappUrl = phoneDigits.length >= 10
        ? `https://wa.me/${phoneDigits.length === 10 ? "91" + phoneDigits : phoneDigits}`
        : null;

    const statCards: { label: string; value: string; info?: string }[] = [
        { label: "Followers", value: portfolio.stats?.followers || "—" },
        {
            label: "Monthly Reach",
            value: portfolio.stats?.reach || "—",
            info: "Views shown in the creator's professional dashboard over the last 30 days",
        },
    ];
    if (portfolio.stats?.engagement) {
        statCards.push({ label: "Engagement Rate", value: portfolio.stats.engagement });
    }
    if (brandCount > 0) {
        statCards.push({ label: "Brand Collabs", value: `${brandCount}+` });
    }

    // SEO: structured data so search engines understand this is a person/creator
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: portfolio.full_name || username,
        url: profileUrl,
        ...(portfolio.profile_image ? { image: portfolio.profile_image } : {}),
        ...(portfolio.tagline ? { jobTitle: portfolio.tagline } : {}),
        ...(portfolio.city ? { address: { "@type": "PostalAddress", addressLocality: portfolio.city } } : {}),
        ...(platformUrl ? { sameAs: [platformUrl] } : {}),
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#8406f9] selection:text-white overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-xl md:text-2xl font-black italic tracking-tighter hover:opacity-80 transition-opacity">
                        ELITE <span className="text-[#8406f9]">INFLUENCER</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <ShareProfileButton name={portfolio.full_name || username} url={profileUrl} />
                        {portfolio.contact_email && (
                            <a
                                href={`mailto:${portfolio.contact_email}`}
                                className="bg-[#8406f9] hover:bg-[#8406f9]/90 px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all shadow-lg shadow-[#8406f9]/20"
                            >
                                Contact Me
                            </a>
                        )}
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">

                    {/* ===== HERO ===== */}
                    <section className="relative mb-16">
                        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#8406f9] rounded-full blur-[100px] md:blur-[150px] opacity-15 -z-10"></div>

                        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
                            {/* Avatar */}
                            <div className="relative shrink-0 group cursor-default">
                                <div className="absolute inset-0 rounded-full bg-[#8406f9] blur-2xl opacity-40 animate-avatar-pulse group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full p-1 overflow-hidden flex items-center justify-center border border-white/10">
                                    <div className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,#8406f9,#ff2e63,#08d1ff,#8406f9)] animate-rotate-bg opacity-80"></div>
                                    <div className="relative w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center z-10 overflow-hidden shadow-inner border border-white/5">
                                        {portfolio.profile_image ? (
                                            <Image
                                                src={portfolio.profile_image}
                                                alt={portfolio.full_name || "Profile"}
                                                fill
                                                sizes="(max-width: 768px) 160px, 208px"
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <span className="text-6xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-br from-white via-white/40 to-white/10 select-none">
                                                {portfolio.full_name?.[0] || "?"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {portfolio.is_verified && (
                                    <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-10 h-10 bg-[#8406f9] rounded-full border-4 border-[#050505] flex items-center justify-center shadow-xl z-20" title="Verified by Elite Influencer">
                                        <span className="material-symbols-outlined text-white text-xl">verified</span>
                                    </div>
                                )}
                            </div>

                            {/* Identity */}
                            <div className="text-center md:text-left flex-1">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-[10px] font-bold uppercase tracking-widest">
                                        Creator Portfolio
                                    </span>
                                    {portfolio.is_verified && (
                                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                            <span className="material-symbols-outlined text-xs text-[#8406f9]">verified</span>
                                            Verified
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3 break-words">
                                    {portfolio.full_name}
                                </h1>
                                <p className="text-lg md:text-2xl text-white/60 font-medium mb-6">
                                    {portfolio.tagline}
                                </p>

                                {/* Chips */}
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8">
                                    {portfolio.city && (
                                        <span className="flex items-center gap-1.5 px-4 py-2 bg-white/5 rounded-full text-sm font-bold text-white/60 border border-white/5">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            {portfolio.city}
                                        </span>
                                    )}
                                    {portfolio.is_available ? (
                                        <span className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 rounded-full text-sm font-bold text-green-500 border border-green-500/20">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            Available for collaborations
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 px-4 py-2 bg-white/5 rounded-full text-sm font-bold text-white/40 border border-white/5">
                                            Currently booked
                                        </span>
                                    )}
                                    {handle && platformUrl && (
                                        <a href={platformUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-white/5 rounded-full text-sm font-bold text-white/60 border border-white/5 hover:border-[#8406f9]/50 hover:text-white transition-colors">
                                            <PlatformIcon platform={portfolio.stats?.platform || "instagram"} small />
                                            @{handle.replace(/^@/, "")}
                                        </a>
                                    )}
                                </div>

                                {/* CTAs */}
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    {portfolio.contact_email && (
                                        <a
                                            href={`mailto:${portfolio.contact_email}?subject=Collaboration with ${encodeURIComponent(portfolio.full_name || username)}`}
                                            className="bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(132,6,249,0.3)] hover:shadow-[0_0_35px_rgba(132,6,249,0.5)] hover:-translate-y-0.5"
                                        >
                                            Work With Me
                                        </a>
                                    )}
                                    {whatsappUrl && (
                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-bold px-6 py-3.5 rounded-full transition-all"
                                        >
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                            WhatsApp
                                        </a>
                                    )}
                                    {platformUrl && (
                                        <a
                                            href={platformUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-bold px-6 py-3.5 rounded-full transition-all"
                                        >
                                            View {platform}
                                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ===== STATS BAND ===== */}
                    <section className="mb-20">
                        <div className={`grid grid-cols-2 ${statCards.length >= 4 ? "md:grid-cols-4" : "md:grid-cols-3"} gap-4`}>
                            {statCards.map((s) => (
                                <StatCard key={s.label} label={s.label} value={s.value} info={s.info} />
                            ))}
                        </div>
                    </section>

                    {/* ===== ABOUT + SNAPSHOT ===== */}
                    <section className="mb-20 grid md:grid-cols-3 gap-6">
                        {/* Bio */}
                        {portfolio.bio && (
                            <div className="md:col-span-2 bg-[#111] border border-white/5 p-8 md:p-12 rounded-3xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#8406f9] rounded-full blur-[100px] opacity-10"></div>
                                <p className="text-xs font-bold uppercase tracking-widest text-[#8406f9] mb-3">About</p>
                                <h2 className="text-2xl md:text-3xl font-black mb-6">Meet {firstName}</h2>
                                <p className="text-lg text-white/70 leading-relaxed whitespace-pre-wrap">
                                    {portfolio.bio}
                                </p>
                            </div>
                        )}

                        {/* Collaboration Snapshot — quick facts brands scan first */}
                        <div className={`${portfolio.bio ? "" : "md:col-span-3"} bg-[#111] border border-white/5 p-8 rounded-3xl`}>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#8406f9] mb-6">Collaboration Snapshot</p>
                            <ul className="space-y-5">
                                <SnapshotRow icon="podcasts" label="Primary Platform" value={platform} />
                                {portfolio.city && <SnapshotRow icon="location_on" label="Based In" value={portfolio.city} />}
                                <SnapshotRow
                                    icon="event_available"
                                    label="Status"
                                    value={portfolio.is_available ? "Open to brand deals" : "Currently booked"}
                                    valueClass={portfolio.is_available ? "text-green-500" : "text-white/50"}
                                />
                                {brandCount > 0 && <SnapshotRow icon="handshake" label="Brands Worked With" value={`${brandCount}+ brands`} />}
                                {memberSince && <SnapshotRow icon="workspace_premium" label="On Elite Influencer" value={`Since ${memberSince}`} />}
                                {portfolio.contact_email && <SnapshotRow icon="mail" label="Business Contact" value={portfolio.contact_email} breakAll />}
                            </ul>
                        </div>
                    </section>

                    {/* ===== FEATURED WORK ===== */}
                    {workLinksWithThumbnails.length > 0 && (
                        <section className="mb-20">
                            <div className="flex items-end justify-between mb-10">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-[#8406f9] mb-3">Portfolio</p>
                                    <h2 className="text-3xl md:text-4xl font-black">Featured Work</h2>
                                </div>
                                {platformUrl && (
                                    <a href={platformUrl} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-sm font-bold text-white/50 hover:text-[#8406f9] transition-colors">
                                        See all on {platform} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </a>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {workLinksWithThumbnails.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative aspect-video bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-[#8406f9]/30"
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[#8406f9]/0 via-[#8406f9]/20 to-[#8406f9]/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>

                                        <div className="relative h-full w-full overflow-hidden rounded-3xl z-10">
                                            {link.thumbnail ? (
                                                <Image
                                                    src={link.thumbnail}
                                                    alt={link.title || "Video thumbnail"}
                                                    fill
                                                    className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#050505] flex items-center justify-center">
                                                    <div className="text-[#8406f9]/20 font-black text-6xl italic tracking-tighter">ELITE</div>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 z-20"></div>

                                            <div className="absolute inset-0 flex items-center justify-center z-30">
                                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#8406f9] group-hover:border-[#8406f9] transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_50px_rgba(132,6,249,0.5)]">
                                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                                </div>
                                            </div>

                                            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-40 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-0.5 rounded bg-[#8406f9] text-[10px] font-black uppercase tracking-widest text-white">Featured</span>
                                                    {link.url.includes("youtube.com") || link.url.includes("youtu.be") ? (
                                                        <span className="text-white/40 text-[10px] font-bold uppercase">YouTube</span>
                                                    ) : link.url.includes("instagram.com") ? (
                                                        <span className="text-white/40 text-[10px] font-bold uppercase">Instagram</span>
                                                    ) : null}
                                                </div>
                                                <h3 className="font-black text-xl md:text-2xl text-white line-clamp-2 leading-tight">{link.title || "Untitled"}</h3>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ===== BRAND COLLABORATIONS ===== */}
                    {brandCount > 0 && (
                        <section className="mb-20 bg-[#111] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8406f9] rounded-full blur-[120px] opacity-10"></div>
                            <div className="text-center mb-10">
                                <p className="text-xs font-bold uppercase tracking-widest text-[#8406f9] mb-3">Partnerships</p>
                                <h2 className="text-3xl md:text-4xl font-black">
                                    Trusted by {brandCount}+ Brands
                                </h2>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
                                {portfolio.brands.map((brand: string, i: number) => (
                                    <span key={i} className="px-6 py-3 bg-white/5 rounded-xl border border-white/5 font-bold text-white/60 hover:text-white hover:border-[#8406f9]/40 hover:bg-white/10 transition-all cursor-default">
                                        {brand}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ===== CTA ===== */}
                    <section className="rounded-3xl bg-gradient-to-br from-[#8406f9] to-[#4a048a] p-10 md:p-16 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-[150px] opacity-10"></div>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">Ready to collaborate?</p>
                        <h2 className="text-4xl md:text-6xl font-black mb-4">Let&apos;s Create Magic</h2>
                        <p className="text-white/70 mb-10 text-lg max-w-xl mx-auto">
                            Partner with {firstName} for your next campaign — reach out directly and get the conversation started.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {portfolio.contact_email && (
                                <a
                                    href={`mailto:${portfolio.contact_email}?subject=Collaboration with ${encodeURIComponent(portfolio.full_name || username)}`}
                                    className="w-full sm:w-auto bg-white text-[#4a048a] font-black text-lg px-10 py-4 rounded-full transition-all hover:-translate-y-1 shadow-2xl"
                                >
                                    Email {firstName}
                                </a>
                            )}
                            {whatsappUrl && (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto bg-[#25D366] text-white font-black text-lg px-10 py-4 rounded-full transition-all hover:-translate-y-1 shadow-2xl"
                                >
                                    Message on WhatsApp
                                </a>
                            )}
                        </div>
                    </section>

                </div>
            </main>

            {/* Powered-by footer — turns every shared portfolio into a growth loop */}
            <footer className="border-t border-white/5 py-10">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/30 text-sm">
                        Portfolio powered by{" "}
                        <Link href="/" className="font-black italic tracking-tighter text-white/60 hover:text-white transition-colors">
                            ELITE <span className="text-[#8406f9]">INFLUENCER</span>
                        </Link>
                    </p>
                    <Link
                        href="/login"
                        className="text-sm font-bold text-[#8406f9] hover:text-[#8406f9]/80 transition-colors flex items-center gap-1"
                    >
                        Create your free creator portfolio
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
            </footer>
        </div>
    );
}

function StatCard({ label, value, info }: { label: string; value: string; info?: string }) {
    return (
        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl text-center hover:bg-white/5 hover:border-[#8406f9]/20 transition-all group relative">
            {info && (
                <div className="absolute top-3 right-3 group/info">
                    <span className="material-symbols-outlined text-white/20 text-sm hover:text-white/60 transition-colors cursor-help">info</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl text-[10px] text-white/80 leading-relaxed opacity-0 invisible group-hover/info:visible group-hover/info:opacity-100 transition-all z-50 pointer-events-none">
                        {info}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/90"></div>
                    </div>
                </div>
            )}
            <div className="text-2xl md:text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform origin-center flex items-center justify-center h-10">
                {value}
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">{label}</p>
        </div>
    );
}

function SnapshotRow({
    icon,
    label,
    value,
    valueClass = "text-white",
    breakAll = false,
}: {
    icon: string;
    label: string;
    value: string;
    valueClass?: string;
    breakAll?: boolean;
}) {
    return (
        <li className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-lg bg-[#8406f9]/10 border border-[#8406f9]/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#8406f9] text-lg">{icon}</span>
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-0.5">{label}</p>
                <p className={`text-sm font-bold ${valueClass} ${breakAll ? "break-all" : ""}`}>{value}</p>
            </div>
        </li>
    );
}

function PlatformIcon({ platform, small = false }: { platform: string; small?: boolean }) {
    const cls = small ? "w-4 h-4" : "w-8 h-8";
    if (platform === "youtube") {
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" className={`${cls} text-red-600`}>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`${cls} text-[#E1306C]`}>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.846-10.405a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88z" />
        </svg>
    );
}

async function getThumbnail(url: string) {
    if (!url) return null;

    // 1. Check for YouTube
    const ytId = getYouTubeId(url);
    if (ytId) {
        return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }

    // 2. Check for Instagram (Server-side fetch to get og:image)
    if (url.includes("instagram.com")) {
        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                },
                // Never let a slow/blocked Instagram fetch delay the page
                signal: AbortSignal.timeout(3000),
                next: { revalidate: 86400 } // Cache for 24 hours
            });

            if (!response.ok) return null;

            const html = await response.text();
            const match = html.match(/<meta property="og:image" content="([^"]+)"/);
            if (match && match[1]) return match[1];

            const jsonMatch = html.match(/"thumbnail_src":"([^"]+)"/);
            if (jsonMatch && jsonMatch[1]) return jsonMatch[1].replace(/\\u0026/g, '&');

            return null;
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
