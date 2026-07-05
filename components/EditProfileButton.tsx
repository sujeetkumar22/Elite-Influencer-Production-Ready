"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

/**
 * Shows an "Edit Profile" button only when the logged-in viewer owns
 * this portfolio. Checked client-side so the page itself stays cacheable
 * for everyone else.
 */
export default function EditProfileButton({ ownerId }: { ownerId: string }) {
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user && user.id === ownerId) setIsOwner(true);
        });
    }, [ownerId]);

    if (!isOwner) return null;

    return (
        <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-[#8406f9]/40 text-[#b366ff] hover:text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all"
        >
            <span className="material-symbols-outlined text-base">edit</span>
            <span className="hidden sm:inline">Edit Profile</span>
            <span className="sm:hidden">Edit</span>
        </Link>
    );
}
