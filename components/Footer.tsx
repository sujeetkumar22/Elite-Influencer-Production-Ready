import Link from "next/link";

const COMMUNITY_URL = "https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq";

export default function Footer() {
    return (
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
                        <a href="https://www.instagram.com/eliteinfluencer.in/" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-[#8406f9] hover:text-white transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                        </a>
                        {/* Twitter/X */}
                        <a href="#" aria-label="X (Twitter)" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-[#8406f9] hover:text-white transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </a>
                        {/* LinkedIn */}
                        <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-[#8406f9] hover:text-white transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold mb-6 text-white text-lg">Platform</h3>
                    <ul className="space-y-4 text-sm text-white/60">
                        <li><Link href="/" className="hover:text-[#8406f9] transition-colors hover:pl-1">Home</Link></li>
                        <li><Link href="/#features" className="hover:text-[#8406f9] transition-colors hover:pl-1">Features</Link></li>
                        <li><Link href="/dashboard" className="hover:text-[#8406f9] transition-colors hover:pl-1">Portfolio Maker</Link></li>
                        <li><Link href="/marketplace" className="hover:text-[#8406f9] transition-colors hover:pl-1">Marketplace</Link></li>
                        <li><Link href="/feeds" className="hover:text-[#8406f9] transition-colors hover:pl-1">Feeds</Link></li>
                        <li><a href="https://www.instagram.com/eliteinfluencer.in/" target="_blank" rel="noreferrer" className="hover:text-[#8406f9] transition-colors hover:pl-1">Instagram</a></li>
                        <li><a href={COMMUNITY_URL} target="_blank" rel="noreferrer" className="hover:text-[#8406f9] transition-colors hover:pl-1">Community</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold mb-6 text-white text-lg">Legal & Support</h3>
                    <ul className="space-y-4 text-sm text-white/60">
                        <li><Link href="/privacy" className="hover:text-[#8406f9] transition-colors hover:pl-1">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-[#8406f9] transition-colors hover:pl-1">Terms of Service</Link></li>
                        <li><a href="mailto:eliteinfluencer.in@gmail.com" className="hover:text-[#8406f9] transition-colors hover:pl-1">eliteinfluencer.in@gmail.com</a></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/5 pt-8 text-center text-white/20 text-xs">
                © {new Date().getFullYear()} Elite Influencer Network. All rights reserved.
            </div>
        </footer>
    );
}
