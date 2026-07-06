import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CITY_INFO, cityBySlug, getCityEvents, type CityEvent } from "@/utils/events";

// Fully static pages, regenerated once a day — fast for visitors,
// crawlable for Google, and at most 4 Gemini calls per day.
export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
    return CITY_INFO.map((c) => ({ city: c.slug }));
}

const BASE_URL = "https://eliteinfluencer.in";

const CATEGORY_ICONS: Record<string, string> = {
    Music: "music_note",
    Art: "palette",
    Food: "restaurant",
    Culture: "temple_hindu",
    Nightlife: "nightlife",
    Market: "storefront",
    Festival: "celebration",
    Exhibition: "museum",
    Sports: "sports_basketball",
    Other: "star",
};

function monthYear() {
    return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ city: string }>;
}): Promise<Metadata> {
    const { city: slug } = await params;
    const city = cityBySlug(slug);
    if (!city) return { title: "Events Not Found" };

    const title = `Instagrammable Events in ${city.name} (${monthYear()})`;
    const description = `AI-curated list of the most instagrammable events in ${city.name} right now — art shows, festivals, flea markets and pop-ups across ${city.areas}. Updated daily with links to book.`;

    return {
        title,
        description,
        alternates: { canonical: `${BASE_URL}/events/${city.slug}` },
        openGraph: { title, description, type: "website", url: `${BASE_URL}/events/${city.slug}` },
        twitter: { card: "summary_large_image", title, description },
    };
}

