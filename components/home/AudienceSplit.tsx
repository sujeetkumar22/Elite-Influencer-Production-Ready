'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AudienceSplit() {
    const [activeTab, setActiveTab] = useState<'creators' | 'brands'>('creators');

    return (
        <section className="py-20 md:py-32 relative overflow-hidden bg-[#070709] border-y border-white/5">
            {/* Background lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#8406f9]/10 blur-[140px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-4">
                        A Two-Sided Creator Engine
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                        BUILT FOR BOTH SIDES OF THE{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8406f9] to-pink-500">
                            CREATOR ECONOMY
                        </span>
                    </h2>
                    <p className="text-white/60 text-base sm:text-lg">
                        Whether you are a creator building your personal brand or a marketing manager launching your next viral campaign, Elite Influencer is engineered for your growth.
                    </p>

                    {/* Interactive Tab Switcher */}
                    <div className="inline-flex p-1.5 bg-[#121214] border border-white/10 rounded-full mt-8 shadow-xl">
                        <button
                            onClick={() => setActiveTab('creators')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                                activeTab === 'creators'
                                    ? 'bg-[#8406f9] text-white shadow-[0_0_20px_rgba(132,6,249,0.4)]'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            <span className="material-symbols-outlined text-base sm:text-lg">brush</span>
                            <span>For Content Creators</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('brands')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                                activeTab === 'brands'
                                    ? 'bg-[#8406f9] text-white shadow-[0_0_20px_rgba(132,6,249,0.4)]'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            <span className="material-symbols-outlined text-base sm:text-lg">campaign</span>
                            <span>For Brands & Agencies</span>
                        </button>
                    </div>
                </div>

                {/* Content Panel: Creators */}
                {activeTab === 'creators' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#0d0d10] border border-white/10 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl animate-fade-in">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-wider mb-4">
                                Creator Operating System
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-black text-white mb-4 leading-snug">
                                Stop leaving brand deal money on the table.
                            </h3>
                            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8">
                                Most creators lose brand deals because of messy screenshots, unanswered DMs, and underpricing. Elite Influencer gives you high-credibility infrastructure to operate like a professional agency of one.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#8406f9]/20 border border-[#8406f9]/30 flex items-center justify-center text-[#8406f9] shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-base">badge</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-white">Live Verified Media Kit</h4>
                                        <p className="text-xs sm:text-sm text-white/50">Your own aesthetic URL (`eliteinfluencer.in/yourname`) with rates, niche, city, and verified engagement.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#8406f9]/20 border border-[#8406f9]/30 flex items-center justify-center text-[#8406f9] shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-base">calculate</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-white">CreatorCalc Rate Intelligence</h4>
                                        <p className="text-xs sm:text-sm text-white/50">Calculate exactly what you should charge brands per Reel, Story, and dedicated video using real Indian CPM benchmarks.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#8406f9]/20 border border-[#8406f9]/30 flex items-center justify-center text-[#8406f9] shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-base">handshake</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-white">Collab Finder Networking</h4>
                                        <p className="text-xs sm:text-sm text-white/50">Discover creators in your city for joint Reels, podcasts, and co-promotions to grow audiences together.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#8406f9]/20 border border-[#8406f9]/30 flex items-center justify-center text-[#8406f9] shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-base">auto_awesome</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-white">AI Brand Pitch Engine</h4>
                                        <p className="text-xs sm:text-sm text-white/50">Generate bespoke brand outreach emails with Gemini AI that actually get opened and answered by PR teams.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 flex-wrap">
                                <Link
                                    href="/dashboard"
                                    className="px-8 py-3.5 rounded-full bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold text-sm transition-all shadow-[0_0_25px_rgba(132,6,249,0.35)] cursor-pointer"
                                >
                                    Build Free Media Kit
                                </Link>
                                <Link
                                    href="/creator-calc"
                                    className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-colors"
                                >
                                    Calculate My Rates
                                </Link>
                            </div>
                        </div>

                        {/* Visual Proof Box */}
                        <div className="bg-[#141418] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                            <div className="text-xs font-mono text-[#8406f9] uppercase tracking-wider mb-2">
                                {'// CREATOR BENEFIT METRICS'}
                            </div>
                            <h4 className="text-xl font-black text-white mb-6">Why Creators Switch to Elite Influencer</h4>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                                    <p className="text-2xl sm:text-3xl font-black text-white">3.4x</p>
                                    <p className="text-xs text-white/50">Higher brand response rate with an interactive media kit vs raw PDF</p>
                                </div>
                                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                                    <p className="text-2xl sm:text-3xl font-black text-white">0%</p>
                                    <p className="text-xs text-white/50">Commission taken from your deals — you keep 100% of your earnings</p>
                                </div>
                                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                                    <p className="text-2xl sm:text-3xl font-black text-[#8406f9]">60s</p>
                                    <p className="text-xs text-white/50">Average setup time to launch your verified portfolio</p>
                                </div>
                                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                                    <p className="text-2xl sm:text-3xl font-black text-green-400">100%</p>
                                    <p className="text-xs text-white/50">Free forever for rising creators across India</p>
                                </div>
                            </div>

                            <div className="bg-[#8406f9]/10 border border-[#8406f9]/20 rounded-xl p-4 flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#8406f9] text-xl">tips_and_updates</span>
                                <p className="text-xs text-white/70">
                                    Put your link <span className="text-white font-mono font-bold">eliteinfluencer.in/yourname</span> in your Instagram bio to let brands hire you directly!
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Panel: Brands & Agencies */}
                {activeTab === 'brands' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#0d0d10] border border-white/10 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl animate-fade-in">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-wider mb-4">
                                Brand & Agency Fast-Track
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-black text-white mb-4 leading-snug">
                                Hire authentic Indian creators without the agency bloat.
                            </h3>
                            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8">
                                Sourcing creators on Instagram DMs is slow, disorganized, and full of inflated metrics. Elite Influencer gives brands a curated directory of verified creators with transparent market rate cards.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-base">verified</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-white">Vetted Metrics & Real Engagement</h4>
                                        <p className="text-xs sm:text-sm text-white/50">Every creator profile contains verified views, engagement ratios, and demographic targets — no fake follower traps.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-base">price_change</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-white">Zero Hidden Agency Markups</h4>
                                        <p className="text-xs sm:text-sm text-white/50">See direct creator rates based on real market CPM benchmarks. Pay for real content, not inflated middleman margins.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-base">location_city</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-white">Hyper-Local City & Niche Sourcing</h4>
                                        <p className="text-xs sm:text-sm text-white/50">Target creators in Delhi NCR, Mumbai, Bangalore, Pune, and Hyderabad across Tech, Fashion, Fitness, and Food.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-base">send_time_extension</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-white">24-Hour Campaign Shortlist</h4>
                                        <p className="text-xs sm:text-sm text-white/50">Submit your brief, budget, and deliverables. Receive a tailored shortlist of 10 ready-to-work creators within 24 hours.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 flex-wrap">
                                <Link
                                    href="/for-brands"
                                    className="px-8 py-3.5 rounded-full bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold text-sm transition-all shadow-[0_0_25px_rgba(132,6,249,0.35)] cursor-pointer"
                                >
                                    Post a Campaign Brief
                                </Link>
                                <Link
                                    href="/marketplace"
                                    className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-colors"
                                >
                                    Browse Creator Directory
                                </Link>
                            </div>
                        </div>

                        {/* Visual Brand Summary Box */}
                        <div className="bg-[#141418] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                            <div className="text-xs font-mono text-pink-400 uppercase tracking-wider mb-2">
                                {'// BRAND ADVANTAGE'}
                            </div>
                            <h4 className="text-xl font-black text-white mb-6">Built for D2C Brands, Agencies & Founders</h4>

                            <div className="space-y-4 mb-6">
                                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-white">Turnaround Time</p>
                                        <p className="text-xs text-white/50">Shortlist delivered to your inbox</p>
                                    </div>
                                    <span className="text-lg font-black text-green-400">&lt; 24 Hours</span>
                                </div>

                                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-white">Creator Niches Covered</p>
                                        <p className="text-xs text-white/50">Tech, Fashion, Fitness, Finance, Food, Travel</p>
                                    </div>
                                    <span className="text-lg font-black text-[#8406f9]">8+ Niches</span>
                                </div>

                                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-white">Campaign Coordination</p>
                                        <p className="text-xs text-white/50">Direct WhatsApp & email contacts</p>
                                    </div>
                                    <span className="text-lg font-black text-white">Instant Contact</span>
                                </div>
                            </div>

                            <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4 flex items-center gap-3">
                                <span className="material-symbols-outlined text-pink-400 text-xl">contact_support</span>
                                <p className="text-xs text-white/70">
                                    Need a dedicated casting manager for a multi-city campaign? <Link href="/for-brands" className="text-white underline font-semibold">Contact our brand team</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
