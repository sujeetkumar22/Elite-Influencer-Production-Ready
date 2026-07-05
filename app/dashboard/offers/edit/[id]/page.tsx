"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";

export default function EditOfferPage() {
    const router = useRouter();
    const params = useParams();
    const offerId = params.id as string;

    const [brandName, setBrandName] = useState("");
    const [budget, setBudget] = useState("");
    const [niche, setNiche] = useState("");
    const [requirements, setRequirements] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [followerRangeType, setFollowerRangeType] = useState("< 1K");
    const [customFollowerRange, setCustomFollowerRange] = useState("");
    const [applyLink, setApplyLink] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOffer = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            const { data, error: fetchError } = await supabase
                .from("brand_offers")
                .select("*")
                .eq("id", offerId)
                .eq("admin_id", user.id)
                .single();

            if (fetchError || !data) {
                setError("Offer not found or you don't have permission to edit it.");
                setLoading(false);
                return;
            }

            setBrandName(data.brand_name || "");
            setBudget(data.budget || "");
            setNiche(data.niche || "");
            setRequirements(data.requirements || "");
            setLogoUrl(data.logo_url || "");
            
            const fr = data.follower_range || "";
            const standardOptions = ["< 1K", "1K - 5K", "5K - 10K", "10K - 100K", "100K+"];
            if (fr && !standardOptions.includes(fr)) {
                setFollowerRangeType("Custom");
                setCustomFollowerRange(fr);
            } else {
                setFollowerRangeType(fr || "< 1K");
            }
            setApplyLink(data.apply_link || "");

            setLoading(false);
        };

        fetchOffer();
    }, [offerId, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            setError("Authentication error. Please log in.");
            setSaving(false);
            return;
        }

        const finalFollowerRange = followerRangeType === "Custom" ? customFollowerRange : followerRangeType;

        const { error: updateError } = await supabase
            .from("brand_offers")
            .update({
                brand_name: brandName,
                budget,
                niche,
                follower_range: finalFollowerRange,
                apply_link: applyLink,
                requirements,
                logo_url: logoUrl || null,
            })
            .eq("id", offerId)
            .eq("admin_id", user.id);

        if (updateError) {
            console.error(updateError);
            setError("Failed to update the brand offer: " + updateError.message);
            setSaving(false);
            return;
        }

        router.push("/dashboard/offers");
        router.refresh();
    };

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading offer details...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Edit Brand Deal</h1>
                    <Link href="/dashboard/offers" className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold">
                        Back to List
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {!error && (
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">Follower Range</label>
                                <select
                                    value={followerRangeType}
                                    onChange={(e) => setFollowerRangeType(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all mb-2"
                                >
                                    <option value="< 1K">&lt; 1K Followers</option>
                                    <option value="1K - 5K">1K - 5K Followers</option>
                                    <option value="5K - 10K">5K - 10K Followers</option>
                                    <option value="10K - 100K">10K - 100K Followers</option>
                                    <option value="100K+">100K+ Followers</option>
                                    <option value="Custom">Custom Range...</option>
                                </select>
                                {followerRangeType === "Custom" && (
                                    <input
                                        type="text"
                                        required
                                        value={customFollowerRange}
                                        onChange={(e) => setCustomFollowerRange(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="e.g. 50K - 200K"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">Apply Link (Required)</label>
                                <input
                                    type="url"
                                    required
                                    value={applyLink}
                                    onChange={(e) => setApplyLink(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="e.g. https://forms.gle/..."
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
                            disabled={saving}
                            className="w-full bg-gradient-to-r from-[#8406f9] to-pink-500 hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(132,6,249,0.3)] disabled:opacity-50"
                        >
                            {saving ? "Saving Changes..." : "Save Changes ✨"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
