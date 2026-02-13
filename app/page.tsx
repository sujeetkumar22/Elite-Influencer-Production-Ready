

import Link from "next/link";
import Image from "next/image";
import LeadForm from "@/components/LeadForm";

export default function Home() {
    return (
        <div className="bg-[#f7f5f8] dark:bg-[#050505] min-h-screen text-white transition-colors duration-300">

            {/* NAVIGATION */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-xl md:text-2xl font-black italic tracking-tighter hover:opacity-80 transition-opacity">
                        ELITE <span className="text-[#8406f9]">INFLUENCER</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-10">
                        <Link className="text-sm font-medium text-white/70 hover:text-[#8406f9] transition-colors" href="#features">Features</Link>
                        <a className="text-sm font-medium text-white/70 hover:text-[#8406f9] transition-colors" href="https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq" target="_blank">Community</a>
                        <Link className="text-sm font-medium text-white/70 hover:text-[#8406f9] transition-colors" href="/dashboard">Portfolio Maker</Link>
                    </div>

                    <div>
                        <Link href="/login" className="bg-[#8406f9] hover:bg-[#8406f9]/80 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-[#8406f9]/20 inline-block">
                            Join Elite
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20">
                {/* HERO */}
                <section className="max-w-5xl mx-auto px-6 text-center mb-24 pt-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8406f9] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8406f9]"></span>
                        </span>
                        Now Open: Creator Onboarding
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-gradient animate-fade-in animate-delay-100">
                        BUILD YOUR <br />CREATOR EMPIRE
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 mb-10 leading-relaxed animate-fade-in animate-delay-200">
                        Access exclusive high-ticket brand deals, professional portfolio tools, and a global network of top-tier influencers scaling to 7-figures.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animate-delay-300">
                        <Link href="/creator-calc" className="w-full sm:w-auto px-10 py-4 bg-[#8406f9] rounded-full font-bold text-lg hover:bg-[#8406f9]/90 transition-all transform hover:scale-105 text-center shadow-[0_0_20px_rgba(132,6,249,0.3)] hover:shadow-[0_0_40px_rgba(132,6,249,0.5)]">
                            CreatorCalc
                        </Link>
                        <a href="https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq" target="_blank" className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-all text-center hover:scale-105">
                            Join Community
                        </a>
                    </div>
                </section>

                {/* FEATURES */}
                <section id="features" className="max-w-7xl mx-auto px-6 mb-24">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="group p-8 rounded-lg bg-white/5 border border-white/10 hover:border-[#8406f9]/50 transition-all relative overflow-hidden hover:bg-white/10 hover:-translate-y-1 duration-300 animate-fade-in animate-delay-100">
                            <div className="absolute top-3 right-3 bg-[#8406f9]/20 text-[#8406f9] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Coming Soon</div>
                            <div className="w-12 h-12 rounded-full bg-[#8406f9]/20 flex items-center justify-center text-[#8406f9] mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-2xl">campaign</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Brand Deals</h3>
                            <p className="text-white/50 mb-6">Unlock high-ticket partnerships with global luxury brands.</p>
                            <div className="flex items-center gap-2 text-white/30 font-bold text-sm cursor-not-allowed">
                                View Marketplace <span className="material-symbols-outlined text-sm">lock</span>
                            </div>
                        </div>

                        <div className="group p-8 rounded-lg bg-white/5 border border-white/10 hover:border-[#8406f9]/50 transition-all relative overflow-hidden hover:bg-white/10 hover:-translate-y-1 duration-300 animate-fade-in animate-delay-200">
                            <div className="w-12 h-12 rounded-full bg-[#8406f9]/20 flex items-center justify-center text-[#8406f9] mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-2xl">brush</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Portfolio Builder</h3>
                            <p className="text-white/50 mb-6">Build your professional presence in minutes.</p>
                            <Link href="/dashboard" className="flex items-center gap-2 text-[#8406f9] font-bold text-sm hover:text-[#8406f9]/80 transition-colors group-hover:gap-3">
                                Build Portfolio <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>

                        <div className="group p-8 rounded-lg bg-white/5 border border-white/10 hover:border-[#8406f9]/50 transition-all relative overflow-hidden hover:bg-white/10 hover:-translate-y-1 duration-300 animate-fade-in animate-delay-300">
                            <div className="absolute top-3 right-3 bg-[#8406f9]/20 text-[#8406f9] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Coming Soon</div>
                            <div className="w-12 h-12 rounded-full bg-[#8406f9]/20 flex items-center justify-center text-[#8406f9] mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-2xl">event</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Events</h3>
                            <p className="text-white/50 mb-6">Find content worthy events near you.</p>
                            <div className="flex items-center gap-2 text-white/30 font-bold text-sm cursor-not-allowed">
                                View Events <span className="material-symbols-outlined text-sm">lock</span>
                            </div>
                        </div>
                    </div>
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

            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-[#0a0a0a] pt-20 pb-10 mt-20">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6 text-xl md:text-2xl font-black italic tracking-tighter hover:opacity-80 transition-opacity">
                            ELITE <span className="text-[#8406f9]">INFLUENCER</span>
                        </Link>
                        <p className="text-white/50 max-w-sm mb-8 leading-relaxed">
                            The premier ecosystem for top-tier creators to scale their personal brand, secure high-ticket deals, and network with the 1%.
                        </p>
                        <div className="flex gap-4">
                            {/* Instagram */}
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-[#8406f9] hover:text-white transition-all">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                            {/* Twitter/X */}
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-[#8406f9] hover:text-white transition-all">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                            {/* LinkedIn */}
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-[#8406f9] hover:text-white transition-all">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold mb-6 text-white text-lg">Platform</h3>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li><Link href="/" className="hover:text-[#8406f9] transition-colors hover:pl-1">Home</Link></li>
                            <li><Link href="#features" className="hover:text-[#8406f9] transition-colors hover:pl-1">Features</Link></li>
                            <li><Link href="/dashboard" className="hover:text-[#8406f9] transition-colors hover:pl-1">Portfolio Maker</Link></li>
                            <li><a href="https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq" target="_blank" className="hover:text-[#8406f9] transition-colors hover:pl-1">Community</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-6 text-white text-lg">Legal & Support</h3>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li><Link href="#" className="hover:text-[#8406f9] transition-colors hover:pl-1">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-[#8406f9] transition-colors hover:pl-1">Terms of Service</Link></li>
                            <li><a href="mailto:support@eliteinfluencer.com" className="hover:text-[#8406f9] transition-colors hover:pl-1">support@eliteinfluencer.com</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-white/20 text-xs">
                    © 2026 Elite Influencer Network. All rights reserved.
                </div>
            </footer>
        </div>
    );
}