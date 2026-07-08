import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BASE_URL = "https://eliteinfluencer.in";

export const metadata = {
    title: "How to Grow on Social Media in 2026 | A Creator's Playbook",
    description: "A practical playbook for growing on Instagram and social media: niche positioning, content systems, reels strategy, engagement, and turning growth into paid brand campaigns.",
    alternates: { canonical: `${BASE_URL}/how-to-grow-on-social-media` },
    openGraph: {
        title: "How to Grow on Social Media in 2026 | A Creator's Playbook",
        description: "Niche positioning, content systems, reels strategy, and turning growth into paid brand campaigns.",
        type: "article",
        url: `${BASE_URL}/how-to-grow-on-social-media`,
    },
};

const PILLARS = [
    {
        icon: "target",
        title: "1. Pick a niche people search for",
        text: "Growth compounds when the algorithm knows who to show you to. Choose one clear niche (fitness, personal finance, tech, food, fashion) and stay recognizable: same face, same topics, same visual style. Broad 'lifestyle' accounts grow slowest because no algorithm knows who needs them.",
    },
    {
        icon: "calendar_month",
        title: "2. Build a content system, not bursts of motivation",
        text: "Consistency beats intensity. Decide a sustainable cadence (3 to 5 reels a week beats 14 one week and none for a month), batch-shoot on one day, and keep an idea bank so you never start from a blank page. Every viral account you follow runs on a system.",
    },
    {
        icon: "movie",
        title: "3. Master short-form video",
        text: "Reels are the fastest organic growth lever on Instagram. The first 1.5 seconds decide everything: open with movement, a bold claim, or a visual hook. Keep cuts fast, add captions (most viewers watch muted), and end with a reason to comment or share.",
    },
    {
        icon: "photo_camera",
        title: "4. Shoot where the content is",
        text: "Locations do half the work. Immersive art shows, festivals, night markets and pop-ups give you scroll-stopping backdrops and trending audio moments, and audiences save location-based content, which the algorithm rewards.",
        link: { href: "/events", label: "Find instagrammable events in your city" },
    },
    {
        icon: "forum",
        title: "5. Engineer engagement, don't beg for it",
        text: "Reply to every comment in the first hour, ask one specific question in captions, and use stories daily to stay in the feed. Engagement rate (not follower count) is what both the algorithm and brands actually measure.",
    },
    {
        icon: "handshake",
        title: "6. Monetize the growth",
        text: "Growth without monetization is a hobby. Once you cross ~1,000 engaged followers, build a portfolio, set your rate, and start pitching brands: paid campaigns fund better content, which fuels more growth.",
        link: { href: "/brand-campaigns", label: "Read the brand campaigns guide" },
    },
];

const FAQS = [
    {
        q: "How do I grow on social media from zero?",
        a: "Start with one platform and one niche. Post short-form video consistently (3 to 5 per week), study which hooks hold attention in your first-3-seconds retention data, engage genuinely with accounts in your niche, and give every post one clear job: entertain, teach, or inspire. Most accounts that 'blow up' posted consistently for 3 to 6 months first.",
    },
    {
        q: "How long does it take to grow on Instagram?",
        a: "With consistent short-form video and a clear niche, most creators see meaningful traction — their first viral reel and steady follower growth — within 3 to 6 months. The compounding is real: going from 0 to 1,000 followers is usually harder than 1,000 to 10,000.",
    },
    {
        q: "Do I need to post every day to grow?",
        a: "No. Quality and consistency beat frequency. 3 to 5 strong reels a week with daily stories outperforms 7 rushed posts. The algorithm rewards watch time and shares, not volume.",
    },
    {
        q: "When can I start earning from social media?",
        a: "Earlier than you think. With 1,000+ engaged followers in a clear niche you can take barter collaborations and small paid campaigns; UGC work pays regardless of follower count. Build a professional portfolio and calculate a defensible rate before your first negotiation.",
    },
    {
        q: "What tools help creators grow and monetize?",
        a: "Elite Influencer offers free tools for the monetization side: a portfolio builder that turns your profile into a professional media kit, CreatorCalc for pricing brand deals based on your niche and views, an AI pitch generator for brand outreach, and a marketplace of live paid campaigns.",
    },
];

