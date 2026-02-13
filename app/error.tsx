'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
                <span className="material-symbols-outlined text-4xl text-red-500">warning</span>
            </div>

            <h2 className="text-3xl font-black mb-4">Something went wrong</h2>

            <p className="text-white/50 mb-8 max-w-md">
                We encountered an unexpected error. Our team has been notified.
            </p>

            <button
                onClick={() => reset()}
                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors"
            >
                Try again
            </button>
        </div>
    );
}
