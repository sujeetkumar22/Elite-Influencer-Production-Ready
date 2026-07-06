import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CITY_INFO, cityByName, cityBySlug } from "@/utils/events";

export const metadata = {
    title: "Instagrammable Events in India — Pick Your City",
    description: "AI-curated, highly instagrammable events in Delhi NCR, Mumbai, Pune and Hyderabad. Updated daily with venues, dates and booking links.",
    alternates: { canonical: "https://eliteinfluencer.in/events" },
};

export default async function EventsHubPage({
    searchParams,
}: {
    searchParams: Promise<{ city?: string }>;
}) {
    // Legacy links used /events?city=Mumbai — send them to the SEO route
    const { city: cityParam } = await searchParams;
    if (cityParam) {
        const city = cityByName(cityParam) || cityBySlug(cityParam);
        redirect(`/events/${(city || CITY_INFO[0]).slug}`);
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden">
            <Navbar />

            <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8406f9]/10 blur-[150px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/5 blur-[150px] rounded-full pointer-events-none"></div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <header className="mb-16 text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(132,6,249,0.15)] animate-fade-in">
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                            Content-Worthy Experiences
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-white drop-shadow-lg animate-fade-in animate-delay-100">
                            INSTAGRAMMABLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8406f9] to-pink-500">EVENTS</span>
                        </h1>
                        <p className="text-white/60 text-lg md:text-xl leading-relaxed animate-fade-in animate-delay-200">
                            AI-curated events made for the camera — refreshed every day. Pick your city and find your next reel location.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {CITY_INFO.map((city, i) => (
                            <Link
                                key={city.slug}
                                href={`/events/${city.slug}`}
                                className={`group bg-[#111111] border border-white/5 hover:border-[#8406f9]/50 rounded-3xl p-8 md:p-10 transition-all duration-300 relative overflow-hidden hover:bg-[#161616] hover:-translate-y-1 animate-fade-in animate-delay-${(i + 1) * 100}`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8406f9]/5 rounded-full blur-2xl group-hover:bg-[#8406f9]/15 transition-all"></div>
                                <div className="w-12 h-12 rounded-full bg-[#8406f9]/20 flex items-center justify-center text-[#8406f9] mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">location_on</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black mb-2 group-hover:text-[#8406f9] transition-colors">
                                    {city.name}
                                </h2>
                                <p className="text-white/50 text-sm mb-6">
                                    Instagrammable events across {city.areas}.
                                </p>
                                <span className="flex items-center gap-2 text-[#8406f9] font-bold text-sm group-hover:gap-3 transition-all">
                                    Explore {city.name} events <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </Link>
                        ))}
                    </div>

                    <p className="text-center text-white/25 text-xs mt-14 max-w-xl mx-auto">
                        More cities coming soon. Want your city added? Tell us in the community.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
