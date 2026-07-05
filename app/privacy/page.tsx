import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Privacy Policy",
    description: "How Elite Influencer collects, uses, and protects your data.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />
            <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
                <h1 className="text-4xl md:text-5xl font-black mb-4">Privacy Policy</h1>
                <p className="text-white/40 text-sm mb-12">Last updated: July 5, 2026</p>

                <div className="space-y-10 text-white/70 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Who We Are</h2>
                        <p>
                            Elite Influencer (&quot;we&quot;, &quot;us&quot;) operates eliteinfluencer.in, a platform that helps
                            content creators build portfolios, discover brand deals, and grow their personal brand.
                            For any privacy questions, contact us at{" "}
                            <a href="mailto:eliteinfluencer.in@gmail.com" className="text-[#8406f9] hover:underline">eliteinfluencer.in@gmail.com</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong className="text-white">Account data:</strong> email address and authentication details when you sign up (including via Google Sign-In).</li>
                            <li><strong className="text-white">Portfolio data:</strong> the name, photo, bio, city, social links, statistics, and work samples you choose to publish on your public portfolio page.</li>
                            <li><strong className="text-white">Application/lead data:</strong> name, email, phone number, Instagram handle, and related details you submit through our forms.</li>
                            <li><strong className="text-white">Usage data:</strong> basic technical information such as IP address and browser type, used for security and rate limiting.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To operate your account and display the portfolio you choose to publish.</li>
                            <li>To connect creators with brand collaboration opportunities.</li>
                            <li>To respond to your applications and enquiries.</li>
                            <li>To protect the platform against abuse and fraud.</li>
                        </ul>
                        <p className="mt-3">We do not sell your personal data.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Public Information</h2>
                        <p>
                            Your portfolio page (name, photo, bio, stats, work links, and contact email) is
                            intentionally public so that brands can discover and contact you. Do not add
                            information to your portfolio that you do not want publicly visible. You can edit or
                            remove it at any time from your dashboard.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Third-Party Services</h2>
                        <p>
                            We use Supabase (database, authentication, and file storage), Google (sign-in), and
                            Google Gemini (AI pitch generation — only the brand name, niche, tone, and optional
                            portfolio stats you provide are sent). Each processes data under its own privacy policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Data Retention &amp; Your Rights</h2>
                        <p>
                            We keep your data while your account is active. You may request access to, correction
                            of, or deletion of your personal data at any time by emailing{" "}
                            <a href="mailto:eliteinfluencer.in@gmail.com" className="text-[#8406f9] hover:underline">eliteinfluencer.in@gmail.com</a>.
                            We will respond within a reasonable timeframe.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Changes to This Policy</h2>
                        <p>
                            We may update this policy from time to time. Material changes will be reflected by
                            updating the date at the top of this page.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
