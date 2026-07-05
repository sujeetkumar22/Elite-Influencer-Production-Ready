"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { toast } from "@/components/Toast";

interface BrandOffer {
    id: string;
    brand_name: string;
    budget: string;
    niche: string;
    requirements: string;
    is_active: boolean;
    created_at: string;
}

export default function ManageOffersPage() {
    const router = useRouter();
    const [offers, setOffers] = useState<BrandOffer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserAndFetchOffers = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            const { data, error } = await supabase
                .from("brand_offers")
                .select("*")
                .eq("admin_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching offers:", error.message);
            } else if (data) {
                setOffers(data);
            }
            setLoading(false);
        };

        checkUserAndFetchOffers();
    }, [router]);

    const toggleActive = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from("brand_offers")
            .update({ is_active: !currentStatus })
            .eq("id", id);

        if (error) {
            toast("Error updating status: " + error.message, "error");
        } else {
            setOffers((prev) =>
                prev.map((o) => (o.id === id ? { ...o, is_active: !currentStatus } : o))
            );
        }
    };

    const deleteOffer = async (id: string) => {
        if (!confirm("Are you sure you want to delete this offer?")) return;

        const { error } = await supabase.from("brand_offers").delete().eq("id", id);

        if (error) {
            toast("Error deleting offer: " + error.message, "error");
        } else {
            setOffers((prev) => prev.filter((o) => o.id !== id));
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading marketplace dashboard...</div>;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white">Manage Brand Deals</h1>
                        <p className="text-white/50 text-sm">Control the deals visible in the creator marketplace.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/dashboard" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                            Back to Profile
                        </Link>
                        <Link href="/dashboard/offers/create" className="bg-[#8406f9] hover:bg-[#8406f9]/80 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                            Add Brand Offer
                        </Link>
                    </div>
                </div>

                {/* Offer List */}
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8">
                    {offers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-widest">
                                        <th className="py-4">Brand</th>
                                        <th className="py-4">Niche</th>
                                        <th className="py-4">Budget</th>
                                        <th className="py-4">Status</th>
                                        <th className="py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {offers.map((offer) => (
                                        <tr key={offer.id} className="text-sm">
                                            <td className="py-4 font-bold text-white">{offer.brand_name}</td>
                                            <td className="py-4">
                                                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white/60">
                                                    {offer.niche}
                                                </span>
                                            </td>
                                            <td className="py-4 text-[#8406f9] font-bold">{offer.budget}</td>
                                            <td className="py-4">
                                                <button
                                                    onClick={() => toggleActive(offer.id, offer.is_active)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                                        offer.is_active
                                                            ? "bg-green-500/10 text-green-500 border border-green-500/30"
                                                            : "bg-red-500/10 text-red-500 border border-red-500/30"
                                                    }`}
                                                >
                                                    {offer.is_active ? "Active" : "Inactive"}
                                                </button>
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end items-center gap-4">
                                                    <Link
                                                        href={`/dashboard/offers/edit/${offer.id}`}
                                                        className="text-blue-500 hover:text-blue-400 font-bold transition-colors text-xs"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteOffer(offer.id)}
                                                        className="text-red-500 hover:text-red-400 font-bold transition-colors text-xs"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16 text-white/30">
                            <span className="material-symbols-outlined text-5xl mb-4 block">drafts</span>
                            <p>No brand deals added yet. Start by clicking the &quot;Add Brand Offer&quot; button.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


