import type { Metadata } from "next";

const BASE_URL = "https://eliteinfluencer.in";

// The calculator itself is a client component, so its SEO lives here.
// Targets: "influencer rate calculator", "how much to charge for brand deals".
export const metadata: Metadata = {
    title: "CreatorCalc — Influencer Rate Calculator for Brand Deals in India",
    description:
        "Free influencer rate calculator. Enter your niche, average views and engagement to get a defensible price for paid brand campaigns — based on real Indian market CPM rates.",
    alternates: { canonical: `${BASE_URL}/creator-calc` },
    openGraph: {
        title: "CreatorCalc — Influencer Rate Calculator for Brand Deals",
        description:
            "Know exactly what to charge brands. Free rate calculator built on real Indian market CPM data.",
        url: `${BASE_URL}/creator-calc`,
        type: "website",
    },
};

// Keep in sync with the visible FAQ section in page.tsx
const FAQS = [
    {
        q: "How much should I charge for an Instagram reel in India?",
        a: "It depends on your real inventory: views, not followers. Branded content in India typically earns creators ₹250 to ₹800 per 1,000 views depending on niche — finance and tech at the top, lifestyle at the bottom. A creator averaging 50,000 views per reel in a mid-tier niche can defensibly quote ₹15,000–30,000 for a dedicated reel.",
    },
    {
        q: "Do brands pay more for higher engagement?",
        a: "Yes. Engagement rate above 4% signals a real community and typically adds 20–40% to your rate, which is why this calculator applies an engagement multiplier. Below 2%, expect brands to negotiate down.",
    },
    {
        q: "What are usage rights and why do they change the price?",
        a: "Usage rights define where the brand can reuse your content. Organic social posting is standard. If the brand wants to run your video as a paid ad (full usage), charge about 1.5x. A perpetual buyout — the brand owns the video forever — is worth 2x or more.",
    },
    {
        q: "Should stories cost the same as reels?",
        a: "No. A story disappears in 24 hours and gets a fraction of a reel's reach — the market prices a story series at roughly a third of a dedicated reel. A reel plus 3 stories bundle typically adds about 25% over the reel alone.",
    },
];

const jsonLd = [
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "CreatorCalc",
        url: `${BASE_URL}/creator-calc`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
            "Free influencer rate calculator that prices paid brand campaigns from niche, average views, engagement, deliverable type and usage rights using Indian market CPM benchmarks.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        publisher: { "@type": "Organization", name: "Elite Influencer", url: BASE_URL },
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
];

export default function CreatorCalcLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            {children}
        </>
    );
}
