"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const COMMUNITY_URL = "https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq";

const primaryLinks = [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Events", href: "/events" },
    { label: "For Brands", href: "/for-brands" },
];

const toolLinks = [
    {
        label: "Portfolio Maker",
        href: "/dashboard",
        icon: "brush",
        desc: "Aesthetic media kit & rate card",
        badge: "Free"
    },
    {
        label: "CreatorCalc",
        href: "/creator-calc",
        icon: "calculate",
        desc: "Fair sponsor rate intelligence",
        badge: "Popular"
    },
    {
        label: "AI Label Remover",
        href: "https://removeailabel.eliteinfluencer.in",
        icon: "auto_fix_high",
        desc: "Bypass Instagram AI tags",
        badge: "Viral"
    },
    {
        label: "AI Pitch Engine",
        href: "/#ai-pitch",
        icon: "auto_awesome",
        desc: "Brand outreach emails in 5s",
        badge: "AI"
    },
];

const secondaryLinks = [
    { label: "Feeds", href: "/feeds" },
];

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 15);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-[#050505]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.7)] py-3"
                    : "bg-[#050505]/40 backdrop-blur-md border-b border-white/[0.04] py-4"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
                {/* Brand Logo */}
                <Link href="/" className="group flex items-center gap-2 shrink-0">
                    <span className="text-xl md:text-2xl font-black italic tracking-tighter text-white select-none">
                        ELITE{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8406f9] via-purple-400 to-pink-500 group-hover:from-purple-300 group-hover:to-[#8406f9] transition-all duration-300">
                            INFLUENCER
                        </span>
                    </span>
                </Link>

                {/* Center Floating Pill Navigation (Desktop) */}
                <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] p-1.5 rounded-full backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                    {primaryLinks.map((link) => {
                        const active = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                                    active
                                        ? "bg-white/10 text-white shadow-sm font-bold"
                                        : "text-white/65 hover:text-white hover:bg-white/[0.05]"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                    {/* Tools Dropdown */}
                    <div className="relative group">
                        <button
                            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                                pathname?.startsWith("/creator-calc") || pathname?.startsWith("/dashboard")
                                    ? "bg-white/10 text-white font-bold"
                                    : "text-white/65 hover:text-white hover:bg-white/[0.05]"
                            }`}
                        >
                            <span>Tools</span>
                            <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:rotate-180">
                                expand_more
                            </span>
                        </button>

                        {/* Dropdown Panel */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible">
                            <div className="w-80 bg-[#0c0c0e]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(132,6,249,0.15)] ring-1 ring-white/5">
                                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
                                    Creator Operating Tools
                                </div>
                                <div className="space-y-1">
                                    {toolLinks.map((tool) => (
                                        <Link
                                            key={tool.href}
                                            href={tool.href}
                                            className="flex items-center gap-3 p-2 rounded-xl transition-all duration-200 hover:bg-white/[0.06] group/item"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-[#8406f9]/15 border border-[#8406f9]/30 flex items-center justify-center text-[#8406f9] group-hover/item:scale-105 group-hover/item:bg-[#8406f9]/25 transition-all shrink-0">
                                                <span className="material-symbols-outlined text-base">{tool.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-bold text-white group-hover/item:text-[#8406f9] transition-colors flex items-center justify-between">
                                                    <span>{tool.label}</span>
                                                    {tool.badge && (
                                                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-[#8406f9]/20 text-[#8406f9] rounded border border-[#8406f9]/30">
                                                            {tool.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10.5px] text-white/50 truncate">
                                                    {tool.desc}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {secondaryLinks.map((link) => {
                        const active = pathname?.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                                    active
                                        ? "bg-white/10 text-white shadow-sm font-bold"
                                        : "text-white/65 hover:text-white hover:bg-white/[0.05]"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Action Section */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <a
                        href={COMMUNITY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 h-9 sm:h-10 px-3.5 sm:px-4 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 hover:border-[#25D366]/60 text-[#25D366] text-xs sm:text-sm font-bold transition-all duration-200 shadow-[0_0_15px_rgba(37,211,102,0.15)] hover:shadow-[0_0_25px_rgba(37,211,102,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z"/>
                        </svg>
                        <span className="hidden xl:inline">Join WhatsApp Community</span>
                        <span className="hidden sm:inline xl:hidden">WhatsApp</span>
                    </a>

                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-1.5 h-9 sm:h-10 px-3.5 sm:px-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span className="material-symbols-outlined text-base text-[#8406f9]">account_circle</span>
                                <span>My Profile</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="hidden sm:inline-flex items-center h-9 sm:h-10 px-3 rounded-full text-white/50 hover:text-red-400 hover:bg-red-500/10 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center h-9 sm:h-10 px-4 sm:px-6 rounded-full bg-gradient-to-r from-[#8406f9] to-[#9926ff] hover:from-[#7605e0] hover:to-[#8406f9] text-white text-xs sm:text-sm font-extrabold tracking-wide transition-all duration-200 shadow-[0_0_20px_rgba(132,6,249,0.35)] hover:shadow-[0_0_30px_rgba(132,6,249,0.55)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Join Elite
                        </Link>
                    )}

                    {/* Mobile Menu Toggle Button */}
                    <button
                        onClick={() => setOpen(!open)}
                        aria-label={open ? "Close menu" : "Open menu"}
                        className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-lg sm:text-xl">
                            {open ? "close" : "menu"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {open && (
                <div className="lg:hidden bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-white/10 px-5 py-6 flex flex-col gap-3 shadow-2xl animate-fade-in max-h-[calc(100vh-80px)] overflow-y-auto">
                    {/* VIP WhatsApp Community Card */}
                    <a
                        href={COMMUNITY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className="p-3.5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] flex items-center justify-between font-bold text-sm shadow-[0_0_20px_rgba(37,211,102,0.15)]"
                    >
                        <div className="flex items-center gap-2.5">
                            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z"/>
                            </svg>
                            <span>Join VIP WhatsApp Community</span>
                        </div>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>

                    {/* Primary Links */}
                    <div className="space-y-1">
                        {primaryLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                            >
                                <span>{link.label}</span>
                                <span className="material-symbols-outlined text-sm text-white/30">chevron_right</span>
                            </Link>
                        ))}
                        {secondaryLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                            >
                                <span>{link.label}</span>
                                <span className="material-symbols-outlined text-sm text-white/30">chevron_right</span>
                            </Link>
                        ))}
                    </div>

                    {/* Tools Section */}
                    <div className="pt-2 border-t border-white/10">
                        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            Creator Operating Tools
                        </p>
                        <div className="grid grid-cols-1 gap-1">
                            {toolLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 p-2 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[#8406f9]/15 border border-[#8406f9]/30 flex items-center justify-center text-[#8406f9]">
                                        <span className="material-symbols-outlined text-base">{link.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-white flex items-center justify-between">
                                            <span>{link.label}</span>
                                            {link.badge && (
                                                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-[#8406f9]/20 text-[#8406f9] rounded border border-[#8406f9]/30">
                                                    {link.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10.5px] text-white/50 truncate">{link.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Auth in Mobile Drawer */}
                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="mt-2 py-3 px-3 text-left text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer w-full flex items-center justify-between"
                        >
                            <span>Sign Out</span>
                            <span className="material-symbols-outlined text-sm">logout</span>
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}
