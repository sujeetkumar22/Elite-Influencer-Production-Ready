"use client";

import { useState } from "react";

export default function ShareProfileButton({ name, url }: { name: string; url: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // Native share sheet on mobile, clipboard fallback on desktop
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${name} — Creator Portfolio`,
                    url,
                });
                return;
            } catch {
                // user dismissed the sheet — do nothing
                return;
            }
        }
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all text-white/80 hover:text-white"
        >
            <span className="material-symbols-outlined text-base">
                {copied ? "check" : "ios_share"}
            </span>
            {copied ? "Link Copied" : "Share"}
        </button>
    );
}
