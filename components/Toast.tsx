"use client";

import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";
type ToastItem = { id: number; message: string; type: ToastType };

let nextId = 1;

/** Show a toast from anywhere: toast("Saved!", "success") */
export function toast(message: string, type: ToastType = "info") {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
        new CustomEvent("app-toast", { detail: { message, type } })
    );
}

const styles: Record<ToastType, { border: string; icon: string; iconColor: string }> = {
    success: { border: "border-green-500/30", icon: "check_circle", iconColor: "text-green-500" },
    error: { border: "border-red-500/30", icon: "error", iconColor: "text-red-500" },
    info: { border: "border-[#8406f9]/30", icon: "info", iconColor: "text-[#8406f9]" },
};

export default function Toaster() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        const onToast = (e: Event) => {
            const { message, type } = (e as CustomEvent).detail as {
                message: string;
                type: ToastType;
            };
            const id = nextId++;
            setToasts((prev) => [...prev, { id, message, type }]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 4000);
        };

        window.addEventListener("app-toast", onToast);
        return () => window.removeEventListener("app-toast", onToast);
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`flex items-center gap-3 bg-[#161616]/95 backdrop-blur-md border ${styles[t.type].border} rounded-xl px-4 py-3 shadow-2xl animate-fade-in`}
                >
                    <span className={`material-symbols-outlined text-xl ${styles[t.type].iconColor}`}>
                        {styles[t.type].icon}
                    </span>
                    <p className="text-sm font-medium text-white/90">{t.message}</p>
                </div>
            ))}
        </div>
    );
}
