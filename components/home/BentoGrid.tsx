'use client';

import Link from 'next/link';

export default function BentoGrid() {
    return (
        <section className="py-20 md:py-32 relative overflow-hidden bg-[#050505]">
            {/* Ambient Lighting */}
            <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-[#8406f9]/10 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-pink-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-4">
                        The Product Ecosystem
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                        EVERYTHING CREATORS NEED TO{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-[#8406f9]">
                            SCALE & EARN
                        </span>
                    </h2>
                    <p className="text-white/60 text-base sm:text-lg">
                        Five powerful creator-first tools designed to eliminate guesswork, establish instant credibility, and open direct pipelines to paid campaigns.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* BENTO 1: Living Media Kit (Spans 2 columns on desktop) */}
                    <div className="md:col-span-2 group relative bg-[#0c0c0e] border border-white/10 hover:border-[#8406f9]/40 rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(132,6,249,0.12)] flex flex-col justify-between overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#8406f9]/10 rounded-full blur-3xl group-hover:bg-[#8406f9]/20 transition-all pointer-events-none" />

                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#8406f9]/20 border border-[#8406f9]/30 flex items-center justify-center text-[#8406f9]">
                                    <span className="material-symbols-outlined text-2xl">brush</span>
                                </div>
                                <span className="text-[11px] font-bold text-[#8406f9] uppercase tracking-widest bg-[#8406f9]/15 px-3 py-1 rounded-full border border-[#8406f9]/30">
                                    Flagship Feature
                                </span>
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 group-hover:text-purple-200 transition-colors">
                                The Living Media Kit
                            </h3>
                            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
                                Ditch messy PDFs and static screenshots that expire in a week. Your Elite Influencer portfolio auto-presents your verified metrics, past brand collaborations, rate card, and direct contact options at a custom URL.
                            </p>

                            {/* Mini Interactive Preview Mockup */}
                            <div className="bg-[#141418] border border-white/10 rounded-2xl p-5 mb-6 backdrop-blur-xl">
                                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8406f9] to-pink-500 p-0.5">
                                            <div className="w-full h-full bg-[#111] rounded-[10px] flex items-center justify-center text-white font-bold text-xs">
                                                YK
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Yuvraj Kapoor <span className="text-[#8406f9]">✓</span></p>
                                            <p className="text-xs text-white/40">eliteinfluencer.in/yuvraj • Mumbai</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                        Active Rate Card: ₹28,000 / Reel
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div className="bg-white/[0.03] p-2.5 rounded-xl">
                                        <span className="text-white font-bold text-sm block">94.2K</span>
                                        <span className="text-[10px] text-white/40">Instagram</span>
                                    </div>
                                    <div className="bg-white/[0.03] p-2.5 rounded-xl">
                                        <span className="text-white font-bold text-sm block">6.1%</span>
                                        <span className="text-[10px] text-white/40">Engagement</span>
                                    </div>
                                    <div className="bg-white/[0.03] p-2.5 rounded-xl">
                                        <span className="text-white font-bold text-sm block">84%</span>
                                        <span className="text-[10px] text-white/40">India Audience</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#8406f9] hover:text-purple-300 transition-colors group-hover:translate-x-1"
                        >
                            <span>Build Your Portfolio Media Kit</span>
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </Link>
                    </div>

                    {/* BENTO 2: CreatorCalc Rate Intelligence */}
                    <div className="group relative bg-[#0c0c0e] border border-white/10 hover:border-[#8406f9]/40 rounded-3xl p-8 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(132,6,249,0.12)] flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#8406f9]/20 border border-[#8406f9]/30 flex items-center justify-center text-[#8406f9] mb-6">
                                <span className="material-symbols-outlined text-2xl">calculate</span>
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2">CreatorCalc™</h3>
                            <p className="text-white/60 text-sm leading-relaxed mb-6">
                                Stop guessing what to charge brands. Calculate accurate sponsorship rates for Reels, Stories, and YouTube using real Indian CPM benchmarks.
                            </p>

                            {/* Mini Calc Preview */}
                            <div className="bg-[#141418] border border-white/10 rounded-2xl p-4 mb-6">
                                <div className="text-[11px] text-white/40 mb-1">Estimated Reel Rate (50k Followers)</div>
                                <div className="text-2xl font-black text-[#8406f9] mb-2">₹18,000 – ₹25,000</div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-gradient-to-r from-[#8406f9] to-pink-500 h-full w-3/4 rounded-full" />
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/creator-calc"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#8406f9] hover:text-purple-300 transition-colors group-hover:translate-x-1"
                        >
                            <span>Calculate Your Rate</span>
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </Link>
                    </div>

                    {/* BENTO 3: Collab Finder Networking */}
                    <div className="group relative bg-[#0c0c0e] border border-white/10 hover:border-[#8406f9]/40 rounded-3xl p-8 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(132,6,249,0.12)] flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#8406f9]/10 rounded-full blur-3xl pointer-events-none" />

                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#8406f9]/20 border border-[#8406f9]/30 flex items-center justify-center text-[#8406f9]">
                                    <span className="material-symbols-outlined text-2xl">handshake</span>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                    New
                                </span>
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2">Collab Finder</h3>
                            <p className="text-white/60 text-sm leading-relaxed mb-6">
                                Connect with creators in Delhi NCR, Mumbai, and Bangalore for joint Reels, podcast appearances, and audience-swapping partnerships.
                            </p>

                            {/* Mini Collab Request Snippet */}
                            <div className="bg-[#141418] border border-white/10 rounded-2xl p-4 mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs text-white font-bold">Delhi NCR • Tech & AI</span>
                                </div>
                                <p className="text-xs text-white/70 line-clamp-2">
                                    &ldquo;Looking for AI startup creators for high-production joint podcast episode.&rdquo;
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/collabs"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#8406f9] hover:text-purple-300 transition-colors group-hover:translate-x-1"
                        >
                            <span>Browse Open Collabs</span>
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </Link>
                    </div>

                    {/* BENTO 4: AI Brand Pitch Engine */}
                    <div className="group relative bg-[#0c0c0e] border border-white/10 hover:border-[#8406f9]/40 rounded-3xl p-8 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(132,6,249,0.12)] flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#8406f9]/20 border border-[#8406f9]/30 flex items-center justify-center text-[#8406f9] mb-6">
                                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2">AI Pitch Engine</h3>
                            <p className="text-white/60 text-sm leading-relaxed mb-6">
                                Craft personalized, conversion-engineered brand pitch emails powered by Gemini AI. Convince marketing managers to reply.
                            </p>

                            {/* Mini Pitch Snippet */}
                            <div className="bg-[#141418] border border-white/10 rounded-2xl p-4 mb-6 font-mono text-[11px] text-white/60">
                                <span className="text-[#8406f9] font-bold block mb-1">AI Pitch Snippet:</span>
                                &ldquo;Hi [Brand Team], love your latest launch. My audience of 85k tech enthusiasts aligns directly...&rdquo;
                            </div>
                        </div>

                        <Link
                            href="/#ai-pitch"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#8406f9] hover:text-purple-300 transition-colors group-hover:translate-x-1"
                        >
                            <span>Generate Free Pitch</span>
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </Link>
                    </div>

                    {/* BENTO 5: Creator Marketplace */}
                    <div className="group relative bg-[#0c0c0e] border border-white/10 hover:border-[#8406f9]/40 rounded-3xl p-8 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(132,6,249,0.12)] flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                                <span className="material-symbols-outlined text-2xl">campaign</span>
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2">Paid Marketplace</h3>
                            <p className="text-white/60 text-sm leading-relaxed mb-6">
                                Direct access to verified brand briefs with real budgets and clear deliverables. Apply in one click with your media kit.
                            </p>

                            {/* Mini Campaign Snippet */}
                            <div className="bg-[#141418] border border-white/10 rounded-2xl p-4 mb-6">
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="font-bold text-white">AudioTech Brand Deal</span>
                                    <span className="text-emerald-400 font-black">₹45,000</span>
                                </div>
                                <p className="text-[11px] text-white/50">Tech & Lifestyle • 25k+ Followers</p>
                            </div>
                        </div>

                        <Link
                            href="/marketplace"
                            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors group-hover:translate-x-1"
                        >
                            <span>View Live Campaigns</span>
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