export default async function CityEventsPage({
    params,
}: {
    params: Promise<{ city: string }>;
}) {
    const { city: slug } = await params;
    const city = cityBySlug(slug);
    if (!city) return notFound();

    const events = await getCityEvents(city.name);
    const topThree = events.slice(0, 3).map((e) => e.title).join(", ");

    // FAQ shown on the page AND emitted as FAQPage schema — the format
    // AI search engines (and Google AI Overviews) cite most readily.
    const faqs = [
        {
            q: `What are the most instagrammable events in ${city.name} right now?`,
            a: events.length > 0
                ? `Right now the standout content-worthy events in ${city.name} include ${topThree}. The full curated list above covers ${events.length} events across ${city.areas}, with dates, venues and booking links.`
                : `Our curated list of instagrammable events in ${city.name} is refreshed daily — check back shortly for the latest lineup across ${city.areas}.`,
        },
        {
            q: `How is this list of ${city.name} events curated?`,
            a: `Elite Influencer curates events automatically using AI with live Google Search, focusing on visually spectacular experiences — immersive art, festivals, night markets and pop-ups — that work best for Instagram reels and photos. The list refreshes every 24 hours.`,
        },
        {
            q: `Where can I book tickets for these ${city.name} events?`,
            a: `Every event card links to its official page or ticketing platform (BookMyShow, District, Paytm Insider or the venue's own site). Dates and availability can change, so always verify on the event page before heading out.`,
        },
    ];

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Instagrammable events in ${city.name} — ${monthYear()}`,
            description: `Curated list of the most instagrammable events in ${city.name}, India. Updated daily.`,
            url: `${BASE_URL}/events/${city.slug}`,
            numberOfItems: events.length,
            itemListElement: events.map((e, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                    "@type": "Event",
                    name: e.title,
                    description: [e.description, e.why_instagrammable].filter(Boolean).join(" "),
                    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
                    location: {
                        "@type": "Place",
                        name: e.venue || city.name,
                        address: `${city.name}, India`,
                    },
                    ...(e.link ? { url: e.link } : {}),
                },
            })),
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
                { "@type": "ListItem", position: 2, name: "Events", item: `${BASE_URL}/events` },
                { "@type": "ListItem", position: 3, name: city.name, item: `${BASE_URL}/events/${city.slug}` },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
        },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Navbar />

            <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative">
                {/* Background ambient glow */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8406f9]/10 blur-[150px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/5 blur-[150px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header — h1 targets the exact search phrase */}
                    <header className="mb-10 text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(132,6,249,0.15)] animate-fade-in">
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                            Updated Daily · {monthYear()}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight text-white drop-shadow-lg animate-fade-in animate-delay-100">
                            INSTAGRAMMABLE EVENTS IN{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8406f9] to-pink-500 uppercase">{city.name}</span>
                        </h1>
                        <p className="text-white/60 text-lg md:text-xl leading-relaxed animate-fade-in animate-delay-200">
                            The most content-worthy events happening across {city.areas} — curated with AI, refreshed every day, made for your next reel.
                        </p>
                    </header>

                    {/* City switcher */}
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-14">
                        {CITY_INFO.map((c) => (
                            <Link
                                key={c.slug}
                                href={`/events/${c.slug}`}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                                    c.slug === city.slug
                                        ? "bg-[#8406f9] border-[#8406f9] text-white shadow-[0_0_20px_rgba(132,6,249,0.4)]"
                                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                {c.name}
                            </Link>
                        ))}
                    </div>

                    {/* Events grid */}
                    {events.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {events.map((event, i) => (
                                    <EventCard key={i} event={event} cityName={city.name} />
                                ))}
                            </div>
                            <p className="text-center text-white/25 text-xs mt-12 max-w-xl mx-auto">
                                Curated automatically with AI + Google Search and refreshed daily.
                                Dates and availability can change — always verify on the event page before heading out.
                            </p>
                        </>
                    ) : (
                        <div className="max-w-xl mx-auto text-center py-24 bg-[#111111] rounded-3xl border border-white/5 backdrop-blur-sm shadow-2xl">
                            <span className="material-symbols-outlined text-6xl text-white/10 mb-6 block">event_busy</span>
                            <h3 className="text-2xl font-bold mb-3 text-white">Couldn&apos;t load events for {city.name}.</h3>
                            <p className="text-white/50 text-lg max-w-sm mx-auto mb-8">
                                Our event scout is taking a break. Try another city or check back in a few minutes.
                            </p>
                            <Link
                                href="/events"
                                className="inline-flex bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-full transition-all text-sm gap-2"
                            >
                                All Cities <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                    )}

                    {/* FAQ — visible content backing the FAQPage schema */}
                    <section className="mt-24 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">
                            {city.name} Events — FAQ
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((f, i) => (
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

                    {/* Cross-links for crawlers and users */}
                    <section className="mt-16 text-center">
                        <p className="text-white/40 text-sm mb-4 font-bold uppercase tracking-widest">Explore other cities</p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {CITY_INFO.filter((c) => c.slug !== city.slug).map((c) => (
                                <Link key={c.slug} href={`/events/${c.slug}`} className="text-[#8406f9] hover:text-white font-bold text-sm transition-colors">
                                    Instagrammable events in {c.name} →
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
}

function EventCard({ event, cityName }: { event: CityEvent; cityName: string }) {
    // Always give the user a working way in: the event's own link when the
    // AI found one, otherwise a targeted Google search.
    const href = event.link || `https://www.google.com/search?q=${encodeURIComponent(`${event.title} ${cityName} tickets`)}`;

    return (
        <article className="group bg-[#111111] border border-white/5 hover:border-[#8406f9]/50 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden hover:bg-[#161616] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#8406f9]/5 rounded-full blur-2xl group-hover:bg-[#8406f9]/15 transition-all"></div>

            <div>
                {/* Category + dates */}
                <div className="flex items-center justify-between gap-3 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-[10px] font-bold uppercase tracking-widest">
                        <span className="material-symbols-outlined text-xs">{CATEGORY_ICONS[event.category] || "star"}</span>
                        {event.category}
                    </span>
                    {event.dates && (
                        <span className="inline-flex items-center gap-1 text-white/40 text-xs font-bold shrink-0">
                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                            {event.dates}
                        </span>
                    )}
                </div>

                {/* Title + venue */}
                <h3 className="text-xl font-black mb-2 group-hover:text-[#8406f9] transition-colors leading-tight">
                    {event.title}
                </h3>
                {event.venue && (
                    <p className="flex items-center gap-1.5 text-white/50 text-sm font-semibold mb-4">
                        <span className="material-symbols-outlined text-sm text-white/30">location_on</span>
                        {event.venue}
                    </p>
                )}

                {/* Description */}
                {event.description && (
                    <p className="text-white/60 text-sm leading-relaxed mb-4">{event.description}</p>
                )}

                {/* Why instagrammable */}
                {event.why_instagrammable && (
                    <div className="flex items-start gap-2 bg-white/5 border border-white/5 rounded-xl px-4 py-3 mb-6">
                        <span className="material-symbols-outlined text-[#8406f9] text-base mt-0.5">photo_camera</span>
                        <p className="text-white/70 text-xs leading-relaxed font-medium">{event.why_instagrammable}</p>
                    </div>
                )}
            </div>

            {/* Action */}
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white/5 hover:bg-[#8406f9] border border-white/10 hover:border-[#8406f9] text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
                {event.link ? "View Event" : "Find Tickets"}
                <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
        </article>
    );
}