const jsonLd = [
    {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "How to Grow on Social Media in 2026 | A Creator's Playbook",
        description: "A practical playbook for growing on Instagram and social media: niche positioning, content systems, reels strategy, engagement, and monetization.",
        author: { "@type": "Organization", name: "Elite Influencer", url: BASE_URL },
        publisher: { "@type": "Organization", name: "Elite Influencer", url: BASE_URL },
        mainEntityOfPage: `${BASE_URL}/how-to-grow-on-social-media`,
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    },
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "How to Grow on Social Media", item: `${BASE_URL}/how-to-grow-on-social-media` },
        ],
    },
];

export default function GrowOnSocialMediaPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />

            <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8406f9]/10 blur-[150px] rounded-full pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    {/* Hero */}
                    <header className="mb-16 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                            <span className="material-symbols-outlined text-sm">rocket_launch</span>
                            Creator Playbook
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight animate-fade-in animate-delay-100">
                            HOW TO GROW ON{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8406f9] to-pink-500">SOCIAL MEDIA</span>
                        </h1>
                        <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto animate-fade-in animate-delay-200">
                            The six pillars behind every account that grows: niche, systems, short-form video, locations, engagement, and monetization. No hacks, just the playbook.
                        </p>
                    </header>

                    {/* Pillars */}
                    <section className="mb-16 space-y-5">
                        {PILLARS.map((p, i) => (
                            <div key={i} className="bg-[#111] border border-white/5 hover:border-[#8406f9]/40 rounded-2xl p-7 md:p-9 transition-all flex gap-5">
                                <div className="w-11 h-11 rounded-xl bg-[#8406f9]/10 border border-[#8406f9]/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[#8406f9]">{p.icon}</span>
                                </div>
                                <div>
                                    <h2 className="text-lg md:text-xl font-black mb-2">{p.title}</h2>
                                    <p className="text-white/60 text-sm md:text-base leading-relaxed mb-3">{p.text}</p>
                                    {p.link && (
                                        <Link href={p.link.href} className="inline-flex items-center gap-1.5 text-[#8406f9] font-bold text-sm hover:gap-2.5 transition-all">
                                            {p.link.label} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* FAQ */}
                    <section className="mb-16">
                        <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">Growing on social media: FAQ</h2>
                        <div className="space-y-4">
                            {FAQS.map((f, i) => (
                                <details key={i} className="group bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
                                    <summary className="cursor-pointer list-none p-6 flex items-center justify-between gap-4 font-bold text-white/90 hover:text-white transition-colors">
                                        {f.q}
                                        <span className="material-symbols-outlined text-[#8406f9] group-open:rotate-180 transition-transform shrink-0">expand_more</span>
                                    </summary>
                                    <p className="px-6 pb-6 text-white/60 leading-relaxed text-sm">{f.a}</p>
                                </details>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="rounded-3xl bg-gradient-to-br from-[#8406f9] to-[#4a048a] p-10 md:p-14 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-[150px] opacity-10"></div>
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Turn your growth into income</h2>
                        <p className="text-white/70 mb-8 text-lg max-w-xl mx-auto">
                            Free portfolio builder, rate calculator, AI pitches, and live paid campaigns — everything you need after the follower count.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/login" className="w-full sm:w-auto bg-white text-[#4a048a] font-black text-lg px-10 py-4 rounded-full transition-all hover:-translate-y-1 shadow-2xl">
                                Join Free
                            </Link>
                            <Link href="/brand-campaigns" className="w-full sm:w-auto bg-white/10 border border-white/20 text-white font-black text-lg px-10 py-4 rounded-full transition-all hover:bg-white/20">
                                Learn Brand Campaigns
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
