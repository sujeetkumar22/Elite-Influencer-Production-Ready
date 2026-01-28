"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

export default function LeadForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        instagram: "",
        phone: "",
        quote_price: "",
        niche_category: "",
        experience_level: "",
        city: "",
        followers: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('leads')
                .insert([formData]);

            if (error) throw error;
            setSubmitted(true);
        } catch (error: any) {
            alert("Error submitting: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl">check</span>
                </div>
                <h3 className="text-2xl font-black mb-2">Application Received!</h3>
                <p className="text-white/60">We will be in touch with you shortly.</p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-[#8406f9] font-bold hover:underline"
                >
                    Submit another response
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-black mb-2">Start your journey.</h2>
            <p className="text-white/50 mb-8">Join the elite network of creators.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in animate-delay-100">
                <input
                    name="name"
                    suppressHydrationWarning
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                    placeholder="Full Name"
                    type="text"
                    required
                />
                <input
                    name="email"
                    suppressHydrationWarning
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                    placeholder="Email Address"
                    type="email"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in animate-delay-200">
                <input
                    name="instagram"
                    suppressHydrationWarning
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                    placeholder="Instagram Handle (e.g. @user)"
                    type="text"
                    required
                />
                <input
                    name="followers"
                    suppressHydrationWarning
                    value={formData.followers}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                    placeholder="Follower Count (e.g. 10k)"
                    type="text"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in animate-delay-300">
                <input
                    name="phone"
                    suppressHydrationWarning
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                    placeholder="Phone / WhatsApp"
                    type="tel"
                    required
                />
                <input
                    name="city"
                    suppressHydrationWarning
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                    placeholder="City, Country"
                    type="text"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    name="niche_category"
                    suppressHydrationWarning
                    value={formData.niche_category}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                    placeholder="Niche (e.g. Fashion, Tech)"
                    type="text"
                    required
                />
                <input
                    name="experience_level"
                    suppressHydrationWarning
                    value={formData.experience_level}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                    placeholder="Experience (e.g. 2 years)"
                    type="text"
                    required
                />
            </div>

            <div>
                <input
                    name="quote_price"
                    suppressHydrationWarning
                    value={formData.quote_price}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors animate-fade-in animate-delay-300"
                    placeholder="Desire Quote/Rate (e.g. $500/post)"
                    type="text"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold py-4 rounded-xl mt-4 disabled:opacity-50 transition-all shadow-[0_4px_20px_rgba(132,6,249,0.3)] hover:translate-y-[-2px] animate-fade-in animate-delay-300"
            >
                {isSubmitting ? "Submitting Application..." : "Join the Elite Network"}
            </button>
        </form>
    );
}
