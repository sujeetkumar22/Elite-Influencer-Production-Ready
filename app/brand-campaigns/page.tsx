import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BASE_URL = "https://eliteinfluencer.in";

export const metadata = {
    title: "Brand Campaigns & Paid Campaigns for Creators — The Complete Guide",
    description: "What brand campaigns are, how much paid campaigns pay in India, and how creators land their first paid brand collaboration — with free tools to get started.",
    alternates: { canonical: `${BASE_URL}/brand-campaigns` },
    openGraph: {
        title: "Brand Campaigns & Paid Campaigns for Creators — The Complete Guide",
        description: "How paid brand campaigns work, what they pay, and how to land your first collaboration.",
        type: "article",
        url: `${BASE_URL}/brand-campaigns`,
    },
};

const CAMPAIGN_TYPES = [
    {
        icon: "paid",
        title: "Paid Campaigns",
        text: "The brand pays a fixed fee for deliverables — a reel, a set of stories, or a dedicated post. Rates depend on your reach, engagement, and niche.",
    },
    {
        icon: "swap_horiz",
        title: "Barter Collaborations",
        text: "You receive the product or an experience instead of cash. Common for early creators — good for portfolio building, but always know your worth.",
    },
    {
        icon: "trending_up",
        title: "Affiliate & Performance",
        text: "You earn a commission per sale through your link or code. Income scales with how well your audience trusts your recommendations.",
    },
    {
        icon: "videocam",
        title: "UGC Campaigns",
        text: "Brands pay you to create content they run on their own channels and ads. Follower count matters less — production quality matters more.",
    },
    {
        icon: "workspace_premium",
        title: "Brand Ambassadorships",
        text: "Long-term paid partnerships with monthly deliverables. The most stable creator income — usually earned after a successful one-off campaign.",
    },
];

const STEPS = [
    {
        title: "Build a professional portfolio",
        text: "Brands decide in seconds. A portfolio page with your stats, niche, past work and contact details converts far better than a DM with screenshots.",
        link: { href: "/dashboard", label: "Create your free portfolio" },
    },
    {
        title: "Know your rate before you negotiate",
        text: "Underpricing is the #1 mistake new creators make. Calculate a defensible rate based on your views, niche CPM, and usage rights.",
        link: { href: "/creator-calc", label: "Calculate your rate with CreatorCalc" },
    },
    {
        title: "Pitch brands directly",
        text: "Don't wait to be discovered. A short, personalized pitch that names the brand, shows your numbers, and proposes one concrete content idea outperforms generic outreach.",
        link: { href: "/#ai-pitch", label: "Generate a pitch with AI" },
    },
    {
        title: "Apply to live campaigns",
        text: "Browse active paid campaigns from brands looking for creators right now, filtered by niche and follower range.",
        link: { href: "/marketplace", label: "Browse the marketplace" },
    },
    {
        title: "Deliver, document, repeat",
        text: "Save results from every campaign — views, clicks, sales. Case studies with numbers are what turn one-off deals into ambassadorships.",
        link: null,
    },
];

const FAQS = [
    {
        q: "What is a brand campaign?",
        a: "A brand campaign is a structured collaboration where a brand works with content creators to promote a product or service. In influencer marketing this usually means the creator produces agreed deliverables — reels, posts, stories, or videos — for a fee (a paid campaign), a product exchange (barter), or performance-based commission (affiliate).",
    },
    {
        q: "How much do paid campaigns pay in India?",
        a: "Paid campaign rates in India typically follow a CPM model — a rate per 1,000 average views — that varies by niche: finance and tech command roughly ₹500–800 per 1,000 views, while lifestyle sits nearer ₹250. A production fee and usage-rights multiplier are added on top. A creator averaging 50,000 views can reasonably quote ₹15,000–40,000 per reel depending on niche and rights.",
    },
    {
        q: "How many followers do I need to get paid brand campaigns?",
        a: "Fewer than most people think. Brands increasingly prefer nano (1K–10K) and micro (10K–100K) creators because their engagement is higher and their audiences trust them more. If you have over 1,000 engaged followers and a clear niche, you can start pitching — and UGC campaigns don't depend on follower count at all.",
    },
    {
        q: "How do I find brand campaigns as a new creator?",
        a: "Three reliable routes: (1) build a professional portfolio so inbound brands take you seriously, (2) pitch 5–10 relevant brands per week with a short personalized message and one content idea, and (3) apply to live campaigns on creator marketplaces like Elite Influencer, where brands post paid deals with budgets and requirements listed upfront.",
    },
    {
        q: "Should I accept barter collaborations?",
        a: "Early on, selectively — barter builds your portfolio and relationships with brands. But set a boundary: once a brand has seen your content perform, the next campaign should be paid. Never accept barter for deliverables with heavy production cost or exclusive usage rights.",
    },
    {
        q: "What do brands look for before paying a creator?",
        a: "Five things: a real engagement rate (not bought followers), content quality they can show their manager, niche alignment with their customer, professionalism (media kit, on-time delivery, clear rates), and proof — past campaign results or even organic posts featuring products.",
    },
];

const jsonLd = [
    {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Brand Campaigns & Paid Campaigns for Creators — The Complete Guide",
        description: "What brand campaigns are, how much paid campaigns pay in India, and how creators land their first paid brand collaboration.",
        author: { "@type": "Organization", name: "Elite Influencer", url: BASE_URL },
        publisher: { "@type": "Organization", name: "Elite Influencer", url: BASE_URL },
        mainEntityOfPage: `${BASE_URL}/brand-campaigns`,
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
            { "@type": "ListItem", position: 2, name: "Brand Campaigns", item: `${BASE_URL}/brand-campaigns` },
        ],
    },
];

