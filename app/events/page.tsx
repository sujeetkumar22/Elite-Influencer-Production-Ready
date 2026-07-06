import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import { CITIES, getCityEvents, resolveCity, type CityEvent } from "@/utils/events";

export const metadata = {
    title: "Instagrammable Events Near You",
    description: "AI-curated, highly instagrammable events across Indian cities — find your next content-worthy experience.",
};

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

export default async function EventsPage({
    searchParams,
}: {
    searchParams: Promise<{ city?: string }>;
}) {
    const { city: cityParam } = await searchParams;
    const city = resolveCity(cityParam);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const events = await getCityEvents(city);

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden">
            <Navbar isLoggedIn={!!user} />

            <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative">
                {/* Background ambient glow */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8406f9]/10 blur-[150px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/5 blur-[150px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <header className="mb-14 text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(132,6,249,0.15)] animate-fade-in">
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                            Content-Worthy Experiences
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-white drop-shadow-lg animate-fade-in animate-delay-100">
                            INSTAGRAMMABLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8406f9] to-pink-500">EVENTS</span>
                        </h1>
                        <p className="text-white/60 text-lg md:text-xl leading-relaxed animate-fade-in animate-delay-200">
                            AI-curated events in your city that are made for the camera. Pick a city, find your next reel location.
                        </p>
                    </header>

                    {/* City selector */}
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-14">
                        {CITIES.map((c) => (
                            <Link
                                key={c}
                                href={`/events?city=${encodeURIComponent(c)}`}
                                className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm font-bold transition-all border ${
                                    c === city
                                        ? "bg-[#8406f9] border-[#8406f9] text-white shadow-[0_0_20px_rgba(132,6,249,0.4)]"
                                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                {c}
                            </Link>
                        ))}
                    </div>

                    {/* Events grid */}
                    {events.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {events.map((event, i) => (
                                    <EventCard key={i} event={event} city={city} />
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
                            <h3 className="text-2xl font-bold mb-3 text-white">Couldn&apos;t load events for {city}.</h3>
                            <p className="text-white/50 text-lg max-w-sm mx-auto mb-8">
                                Our event scout is taking a break. Try another city or check back in a few minutes.
                            </p>
                            <Link
                                href="/events"
                                className="inline-flex bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-full transition-all text-sm gap-2"
                            >
                                Retry <span className="material-symbols-outlined text-sm">refresh</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

function EventCard({ event, city }: { event: CityEvent; city: string }) {
    // Always give the user a working way in: the event's own link when the
    // AI found one, otherwise a targeted Google search.
    const href = event.link || `https://www.google.com/search?q=${encodeURIComponent(`${event.title} ${city} tickets`)}`;

    return (
        <div className="group bg-[#111111] border border-white/5 hover:border-[#8406f9]/50 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden hover:bg-[#161616] flex flex-col justify-between">
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
        </div>
    );
}
