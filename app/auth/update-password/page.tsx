"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/components/Toast";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 8) {
            toast("Password must be at least 8 characters.", "error");
            return;
        }
        if (password !== confirm) {
            toast("Passwords do not match.", "error");
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });
        setLoading(false);

        if (error) {
            toast(error.message, "error");
        } else {
            toast("Password updated! You are logged in.", "success");
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-black italic tracking-tighter hover:opacity-80 transition-opacity inline-block">
                        ELITE <span className="text-[#8406f9]">INFLUENCER</span>
                    </Link>
                    <p className="text-white/50 text-sm mt-2">Set your new password</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-white/40 mb-1">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-white/40 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#8406f9]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
