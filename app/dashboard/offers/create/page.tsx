"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";

export default function CreateOfferPage() {
    const router = useRouter();
    const [brandName, setBrandName] = useState("");
    const [budget, setBudget] = useState("");
    const [niche, setNiche] = useState("");
    const [requirements, setRequirements] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Get current user to use as admin_id
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            setError("Authentication error. Please log in.");
            setLoading(false);
            return;
        }

        const { error: insertError } = await supabase.from("brand_offers").insert({
            brand_name: brandName,
            budget,
            niche,
            requirements,
            logo_url: logoUrl || null,
            admin_id: user.id,
            is_active: true // Auto-publish
        });

        if (insertError) {
            console.error(insertError);
            setError("Failed to create the brand offer: " + insertError.message);
            setLoading(false);
            return;
        }

        router.push("/dashboard/offers");
        router.refresh(); // Refresh offers list
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Add Brand Deal Offer</h1>
                    <Link href="/dashboard/offers" className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold">
                        Back to List
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 bg-[#111] border border-white/5 p-6 rounded-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Brand Name</label>
                            <input
                                type="text"
                                required
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="e.g. Nike"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Niche Category</label>
                            <input
                                type="text"
                                required
                                value={niche}
                                onChange={(e) => setNiche(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="e.g. Fitness, Tech, Fashion"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Budget / Payout</label>
                            <input
                                type="text"
                                required
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="e.g. $500 - $1,500 or Product Only"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Logo URL (Optional)</label>
                            <input
                                type="url"
                                value={logoUrl}
                                onChange={(e) => setLogoUrl(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="e.g. https://example.com/logo.jpg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Requirements & Details</label>
                        <textarea
                            required
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                            rows={8}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-y"
                            placeholder="Detail what the influencer must do, minimum follower requirements, deliverable formats, etc..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#8406f9] to-pink-500 hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(132,6,249,0.3)] disabled:opacity-50"
                    >
                        {loading ? "Publishing Offer..." : "Publish Brand Deal ✨"}
                    </button>
                </form>
            </div>
        </div>
    );
}
