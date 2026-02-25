"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <div className="text-center max-w-md w-full bg-[#111] p-8 rounded-2xl border border-white/10 shadow-2xl">
            <div className="text-red-500 mb-6 text-6xl">⚠️</div>
            <h1 className="text-2xl font-black mb-4 uppercase">Authentication Failed</h1>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-mono break-all text-left">
                    <span className="text-xs text-white/30 uppercase font-bold block mb-1">Error Details:</span>
                    {error}
                </div>
            )}

            <p className="text-white/50 mb-8 leading-relaxed">
                We couldn't verify your login. This usually happens if the link expired or your session was interrupted.
            </p>
            <div className="space-y-4">
                <Link
                    href="/login"
                    className="block w-full bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#8406f9]/20"
                >
                    Return to Login
                </Link>
                <Link
                    href="/"
                    className="block w-full text-white/30 hover:text-white text-sm transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default function AuthError() {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white p-4">
            <Suspense fallback={<div className="text-white/50 animate-pulse font-bold">Initializing...</div>}>
                <ErrorContent />
            </Suspense>
        </div>
    );
}
