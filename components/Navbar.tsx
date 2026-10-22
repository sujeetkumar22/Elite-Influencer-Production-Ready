"use client";

import { useState } from "react";
import Link from "next/link";

const COMMUNITY_URL = "https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq";

const primaryLinks = [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "For Brands", href: "/for-brands" },
    { label: "Events", href: "/events" },
];

const toolLinks = [
    { label: "Portfolio Maker", href: "/dashboard", icon: "brush" },
    { label: "CreatorCalc", href: "/creator-calc", icon: "calculate" },
    { label: "AI Label Remover", href: "https://removeailabel.eliteinfluencer.in", icon: "auto_fix_high" },
    { label: "AI Pitch", href: "/#ai-pitch", icon: "auto_awesome" },
];

const secondaryLinks = [
    { label: "Feeds", href: "/feeds" },
];

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const { supabase } = await import("@/utils/supabase/client");
            await supabase.auth.signOut();
        } catch (e) {
            console.error("Signout error:", e);
        }
        window.location.href = "/";
    };

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
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-[#25D366] transition-colors"
                        href={COMMUNITY_URL}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                        Community
                    </a>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <a
                        href={COMMUNITY_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 hover:border-[#25D366]/50 text-[#25D366] text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(37,211,102,0.25)] hover:scale-105 shrink-0"
                    >
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z"/>
                        </svg>
                        <span className="hidden sm:inline">Join WhatsApp Community</span>
                        <span className="sm:hidden">WhatsApp</span>
                    </a>
                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 md:px-5 rounded-full text-sm font-bold transition-all inline-block"
                            >
                                My Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="hidden sm:inline-block bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2.5 md:px-5 rounded-full text-sm font-bold transition-all cursor-pointer"
                            >
                                Sign Out
                            </button>
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
                        className="my-2 py-3 px-4 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-bold flex items-center justify-center gap-2 hover:bg-[#25D366]/25 transition-colors"
                    >
                        <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>Join WhatsApp Community</span>
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
                        <button
                            onClick={handleLogout}
                            className="py-3 text-left text-base font-medium text-red-500 hover:text-red-400 transition-colors border-t border-white/5 cursor-pointer w-full"
                        >
                            Sign Out
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
