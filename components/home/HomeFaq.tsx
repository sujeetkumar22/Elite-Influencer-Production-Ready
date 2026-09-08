'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const FAQS: FAQItem[] = [
    {
        question: "Is Elite Influencer really 100% free for content creators?",
        answer: "Yes, completely free. Building and hosting your media kit portfolio, calculating rates on CreatorCalc, generating brand pitches with AI, and networking on the Collab Finder cost zero rupees. We never charge creators hidden fees or take commissions from your brand deals.",
        category: "Pricing"
    },
    {
        question: "How do brands and PR agencies reach out to me?",
        answer: "When a brand manager or marketer views your portfolio (eliteinfluencer.in/yourname), they see your verified reach, past brand partners, and rate card. They can connect directly via your linked Instagram DM, business WhatsApp, or verified email with one click.",
        category: "Brand Deals"
    },
    {
        question: "How does the Creator Collab Finder work?",
        answer: "The Collab Finder board allows creators to post and discover networking opportunities by city (Delhi NCR, Mumbai, Bangalore, Pune, Hyderabad, Remote), format (Joint Reels, Podcast Guests, YouTube Collabs), and niche. Creators connect directly without intermediaries.",
        category: "Collabs"
    },
    {
        question: "How does CreatorCalc calculate sponsorship rates?",
        answer: "CreatorCalc is powered by real Indian influencer marketing market data. It calculates fair compensation based on your follower tier, engagement percentage, content format (60s Reel, Story with Link, Dedicated Video), and niche-specific CPM multipliers.",
        category: "CreatorCalc"
    },
    {
        question: "I am a brand manager or agency. How do I hire creators?",
        answer: "Brands can browse our open Creator Directory to view rate cards and verified portfolios, or submit a campaign brief on our For Brands page (/for-brands). Our team will send a curated shortlist of matched creators ready to produce content within 24 hours.",
        category: "Brands"
    },
    {
        question: "How do I put my portfolio in my Instagram or YouTube bio?",
        answer: "After creating your profile in the Dashboard, you'll receive your unique link: eliteinfluencer.in/yourusername. Simply paste this link in your Instagram bio or YouTube description. When brands click it, they see an aesthetic, professional media kit that immediately builds trust.",
        category: "Getting Started"
    }
];

export default function HomeFaq() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 md:py-32 relative overflow-hidden bg-[#050505]">
            {/* Ambient lighting */}
            <div className="absolute top-1/3 -left-48 w-96 h-96 bg-[#8406f9]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-4">
                        Got Questions?
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                        FREQUENTLY ASKED{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-[#8406f9]">
                            QUESTIONS
                        </span>
                    </h2>
                    <p className="text-white/60 text-base sm:text-lg">
                        Everything you need to know about the platform, media kits, rate intelligence, and brand collaborations.
                    </p>
                </div>

                {/* Accordion List */}
                <div className="space-y-4">
                    {FAQS.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={faq.question}
                                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                    isOpen
                                        ? 'bg-[#0e0e12] border-[#8406f9]/50 shadow-[0_10px_30px_rgba(132,6,249,0.1)]'
                                        : 'bg-[#09090b] border-white/10 hover:border-white/20'
                                }`}
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                                >
                                    <span className="text-base sm:text-lg font-bold text-white leading-snug">
                                        {faq.question}
                                    </span>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                                            isOpen
                                                ? 'bg-[#8406f9] text-white rotate-180'
                                                : 'bg-white/5 text-white/60'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            expand_more
                                        </span>
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="px-6 sm:px-7 pb-6 sm:pb-7 text-white/60 text-sm sm:text-base leading-relaxed border-t border-white/5 pt-4 animate-fade-in">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Direct question prompt */}
                <div className="mt-12 text-center text-sm text-white/50">
                    Have a question not answered here?{' '}
                    <Link href="https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq" target="_blank" className="text-[#8406f9] font-bold hover:underline">
                        Ask in our Creator WhatsApp Community
                    </Link>
                </div>
            </div>
        </section>
    );
}