export default function BrandCampaignsPage() {
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
                            <span className="material-symbols-outlined text-sm">campaign</span>
                            Creator Guide
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight animate-fade-in animate-delay-100">
                            BRAND CAMPAIGNS &{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8406f9] to-pink-500">PAID CAMPAIGNS</span>
                            <br />FOR CREATORS
                        </h1>
                        <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto animate-fade-in animate-delay-200">
                            How paid brand collaborations actually work, what they pay in India, and the exact steps to land your first campaign — with free tools for each step.
                        </p>
                    </header>

                    {/* What is a brand campaign */}
                    <section className="mb-16 bg-[#111] border border-white/5 rounded-3xl p-8 md:p-12">
                        <h2 className="text-2xl md:text-3xl font-black mb-6">What is a brand campaign?</h2>
                        <div className="space-y-4 text-white/70 text-lg leading-relaxed">
                            <p>
                                A <strong className="text-white">brand campaign</strong> is a collaboration where a brand partners with content
                                creators to promote a product or service to the creator&apos;s audience. When money changes hands
                                for agreed deliverables — a reel, a post, a story sequence, a YouTube integration — it&apos;s a{" "}
                                <strong className="text-white">paid campaign</strong>.
                            </p>
                            <p>
                                For brands, campaigns buy authentic reach and trust that ads can&apos;t. For creators, they are the
                                core of creator income: in India&apos;s creator economy, paid brand collaborations are the largest
                                revenue stream for creators at every level, from nano-influencers to celebrities.
                            </p>
                        </div>
                    </section>

                    {/* Types */}
                    <section className="mb-16">
                        <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">The 5 types of brand campaigns</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {CAMPAIGN_TYPES.map((t, i) => (
                                <div key={i} className={`bg-[#111] border border-white/5 hover:border-[#8406f9]/40 rounded-2xl p-7 transition-all ${i === 4 ? "md:col-span-2" : ""}`}>
                                    <div className="w-11 h-11 rounded-xl bg-[#8406f9]/10 border border-[#8406f9]/20 flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-[#8406f9]">{t.icon}</span>
                                    </div>
                                    <h3 className="text-lg font-black mb-2">{t.title}</h3>
                                    <p className="text-white/60 text-sm leading-relaxed">{t.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Rates */}
                    <section className="mb-16 bg-[#111] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8406f9] rounded-full blur-[120px] opacity-10"></div>
                        <h2 className="text-2xl md:text-3xl font-black mb-6">How much do paid campaigns pay?</h2>
                        <div className="space-y-4 text-white/70 text-lg leading-relaxed mb-8">
                            <p>
                                Most Indian brand deals price on a <strong className="text-white">CPM basis</strong> — a rate per 1,000
                                average views — adjusted by niche, production effort, and usage rights. Finance and tech niches
                                command the highest CPMs (₹500–800), beauty and health sit in the middle (₹400–450), and broad
                                lifestyle content averages around ₹250.
                            </p>
                            <p>
                                On top of the base rate, add a <strong className="text-white">production fee</strong> for your shooting and
                                editing effort, and multiply for <strong className="text-white">usage rights</strong> — if the brand wants to
                                run your content as ads or keep it forever, your rate should be 1.5–2× higher.
                            </p>
                        </div>
                        <Link
                            href="/creator-calc"
                            className="inline-flex items-center gap-2 bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold px-8 py-4 rounded-full transition-all shadow-[0_0_20px_rgba(132,6,249,0.3)]"
                        >
                            Calculate your exact rate — free
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </section>

                    {/* Steps */}
                    <section className="mb-16">
                        <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">How to land your first paid campaign</h2>
                        <ol className="space-y-5">
                            {STEPS.map((s, i) => (
                                <li key={i} className="flex gap-5 bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8">
                                    <div className="w-10 h-10 rounded-full bg-[#8406f9] flex items-center justify-center font-black text-lg shrink-0">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black mb-2">{s.title}</h3>
                                        <p className="text-white/60 text-sm leading-relaxed mb-3">{s.text}</p>
                                        {s.link && (
                                            <Link href={s.link.href} className="inline-flex items-center gap-1.5 text-[#8406f9] font-bold text-sm hover:gap-2.5 transition-all">
                                                {s.link.label} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                            </Link>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </section>

                    {/* FAQ */}
                    <section className="mb-16">
                        <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">Brand campaigns — FAQ</h2>
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
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Ready for your first paid campaign?</h2>
                        <p className="text-white/70 mb-8 text-lg max-w-xl mx-auto">
                            Build your portfolio, price yourself right, and apply to live brand deals — all free.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/marketplace" className="w-full sm:w-auto bg-white text-[#4a048a] font-black text-lg px-10 py-4 rounded-full transition-all hover:-translate-y-1 shadow-2xl">
                                Browse Live Campaigns
                            </Link>
                            <Link href="/login" className="w-full sm:w-auto bg-white/10 border border-white/20 text-white font-black text-lg px-10 py-4 rounded-full transition-all hover:bg-white/20">
                                Join Free
                            </Link>
                        </div>
                    </section>

                    {/* Related */}
                    <section className="mt-14 text-center">
                        <p className="text-white/40 text-sm mb-4 font-bold uppercase tracking-widest">Keep learning</p>
                        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                            <Link href="/how-to-grow-on-social-media" className="text-[#8406f9] hover:text-white font-bold text-sm transition-colors">
                                How to grow on social media →
                            </Link>
                            <Link href="/feeds" className="text-[#8406f9] hover:text-white font-bold text-sm transition-colors">
                                Creator economy insights →
                            </Link>
                            <Link href="/events" className="text-[#8406f9] hover:text-white font-bold text-sm transition-colors">
                                Instagrammable events near you →
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
