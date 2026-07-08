"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "@/components/Toast";

const BUDGET_OPTIONS = [
    "Under ₹25,000",
    "₹25,000 – ₹1,00,000",
    "₹1,00,000 – ₹5,00,000",
    "₹5,00,000+",
    "Not sure yet",
];

const GOAL_OPTIONS = [
    "Instagram Reels campaign",
    "Multi-creator campaign",
    "Long-term brand ambassador",
    "UGC content for our ads",
    "Product launch / event coverage",
    "Something else",
];

export default function BrandLeadForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        brand_name: "",
        contact_name: "",
        work_email: "",
        phone: "",
        website: "",
        budget_range: "",
        campaign_goal: "",
        target_niche: "",
        message: "",
        // Honeypot — hidden from humans; bots that fill it get dropped silently
        confirm_fax: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.work_email)) {
            toast("Please enter a valid work email.", "error");
            return;
        }

        // Bot filled the invisible field — pretend success, save nothing
        if (formData.confirm_fax) {
            setSubmitted(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const { confirm_fax: _hp, ...lead } = formData;
            void _hp;
            const { error } = await supabase.from("brand_leads").insert([lead]);
            if (error) throw error;
            setSubmitted(true);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            toast("Error submitting: " + message, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-14">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl">check</span>
                </div>
                <h3 className="text-2xl font-black mb-2">Request Received!</h3>
                <p className="text-white/60 max-w-sm mx-auto">
                    Our team will reach out within 24 hours with creator recommendations for your campaign.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    name="brand_name"
                    suppressHydrationWarning
                    value={formData.brand_name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                    placeholder="Brand / Company Name *"
                    type="text"
                    required
                />
                <input
                    name="contact_name"
                    suppressHydrationWarning
                    value={formData.contact_name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                    placeholder="Your Name *"
                    type="text"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    name="work_email"
                    suppressHydrationWarning
                    value={formData.work_email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                    placeholder="Work Email *"
                    type="email"
                    required
                />
                <input
                    name="phone"
                    suppressHydrationWarning
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                    placeholder="Phone / WhatsApp (optional)"
                    type="tel"
                />
            </div>

            <input
                name="website"
                suppressHydrationWarning
                value={formData.website}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                placeholder="Website or Instagram (optional)"
                type="text"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                    name="budget_range"
                    suppressHydrationWarning
                    value={formData.budget_range}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors appearance-none cursor-pointer"
                    required
                >
                    <option value="" disabled className="bg-[#111]">Campaign Budget *</option>
                    {BUDGET_OPTIONS.map((b) => (
                        <option key={b} value={b} className="bg-[#111]">{b}</option>
                    ))}
                </select>
                <select
                    name="campaign_goal"
                    suppressHydrationWarning
                    value={formData.campaign_goal}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors appearance-none cursor-pointer"
                    required
                >
                    <option value="" disabled className="bg-[#111]">What do you need? *</option>
                    {GOAL_OPTIONS.map((g) => (
                        <option key={g} value={g} className="bg-[#111]">{g}</option>
                    ))}
                </select>
            </div>

            <input
                name="target_niche"
                suppressHydrationWarning
                value={formData.target_niche}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                placeholder="Target niche / audience (e.g. Fashion, Tech, Food)"
                type="text"
            />

            <textarea
                name="message"
                suppressHydrationWarning
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors resize-none"
                placeholder="Tell us about your campaign (optional)"
            />

            {/* Honeypot field — invisible to humans */}
            <input
                name="confirm_fax"
                value={formData.confirm_fax}
                onChange={handleChange}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute opacity-0 h-0 w-0 pointer-events-none"
            />

            <button
                type="submit"
                suppressHydrationWarning
                disabled={isSubmitting}
                className="w-full bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold py-4 rounded-xl mt-2 disabled:opacity-50 transition-all shadow-[0_4px_20px_rgba(132,6,249,0.3)] hover:translate-y-[-2px]"
            >
                {isSubmitting ? "Sending..." : "Get Creator Recommendations"}
            </button>
            <p className="text-white/30 text-xs text-center">
                No spam, no obligations. We reply within 24 hours.
            </p>
        </form>
    );
}
