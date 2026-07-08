import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandLeadForm from "@/components/BrandLeadForm";
import { createClient } from "@/utils/supabase/server";

const BASE_URL = "https://eliteinfluencer.in";

export const metadata = {
    title: "Hire Influencers in India — Run Your Brand Campaign",
    description:
        "Launch influencer campaigns with vetted creators across fashion, tech, food, finance and more in Delhi NCR, Mumbai, Pune and Hyderabad. Tell us your goal and budget — we match you with the right creators within 24 hours.",
    alternates: { canonical: `${BASE_URL}/for-brands` },
    openGraph: {
        title: "Hire Influencers in India — Run Your Brand Campaign | Elite Influencer",
        description:
            "Vetted creators, verified stats, end-to-end campaign support. Tell us your goal and budget — we reply within 24 hours.",
        type: "website",
        url: `${BASE_URL}/for-brands`,
    },
};

const VALUE_PROPS = [
    {
        icon: "verified",
        title: "Vetted creators, verified stats",
        text: "Every creator on Elite Influencer has a professional media kit with real views, reach and engagement — not inflated follower counts. You see exactly what you're paying for.",
    },
    {
        icon: "target",
        title: "Matched to your audience",
        text: "Fashion, beauty, tech, finance, food, travel, fitness, gaming — tell us your target customer and we shortlist creators whose audience actually matches.",
    },
    {
        icon: "handshake",
        title: "End-to-end campaign support",
        text: "From creator selection and pricing to briefs, timelines and content review — our team manages the campaign so you don't chase creators on DMs.",
    },
    {
        icon: "payments",
        title: "Transparent, fair pricing",
        text: "Rates based on real market CPM benchmarks — the same data our public CreatorCalc uses. No agency markups hidden in the dark.",
    },
];

const STEPS = [
    { n: "01", title: "Tell us your goal", text: "Fill the form with your budget, target niche and what you need — takes 2 minutes." },
    { n: "02", title: "Get a shortlist in 24h", text: "We match your brief against our creator network and send you a curated shortlist with verified stats." },
    { n: "03", title: "Launch your campaign", text: "Approve the creators, we handle briefs and delivery. You get content that performs." },
];

const FAQS = [
    {
        q: "How much does an influencer campaign cost in India?",
        a: "Branded content in India typically costs ₹250–800 per 1,000 views depending on the niche. A focused micro-influencer campaign can start under ₹25,000, while multi-creator launches typically run ₹1–5 lakh. Tell us your budget and we'll design around it.",
    },
    {
        q: "What kind of creators do you work with?",
        a: "Nano to mid-tier creators (1K–500K followers) across fashion, beauty, tech, finance, food, travel, fitness and gaming — primarily in Delhi NCR, Mumbai, Pune and Hyderabad, with reach across India.",
    },
    {
        q: "How fast can a campaign go live?",
        a: "We send creator recommendations within 24 hours of your inquiry. A single-creator reel campaign can be live within a week; multi-creator campaigns typically take 2–3 weeks from brief to posting.",
    },
    {
        q: "Do you handle UGC content for ads?",
        a: "Yes. If you need creator-made videos for your own ad accounts rather than posts on creator pages, we arrange UGC packages with full usage rights included.",
    },
];

export default async function ForBrandsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Influencer Marketing Campaigns",
            provider: { "@type": "Organization", name: "Elite Influencer", url: BASE_URL },
            areaServed: "IN",
            serviceType: "Influencer marketing",
            description:
                "Influencer campaign matchmaking and management with vetted creators across India. Verified stats, transparent CPM-based pricing, end-to-end support.",
            url: `${BASE_URL}/for-brands`,
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
                { "@type": "ListItem", position: 2, name: "For Brands", item: `${BASE_URL}/for-brands` },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar isLoggedIn={!!user} />

            <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#8406f9]/10 blur-[150px] rounded-full pointer-events-none"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    {/* Hero + form side by side */}
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-24">
                        <header className="pt-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                                <span className="material-symbols-outlined text-sm">storefront</span>
                                For Brands
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight animate-fade-in animate-delay-100">
                                RUN CAMPAIGNS WITH{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8406f9] to-pink-500">
                                    CREATORS WHO CONVERT
                                </span>
                            </h1>
                            <p className="text-white/60 text-lg leading-relaxed mb-8 animate-fade-in animate-delay-200">
                                Tell us your product, budget and target audience. Within 24 hours you get a shortlist of vetted creators with verified stats — and a team that manages the campaign end to end.
                            </p>
                            <ul className="space-y-3 animate-fade-in animate-delay-300">
                                {["Creators across 8+ niches and 4 metro cities", "Verified views, reach and engagement — no vanity metrics", "Transparent CPM-based pricing, no hidden markups"].map((point) => (
                                    <li key={point} className="flex items-start gap-3 text-white/70 text-sm md:text-base">
                                        <span className="material-symbols-outlined text-[#8406f9] text-xl shrink-0">check_circle</span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </header>

                        <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#8406f9]/20 blur-[80px] rounded-full pointer-events-none"></div>
                            <h2 className="text-2xl font-black mb-1 relative">Start Your Campaign</h2>
                            <p className="text-white/50 text-sm mb-8 relative">Free consultation — our team replies within 24 hours.</p>
                            <BrandLeadForm />
                        </div>
                    </div>

                    {/* Value props */}
                    <section className="mb-24">
                        <h2 className="text-2xl md:text-4xl font-black mb-10 text-center">Why brands work with us</h2>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {VALUE_PROPS.map((v) => (
                                <div key={v.title} className="bg-[#111] border border-white/5 hover:border-[#8406f9]/40 rounded-2xl p-8 transition-all">
                                    <div className="w-11 h-11 rounded-xl bg-[#8406f9]/10 border border-[#8406f9]/20 flex items-center justify-center mb-5">
                                        <span className="material-symbols-outlined text-[#8406f9]">{v.icon}</span>
                                    </div>
                                    <h3 className="text-lg font-black mb-2">{v.title}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">{v.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* How it works */}
                    <section className="mb-24">
                        <h2 className="text-2xl md:text-4xl font-black mb-10 text-center">How it works</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {STEPS.map((s) => (
                                <div key={s.n} className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
                                    <span className="absolute top-4 right-6 text-5xl font-black text-white/5">{s.n}</span>
                                    <h3 className="text-lg font-black mb-2 text-[#8406f9]">{s.title}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">{s.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="mb-24 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-4xl font-black mb-10 text-center">Brand FAQ</h2>
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
                        <p className="text-center text-white/40 text-sm mt-8">
                            Want to understand influencer pricing first? Read our{" "}
                            <Link href="/brand-campaigns" className="text-[#8406f9] font-bold hover:underline">brand campaigns guide</Link>.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
