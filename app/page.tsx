

import type { Metadata } from "next";
import Link from "next/link";
import LeadForm from "@/components/LeadForm";
import AIPitchGenerator from "@/components/AIPitchGenerator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
    alternates: { canonical: "https://eliteinfluencer.in" },
};

const FEATURES = [
    {
        icon: "campaign",
        title: "Brand Deals",
        text: "Apply to live paid campaigns from brands actively looking for creators.",
        href: "/marketplace",
        cta: "View Marketplace",
    },
    {
        icon: "brush",
        title: "Portfolio Builder",
        text: "Turn your profile into a professional media kit brands can trust — in minutes.",
        href: "/dashboard",
        cta: "Build Portfolio",
    },
    {
        icon: "calculate",
        title: "CreatorCalc",
        text: "Price your content with real data — know exactly what to charge per campaign.",
        href: "/creator-calc",
        cta: "Calculate My Rate",
    },
    {
        icon: "auto_awesome",
        title: "AI Pitch Generator",
        text: "Generate professional brand outreach pitches tailored to your profile.",
        href: "/#ai-pitch",
        cta: "Write My Pitch",
    },
    {
        icon: "event",
        title: "Events",
        text: "Discover highly instagrammable events in Delhi NCR, Mumbai, Pune and Hyderabad.",
        href: "/events",
        cta: "View Events",
        badge: "New",
    },
    {
        icon: "menu_book",
        title: "Creator Guides",
        text: "Learn how brand campaigns work and how to grow on social media.",
        href: "/brand-campaigns",
        cta: "Read the Guides",
        secondary: { href: "/how-to-grow-on-social-media", label: "Growth Playbook" },
    },
];

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isLoggedIn = !!user;

    return (
        <div className="bg-[#050505] min-h-screen text-white">

            <Navbar isLoggedIn={isLoggedIn} />

            <main className="pt-32 pb-20">
                {/* HERO */}
                <section className="max-w-5xl mx-auto px-6 text-center mb-24 pt-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8406f9] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8406f9]"></span>
                        </span>
                        India&apos;s Creator Ecosystem — Free to Join
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-gradient animate-fade-in animate-delay-100">
                        GET PAID BRAND CAMPAIGNS.<br />BUILD YOUR CREATOR BRAND.
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 mb-10 leading-relaxed animate-fade-in animate-delay-200">
                        Build a professional media kit, price your content with real data, pitch brands with AI, and apply to live paid campaigns — everything creators need to earn, in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animate-delay-300">
                        <Link href={isLoggedIn ? "/dashboard" : "/login"} className="w-full sm:w-auto px-10 py-4 bg-[#8406f9] rounded-full font-bold text-lg hover:bg-[#8406f9]/90 transition-all transform hover:scale-105 text-center shadow-[0_0_20px_rgba(132,6,249,0.3)] hover:shadow-[0_0_40px_rgba(132,6,249,0.5)]">
                            {isLoggedIn ? "Open My Dashboard" : "Build Your Free Portfolio"}
                        </Link>
                        <Link href="/creator-calc" className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-all text-center hover:scale-105">
                            CreatorCalc
                        </Link>
                    </div>
                </section>

                {/* FEATURES */}
                <section id="features" className="max-w-7xl mx-auto px-6 mb-24">
                    <div className="grid md:grid-cols-3 gap-6">
                        {FEATURES.map((f, i) => (
                            <div
                                key={f.title}
                                className={`group p-8 rounded-lg bg-white/5 border border-white/10 hover:border-[#8406f9]/50 transition-all relative overflow-hidden hover:bg-white/10 hover:-translate-y-1 duration-300 animate-fade-in animate-delay-${((i % 3) + 1) * 100}`}
                            >
                                {f.badge && (
                                    <div className="absolute top-3 right-3 bg-[#8406f9]/20 text-[#8406f9] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">{f.badge}</div>
                                )}
                                <div className="w-12 h-12 rounded-full bg-[#8406f9]/20 flex items-center justify-center text-[#8406f9] mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">{f.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                <p className="text-white/50 mb-6">{f.text}</p>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <Link href={f.href} className="flex items-center gap-2 text-[#8406f9] font-bold text-sm hover:text-[#8406f9]/80 transition-colors group-hover:gap-3">
                                        {f.cta} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </Link>
                                    {f.secondary && (
                                        <Link href={f.secondary.href} className="flex items-center gap-2 text-white/40 hover:text-[#8406f9] font-bold text-sm transition-colors">
                                            {f.secondary.label} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* AI PITCH GENERATOR */}
                <section id="ai-pitch" className="px-6 mb-32 pt-10">
                    <AIPitchGenerator />
                </section>

                {/* FORM */}
                <section id="application-form" className="max-w-5xl mx-auto px-6">
                    <div className="bg-[#111111] rounded-lg border border-white/5 overflow-hidden flex flex-col md:flex-row shadow-2xl">
                        <div className="flex-1 p-10 md:p-14">
                            <LeadForm />
                        </div>
                        <div className="md:w-80 bg-gradient-to-br from-[#8406f9] to-[#4a048a] p-10 text-white">
                            <h3 className="text-2xl font-black mb-4">Join Community</h3>
                            <p className="mb-8 text-white/80">Get instant alerts for high-ticket deals.</p>
                            <a href="https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq" target="_blank" className="block w-full bg-[#25D366] text-center font-bold py-4 rounded-full text-white">WhatsApp Group</a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
