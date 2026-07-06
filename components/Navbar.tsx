"use client";

import { useState } from "react";
import Link from "next/link";

const COMMUNITY_URL = "https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq";

const primaryLinks = [
    { label: "Marketplace", href: "/marketplace" },
    { label: "Events", href: "/events" },
];

const toolLinks = [
    { label: "Portfolio Maker", href: "/dashboard", icon: "brush" },
    { label: "CreatorCalc", href: "/creator-calc", icon: "calculate" },
    { label: "AI Pitch", href: "/#ai-pitch", icon: "auto_awesome" },
];

const secondaryLinks = [
    { label: "Feeds", href: "/feeds" },
];

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
    const [open, setOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-xl md:text-2xl font-black italic tracking-tighter hover:opacity-80 transition-opacity">
                    ELITE <span className="text-[#8406f9]">INFLUENCER</span>
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    {primaryLinks.map((link) => (
                        <Link
                            key={link.href}
                            className="text-sm font-medium text-white/70 hover:text-[#8406f9] transition-colors"
                            href={link.href}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Tools dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-sm font-medium text-white/70 group-hover:text-[#8406f9] transition-colors py-2">
                            Tools
                            <span className="material-symbols-outlined text-base group-hover:rotate-180 transition-transform">expand_more</span>
                        </button>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all">
                            <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 min-w-52 shadow-2xl">
                                {toolLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-[#8406f9]/10 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg text-[#8406f9]">{link.icon}</span>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {secondaryLinks.map((link) => (
                        <Link
                            key={link.href}
                            className="text-sm font-medium text-white/70 hover:text-[#8406f9] transition-colors"
                            href={link.href}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <a
                        className="text-sm font-medium text-white/70 hover:text-[#8406f9] transition-colors"
                        href={COMMUNITY_URL}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Community
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 md:px-5 rounded-full text-sm font-bold transition-all inline-block"
                            >
                                My Profile
                            </Link>
                            <a
                                href="/auth/logout"
                                className="hidden sm:inline-block bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2.5 md:px-5 rounded-full text-sm font-bold transition-all"
                            >
                                Sign Out
                            </a>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-[#8406f9] hover:bg-[#8406f9]/80 text-white px-5 py-2.5 md:px-6 rounded-full text-sm font-bold transition-all shadow-lg shadow-[#8406f9]/20 inline-block"
                        >
                            Join Elite
                        </Link>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setOpen(!open)}
                        aria-label={open ? "Close menu" : "Open menu"}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white"
                    >
                        <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex flex-col gap-1 animate-fade-in">
                    {primaryLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="py-3 text-base font-medium text-white/80 hover:text-[#8406f9] transition-colors border-b border-white/5"
                        >
                            {link.label}
                        </Link>
                    ))}
                    {secondaryLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="py-3 text-base font-medium text-white/80 hover:text-[#8406f9] transition-colors border-b border-white/5"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <a
                        href={COMMUNITY_URL}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setOpen(false)}
                        className="py-3 text-base font-medium text-white/80 hover:text-[#8406f9] transition-colors border-b border-white/5"
                    >
                        Community
                    </a>

                    <p className="pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">Tools</p>
                    {toolLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="py-3 flex items-center gap-3 text-base font-medium text-white/80 hover:text-[#8406f9] transition-colors border-b border-white/5"
                        >
                            <span className="material-symbols-outlined text-lg text-[#8406f9]">{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}

                    {isLoggedIn && (
                        <a
                            href="/auth/logout"
                            className="py-3 text-base font-medium text-red-500 hover:text-red-400 transition-colors border-t border-white/5"
                        >
                            Sign Out
                        </a>
                    )}
                </div>
            )}
        </nav>
    );
}
