'use client';

import Link from 'next/link';

interface HeroShowcaseProps {
    isLoggedIn: boolean;
}

export default function HeroShowcase({ isLoggedIn }: HeroShowcaseProps) {
    return (
        <section className="relative pt-12 pb-20 md:pt-16 md:pb-32 overflow-hidden">
            {/* Ambient Lighting & Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#8406f9]/25 via-pink-600/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />
            <div className="absolute top-1/3 -left-48 w-96 h-96 bg-[#8406f9]/15 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="absolute top-1/4 -right-48 w-96 h-96 bg-pink-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            {/* Subtle Tech Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Badge */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-white/90 text-xs font-semibold tracking-wide backdrop-blur-xl shadow-[0_0_20px_rgba(132,6,249,0.15)] hover:border-[#8406f9]/40 transition-all duration-300">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8406f9] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8406f9]"></span>
                        </span>
                        <span className="text-white/80">India&apos;s Premier Creator Operating System</span>
                        <span className="text-white/30">•</span>
                        <span className="text-[#8406f9] font-bold">Zero Commission</span>
                    </div>
                </div>

                {/* Hero Headline */}
                <div className="text-center max-w-4xl mx-auto mb-10">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.06] mb-6 text-white">
                        THE ECOSYSTEM FOR{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-[#8406f9] drop-shadow-[0_0_35px_rgba(132,6,249,0.35)]">
                            ELITE CREATORS
                        </span>{' '}
                        & BRANDS
                    </h1>
                    <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-normal">
                        Turn your influence into a high-growth business. Build a media kit brands trust, calculate fair market pricing, find local collabs, and unlock direct paid campaigns — without agency cuts.
                    </p>
                </div>

                {/* CTA Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 max-w-md mx-auto sm:max-w-none">
                    <Link
                        href={isLoggedIn ? "/dashboard" : "/login"}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold text-base transition-all duration-300 shadow-[0_0_30px_rgba(132,6,249,0.35)] hover:shadow-[0_0_50px_rgba(132,6,249,0.55)] hover:-translate-y-0.5 cursor-pointer group"
                    >
                        <span>{isLoggedIn ? "Open My Dashboard" : "Build Your Media Kit — Free"}</span>
                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                            arrow_forward
                        </span>
                    </Link>

                    <Link
                        href="/marketplace"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/[0.05] hover:bg-white/[0.09] text-white font-semibold text-base border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer backdrop-blur-md"
                    >
                        <span className="material-symbols-outlined text-[#8406f9] text-lg">
                            campaign
                        </span>
                        <span>Explore Marketplace</span>
                    </Link>
                </div>

                {/* Micro Guarantee */}
                <div className="flex items-center justify-center gap-6 text-xs text-white/40 font-medium mb-16">
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-green-400">check_circle</span>
                        100% Free Creator Tools
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-green-400">check_circle</span>
                        Verified Rate Cards
                    </span>
                    <span className="hidden sm:flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-green-400">check_circle</span>
                        Direct Brand Inquiries
                    </span>
                </div>

                {/* 3D Visual Centerpiece: Floating Creator Media Kit & Deal Showcase */}
                <div className="relative max-w-4xl mx-auto pt-4">
                    {/* Glowing platform bed */}
                    <div className="absolute inset-x-12 bottom-0 h-40 bg-gradient-to-t from-[#8406f9]/20 to-transparent blur-3xl pointer-events-none" />

                    {/* Main Showcase Card */}
                    <div className="relative bg-[#0d0d0e]/90 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden">
                        {/* Internal corner accent lighting */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#8406f9]/15 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

                        {/* Top bar mockup */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                <span className="ml-3 text-xs text-white/40 font-mono hidden sm:inline">
                                    eliteinfluencer.in/aaravtech
                                </span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8406f9]/20 border border-[#8406f9]/40 text-[#8406f9] text-[11px] font-bold uppercase tracking-wider">
                                <span className="material-symbols-outlined text-xs">verified</span>
                                Verified Media Kit
                            </div>
                        </div>

                        {/* Creator Profile Overview */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#8406f9] to-pink-500 p-0.5 shadow-[0_0_20px_rgba(132,6,249,0.3)]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                                        alt="Aarav Sharma"
                                        className="w-full h-full rounded-[14px] object-cover"
                                    />
                                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#0d0d0e] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[10px] text-black font-bold">done</span>
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl sm:text-2xl font-black text-white">Aarav Sharma</h3>
                                        <span className="material-symbols-outlined text-[#8406f9] text-base" title="Elite Verified">
                                            verified
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-white/50 mb-1">
                                        Tech & AI Creator • Keynotes • App Reviews
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-[#8406f9] font-semibold">@aaravtech</span>
                                        <span className="text-white/20">•</span>
                                        <span className="text-xs text-white/40">Delhi NCR, India</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href="/aaravtech"
                                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                                >
                                    View Full Kit
                                </Link>
                                <Link
                                    href="/collabs"
                                    className="px-5 py-2.5 rounded-xl bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#8406f9]/25"
                                >
                                    Request Collab
                                </Link>
                            </div>
                        </div>

                        {/* Live Metric Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                                <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-1">Total Reach</p>
                                <p className="text-xl sm:text-2xl font-black text-white">128.4K</p>
                                <span className="text-[10px] text-green-400 font-medium">↑ +8.2% this mo</span>
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                                <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-1">Eng. Rate</p>
                                <p className="text-xl sm:text-2xl font-black text-white">5.4%</p>
                                <span className="text-[10px] text-purple-400 font-medium">2.3x Industry Avg</span>
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                                <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-1">Avg Reel Views</p>
                                <p className="text-xl sm:text-2xl font-black text-white">92.5K</p>
                                <span className="text-[10px] text-blue-400 font-medium">Consistent reach</span>
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                                <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-1">Starting Rate</p>
                                <p className="text-xl sm:text-2xl font-black text-[#8406f9]">₹35,000</p>
                                <span className="text-[10px] text-white/40 font-medium">Per 60s Reel</span>
                            </div>
                        </div>

                        {/* Recent Brands Vetted Bar */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-white/40 flex-wrap gap-2">
                            <span>Past Campaigns: Nothing Tech, Sennheiser, Zerodha, NordVPN</span>
                            <span className="text-green-400 font-semibold flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                Available for Q3 Campaigns
                            </span>
                        </div>
                    </div>

                    {/* Floating Chip 1: New Collab Request */}
                    <div className="hidden lg:flex items-center gap-3 absolute -top-4 -left-10 bg-[#121214]/95 border border-[#8406f9]/40 rounded-2xl px-4 py-3 shadow-[0_15px_35px_rgba(0,0,0,0.7)] backdrop-blur-xl animate-float">
                        <div className="w-9 h-9 rounded-xl bg-[#8406f9]/20 border border-[#8406f9]/30 flex items-center justify-center text-[#8406f9]">
                            <span className="material-symbols-outlined text-lg">handshake</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white">New Collab Request</p>
                            <p className="text-[11px] text-white/50">Joint AI Reel in Mumbai with @styledbyrhea</p>
                        </div>
                    </div>

                    {/* Floating Chip 2: Live Brand Deal Notification */}
                    <div className="hidden lg:flex items-center gap-3 absolute -bottom-6 -right-8 bg-[#121214]/95 border border-emerald-500/40 rounded-2xl px-4 py-3 shadow-[0_15px_35px_rgba(0,0,0,0.7)] backdrop-blur-xl animate-float" style={{ animationDelay: '2s' }}>
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <span className="material-symbols-outlined text-lg">payments</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-emerald-400">Paid Campaign Offer: ₹45,000</p>
                            <p className="text-[11px] text-white/50">AudioTech India • Dedicated Reel + 2 Stories</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
