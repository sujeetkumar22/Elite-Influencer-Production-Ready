'use client';

import Link from 'next/link';

const STEPS = [
    {
        number: '01',
        icon: 'badge',
        title: 'Build & Verify Your Media Kit',
        subtitle: 'Takes 60 seconds',
        description: 'Claim your exclusive handle (eliteinfluencer.in/yourname). Connect your platforms, showcase your best content, highlight past brand partners, and set your transparent rate card.',
        badge: 'Zero Setup Cost',
        highlight: 'Instant link in bio ready for brands'
    },
    {
        number: '02',
        icon: 'trending_up',
        title: 'Price Fairly & Expand Your Network',
        subtitle: 'Data-driven leverage',
        description: 'Use CreatorCalc to determine your true market rate per Reel or Story. Find local creators on the Collab Board for joint videos, and draft AI-powered outreach emails.',
        badge: 'Backed by Indian CPM Data',
        highlight: 'Never get lowballed by agencies again'
    },
    {
        number: '03',
        icon: 'payments',
        title: 'Get Hired & Keep 100% Earnings',
        subtitle: 'Direct brand partnerships',
        description: 'Receive direct collaboration inquiries from marketing managers and apply to live briefs on our Marketplace. No agency skimming 30% to 50% of your earnings.',
        badge: '0% Middleman Commission',
        highlight: 'Keep every rupee you earn'
    }
];

export default function HowItWorks() {
    return (
        <section className="py-20 md:py-32 relative overflow-hidden bg-[#070709] border-y border-white/5">
            {/* Background lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#8406f9]/10 blur-[160px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-4">
                        Simple, Transparent Workflow
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                        HOW TO MONETIZE ON{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-[#8406f9]">
                            ELITE INFLUENCER
                        </span>
                    </h2>
                    <p className="text-white/60 text-base sm:text-lg">
                        Three simple steps from setting up your aesthetic media kit to securing high-paying direct brand sponsorships.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {STEPS.map((step) => (
                        <div
                            key={step.number}
                            className="group relative bg-[#0c0c0e] border border-white/10 hover:border-[#8406f9]/40 rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(132,6,249,0.12)] flex flex-col justify-between"
                        >
                            {/* Glowing top step number badge */}
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white/30 to-white/5 font-mono group-hover:from-[#8406f9] group-hover:to-pink-500 transition-all duration-300">
                                        {step.number}
                                    </span>
                                    <div className="w-12 h-12 rounded-2xl bg-[#8406f9]/15 border border-[#8406f9]/30 flex items-center justify-center text-[#8406f9]">
                                        <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                                    </div>
                                </div>

                                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8406f9] uppercase tracking-wider mb-2">
                                    <span>{step.subtitle}</span>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-black text-white mb-4 leading-snug">
                                    {step.title}
                                </h3>

                                <p className="text-white/60 text-sm leading-relaxed mb-6">
                                    {step.description}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs text-white/40 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm text-green-400">check</span>
                                    {step.highlight}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA bar */}
                <div className="mt-16 text-center">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold text-base transition-all shadow-[0_0_30px_rgba(132,6,249,0.35)] hover:shadow-[0_0_50px_rgba(132,6,249,0.55)] hover:-translate-y-0.5 cursor-pointer"
                    >
                        <span>Launch Your Creator Portfolio Now</span>
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
