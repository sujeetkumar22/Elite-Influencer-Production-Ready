"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function AuthCallback() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Handle code exchange
        const handleAuth = async () => {
            const { error } = await supabase.auth.getSession();
            if (error) {
                setError(error.message);
            } else {
                // Check if we actually have a session
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    router.push("/dashboard");
                } else {
                    // Sometimes getSession works but user is null if looking at local storage
                    // Wait for the onAuthStateChange event
                }
            }
        };

        handleAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" || session) {
                router.push("/dashboard");
            }
            if (event === "SIGNED_OUT") {
                setError("User signed out during process.");
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white p-4">
            <div className="text-center max-w-md w-full bg-[#111] p-8 rounded-2xl border border-white/10">

                {error ? (
                    <>
                        <div className="text-red-500 mb-4 text-5xl">⚠️</div>
                        <h2 className="text-xl font-bold mb-2 text-white">Login Issue</h2>
                        <p className="text-white/50 mb-6 font-mono text-sm bg-black/50 p-3 rounded">{error}</p>
                        <div className="space-y-3">
                            <button onClick={() => router.push("/login")} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                                Try Again
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 border-4 border-[#8406f9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h2 className="text-xl font-bold mb-2">Verifying...</h2>
                        <p className="text-white/50 mb-6">Finishing your secure login.</p>

                        <button onClick={() => router.push("/dashboard")} className="text-xs text-white/30 hover:text-white underline mb-8">
                            Taking too long? Click here.
                        </button>
                    </>
                )}

            </div>
        </div>
    );
}
