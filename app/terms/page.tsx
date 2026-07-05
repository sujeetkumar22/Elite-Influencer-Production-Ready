import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Terms of Service",
    description: "The terms that govern your use of Elite Influencer.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />
            <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
                <h1 className="text-4xl md:text-5xl font-black mb-4">Terms of Service</h1>
                <p className="text-white/40 text-sm mb-12">Last updated: July 5, 2026</p>

                <div className="space-y-10 text-white/70 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing eliteinfluencer.in (&quot;the Platform&quot;), you agree to these Terms of
                            Service. If you do not agree, please do not use the Platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Your Account &amp; Content</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>You must provide accurate information when creating your account and portfolio.</li>
                            <li>You are responsible for all activity under your account.</li>
                            <li>You retain ownership of the content you publish. By publishing a portfolio, you grant us a licence to display it publicly on the Platform.</li>
                            <li>Misrepresenting your statistics (followers, reach, engagement) or impersonating others is prohibited and may result in account removal.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Brand Deals &amp; Third Parties</h2>
                        <p>
                            The Platform lists brand collaboration opportunities as a discovery service. We are not
                            a party to any agreement between creators and brands, and we do not guarantee payment,
                            performance, or outcomes of any collaboration. Always verify a brand and its offer
                            before entering an agreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Acceptable Use</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>No unlawful, misleading, defamatory, or infringing content.</li>
                            <li>No scraping, automated abuse, or attempts to disrupt the Platform.</li>
                            <li>No use of the AI tools to generate spam or deceptive outreach.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. AI-Generated Content</h2>
                        <p>
                            Tools such as the AI Pitch Generator and CreatorCalc produce automated suggestions and
                            estimates. They are provided &quot;as is&quot; for guidance only — review all AI output
                            before sending it, and treat rate estimates as indicative, not guaranteed market rates.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Termination</h2>
                        <p>
                            We may suspend or remove accounts that violate these terms. You may delete your account
                            and data at any time by contacting us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Limitation of Liability</h2>
                        <p>
                            The Platform is provided &quot;as is&quot; without warranties of any kind. To the maximum
                            extent permitted by law, Elite Influencer is not liable for indirect or consequential
                            damages arising from your use of the Platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">8. Contact</h2>
                        <p>
                            Questions about these terms:{" "}
                            <a href="mailto:eliteinfluencer.in@gmail.com" className="text-[#8406f9] hover:underline">eliteinfluencer.in@gmail.com</a>
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
