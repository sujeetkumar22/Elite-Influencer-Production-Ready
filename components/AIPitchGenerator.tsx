"use client";

import { useState } from "react";

export default function AIPitchGenerator() {
    const [brandName, setBrandName] = useState("");
    const [niche, setNiche] = useState("");
    const [tone, setTone] = useState("Professional");
    const [generating, setGenerating] = useState(false);
    const [pitch, setPitch] = useState("");
    const [copied, setCopied] = useState(false);

    const generatePitch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brandName || !niche) return;

        setGenerating(true);
        setPitch("");
        setCopied(false);

        try {
            const response = await fetch("/api/generate-pitch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ brandName, niche, tone }),
            });

            const data = await response.json();

            if (response.ok) {
                setPitch(data.text);
            } else {
                setPitch(`Error: ${data.error || "Failed to generate pitch"}`);
            }
        } catch (err) {
            setPitch("Error connecting to the AI service.");
        } finally {
            setGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!pitch) return;
        navigator.clipboard.writeText(pitch);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-5xl mx-auto bg-[#111111] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8406f9] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
            
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#8406f9]/20 text-[#8406f9] mb-4">
                    <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-4">
                    AI Pitch <span className="text-[#8406f9]">Generator</span>
                </h2>
                <p className="text-white/60">Generate a highly personalized, ready-to-send brand pitch in seconds.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Form */}
                <form onSubmit={generatePitch} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Target Brand Name</label>
                        <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            placeholder="e.g. Nike, Sephora, Gymshark"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Your Niche</label>
                        <input
                            type="text"
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            placeholder="e.g. Tech, Fitness, Travel"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Tone of Voice</label>
                        <div className="relative">
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8406f9] transition-colors appearance-none cursor-pointer"
                            >
                                <option value="Professional" className="bg-[#111]">Professional & Direct</option>
                                <option value="Bold" className="bg-[#111]">Bold & Confident</option>
                                <option value="Witty" className="bg-[#111]">Witty & Conversational</option>
                                <option value="Casual" className="bg-[#111]">Casual & Friendly</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={generating}
                        className="w-full bg-[#8406f9] hover:bg-[#8406f9]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(132,6,249,0.3)] flex items-center justify-center gap-2 group"
                    >
                        {generating ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                Generating Magic...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">magic_button</span>
                                Generate AI Pitch
                            </>
                        )}
                    </button>
                </form>

                {/* Output Area */}
                <div className="relative flex flex-col h-full min-h-[300px] z-10">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#8406f9] mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span> Result
                    </label>
                    <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative group overflow-hidden">
                        {generating ? (
                            <div className="h-full flex flex-col space-y-4 animate-pulse">
                                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                <div className="h-4 bg-white/10 rounded w-full"></div>
                                <div className="h-4 bg-white/10 rounded w-5/6"></div>
                                <div className="h-4 bg-white/10 rounded w-1/2"></div>
                            </div>
                        ) : pitch ? (
                            <div className="h-full flex flex-col">
                                <textarea
                                    readOnly
                                    value={pitch}
                                    className="w-full flex-1 bg-transparent text-white/80 text-sm leading-relaxed outline-none resize-none custom-scrollbar min-h-[200px]"
                                />
                                <button
                                    onClick={handleCopy}
                                    className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-white/20 text-center space-y-2 py-10">
                                <span className="material-symbols-outlined text-4xl">edit_note</span>
                                <p className="text-sm">Your generated pitch will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(132,6,249,0.5); }
            `}</style>
        </div>
    );
}
