import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadForm from "@/components/LeadForm";
import AIPitchGenerator from "@/components/AIPitchGenerator";
import HeroShowcase from "@/components/home/HeroShowcase";
import AudienceSplit from "@/components/home/AudienceSplit";
import BentoGrid from "@/components/home/BentoGrid";
import HowItWorks from "@/components/home/HowItWorks";
import HomeFaq from "@/components/home/HomeFaq";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
    title: "Elite Influencer | The Operating System for Creators & Brands",
    description: "Build a professional media kit, calculate fair market pricing with CreatorCalc, discover verified collabs, and connect with direct paid brand campaigns in India.",
    alternates: { canonical: "https://eliteinfluencer.in" },
    openGraph: {
        title: "Elite Influencer | The Operating System for Creators & Brands",
        description: "India's creator ecosystem for paid brand campaigns, professional portfolios, rate cards, and networking.",
        url: "https://eliteinfluencer.in",
        type: "website",
    },
};

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isLoggedIn = !!user;

    return (
        <div className="bg-[#050505] min-h-screen text-white relative selection:bg-[#8406f9] selection:text-white">
            <Navbar isLoggedIn={isLoggedIn} />

            <main className="pt-24 pb-20">
                {/* 1. ATMOSPHERIC HERO WITH FLOATING 3D CREATOR SHOWCASE */}
                <HeroShowcase isLoggedIn={isLoggedIn} />

                {/* 3. DUAL-AUDIENCE SPLIT (CREATORS VS BRANDS & AGENCIES) */}
                <AudienceSplit />

                {/* 4. INTERACTIVE BENTO GRID PRODUCT ECOSYSTEM */}
                <BentoGrid />

                {/* 5. 3-STEP "HOW IT WORKS" WORKFLOW */}
                <HowItWorks />

                {/* AI PITCH GENERATOR ENGINE */}
                <section id="ai-pitch" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#070709] border-b border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-4">
                                Gemini AI Powered
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                                WRITE BRAND PITCHES THAT{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-[#8406f9]">
                                    GET ANSWERED
                                </span>
                            </h2>
                            <p className="text-white/60 text-base sm:text-lg">
                                Generate personalized, high-converting outreach emails to marketing teams and PR agencies in 5 seconds.
                            </p>
                        </div>

                        <AIPitchGenerator />
                    </div>
                </section>

                {/* 8. INTERACTIVE FAQ ACCORDION */}
                <HomeFaq />

                {/* APPLICATION FORM & VIP WHATSAPP COMMUNITY */}
                <section id="application-form" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                    <div className="bg-[#0c0c0e] rounded-3xl border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                        <div className="flex-1 p-8 sm:p-12 md:p-14">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-wider mb-4">
                                Join Agency Roster
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">Apply for Priority Brand Deals</h3>
                            <p className="text-white/60 text-sm mb-8">
                                Tell us about your channels, niche, and audience. We match qualified creators directly with high-ticket brand campaigns.
                            </p>
                            <LeadForm />
                        </div>

                        <div className="md:w-88 bg-gradient-to-br from-[#8406f9] via-[#6504be] to-[#3a036e] p-8 sm:p-12 text-white flex flex-col justify-between">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-6">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                                    Active WhatsApp Group
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black mb-4 leading-tight">
                                    Join Our Creator Community
                                </h3>
                                <p className="text-white/80 text-sm leading-relaxed mb-6">
                                    Get instant alerts for high-ticket casting calls, collab meetups, and direct brand requirements before they go public.
                                </p>
                            </div>

                            <div>
                                <div className="text-xs text-white/60 mb-3 font-medium">Free access • 500+ Indian Creators</div>
                                <a
                                    href="https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full bg-[#25D366] hover:bg-[#20bd5a] text-center font-bold py-4 px-6 rounded-2xl text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Join WhatsApp Group
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
