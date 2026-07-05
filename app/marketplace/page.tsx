import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Brand Deals Marketplace",
    description: "High-ticket collaborations with premium brands. Apply directly and secure your next big deal.",
};

interface BrandOffer {
    id: string;
    brand_name: string;
    budget: string;
    niche: string;
    requirements: string;
    logo_url?: string | null;
    follower_range?: string;
    apply_link?: string;
    created_at: string;
}

export default async function MarketplacePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isLoggedIn = !!user;

    // Fetch active brand offers
    const { data: offers, error } = await supabase
        .from("brand_offers")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching brand offers:", error);
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden">
            <Navbar isLoggedIn={isLoggedIn} />
            <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8406f9]/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-20 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(132,6,249,0.15)] animate-fade-in">
                        Exclusive Partnerships
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-white drop-shadow-lg animate-fade-in animate-delay-100">
                        BRAND <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8406f9] to-pink-500">DEALS</span>
                    </h1>
                    <p className="text-white/60 text-lg md:text-xl leading-relaxed animate-fade-in animate-delay-200">
                        High-ticket collaborations with premium brands. Apply directly and secure your next big deal.
                    </p>
                </header>

                {offers && offers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {offers.map((offer: BrandOffer) => (
                            <div
                                key={offer.id}
                                className="group bg-[#111111] border border-white/5 hover:border-[#8406f9]/50 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden hover:bg-[#161616] flex flex-col justify-between"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#8406f9]/5 rounded-full blur-2xl group-hover:bg-[#8406f9]/15 transition-all"></div>
                                
                                <div>
                                    {/* Brand Logo & Name */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 overflow-hidden">
                                            {offer.logo_url ? (
                                                <img src={offer.logo_url} alt={offer.brand_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-3xl text-[#8406f9]">campaign</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold group-hover:text-[#8406f9] transition-colors">{offer.brand_name}</h3>
                                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white/60 mt-1 uppercase tracking-wider">{offer.niche}</span>
                                        </div>
                                    </div>

                                    {/* Offer Details */}
                                    <div className="space-y-4 mb-8">
                                        <div>
                                            <span className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-1">Budget / Payout</span>
                                            <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-[#8406f9]">{offer.budget}</p>
                                        </div>

                                        {offer.follower_range && (
                                            <div>
                                                <span className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-1">Followers Needed</span>
                                                <p className="text-white/90 text-sm font-semibold">{offer.follower_range}</p>
                                            </div>
                                        )}

                                        <div>
                                            <span className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-1">Requirements</span>
                                            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{offer.requirements}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {isLoggedIn ? (
                                    <a
                                        href={offer.apply_link || "https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(132,6,249,0.15)] flex items-center justify-center gap-2 group-hover:shadow-[0_0_25px_rgba(132,6,249,0.3)]"
                                    >
                                        {offer.apply_link ? "Apply Now" : "Apply via Community"} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </a>
                                ) : (
                                    <Link
                                        href="/login?next=/marketplace"
                                        className="w-full bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(132,6,249,0.15)] flex items-center justify-center gap-2 group-hover:shadow-[0_0_25px_rgba(132,6,249,0.3)]"
                                    >
                                        {offer.apply_link ? "Apply Now" : "Apply via Community"} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="max-w-xl mx-auto text-center py-24 bg-[#111111] rounded-3xl border border-white/5 backdrop-blur-sm shadow-2xl">
                        <span className="material-symbols-outlined text-6xl text-white/10 mb-6 block">lock</span>
                        <h3 className="text-2xl font-bold mb-3 text-white">No active brand deals right now.</h3>
                        <p className="text-white/50 text-lg max-w-sm mx-auto">We are currently negotiating with premium brands. Join the community to get instant updates once a new deal lands.</p>
                        <a
                            href="https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex mt-8 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-full transition-all text-sm gap-2"
                        >
                            Join Community Group <span className="material-symbols-outlined text-sm">group</span>
                        </a>
                    </div>
                )}
            </div>
            </div>
            <Footer />
        </div>
    );
}
