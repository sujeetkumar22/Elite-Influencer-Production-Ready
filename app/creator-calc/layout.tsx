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

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CreatorCalc",
    url: `${BASE_URL}/creator-calc`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
        "Free influencer rate calculator that prices paid brand campaigns from niche, average views, engagement and usage rights using Indian market CPM benchmarks.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    publisher: { "@type": "Organization", name: "Elite Influencer", url: BASE_URL },
};

export default function CreatorCalcLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            {children}
        </>
    );
}
