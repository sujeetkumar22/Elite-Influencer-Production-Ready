'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { supabase as supabaseClient } from '../../utils/supabase/client';
import { toPng } from 'html-to-image';

// --- MARKET DATA ---
const cpmRates: Record<string, number> = {
    "tech": 500, "finance": 800, "beauty": 450, "health": 400,
    "travel": 400, "food": 350, "lifestyle": 250, "gaming": 150
};
const productionFees: Record<string, number> = {
    "tech": 950, "finance": 800, "beauty": 700, "health": 700,
    "travel": 700, "food": 650, "lifestyle": 700, "gaming": 600
};
const rightsMultipliers: Record<string, number> = { "social": 1.0, "full": 1.5, "perpetual": 2.0 };

export default function CreatorCalc() {
    // --- STATE ---
    const [views, setViews] = useState('');
    const [niche, setNiche] = useState('tech');
    const [rights, setRights] = useState('social');

    const [results, setResults] = useState({
        avg: 0,
        min: 0,
        max: 0,
        baseRate: 0,
        prodFee: 0,
        multiplier: 1.0
    });

    const [modals, setModals] = useState({
        lead: false,
        survey: false
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        insta: '',
        phone: '',
        surveyNiche: '',
        surveyExp: 'Newbie'
    });

    const [surveySubmitted, setSurveySubmitted] = useState(false);
    const [saveBtnText, setSaveBtnText] = useState('Download Invoice');
    const [copyBtnText, setCopyBtnText] = useState('Copy');

    const targetRef = useRef<HTMLDivElement>(null);

    // --- INITIALIZATION ---
    useEffect(() => {
        // Shared Supabase client is already initialized
        console.log("Supabase client ready.");
    }, []);

    // --- LOGIC ---
    const calculateRate = () => {
        const rawViews = parseFloat(views.replace(/,/g, ''));
        if (isNaN(rawViews)) {
            alert("Please enter a valid number for views.");
            return;
        }
        if (rawViews < 1000) {
            alert("Please enter a minimum of 1,000 views.");
            return;
        }

        const cpm = cpmRates[niche] || 250;
        const baseRate = (rawViews / 1000) * cpm;
        const avgProdFee = productionFees[niche] || 700;
        const multiplier = rightsMultipliers[rights] || 1.0;

        const totalAvg = (baseRate + avgProdFee) * multiplier;
        const totalMin = totalAvg * 0.80;
        const totalMax = totalAvg * 1.50;

        setResults({
            avg: totalAvg,
            min: totalMin,
            max: totalMax,
            baseRate: baseRate,
            prodFee: avgProdFee,
            multiplier: multiplier
        });
    };

    const openLeadModal = () => {
        if (results.avg === 0) {
            alert("Please calculate a value before downloading.");
            return;
        }
        setModals({ ...modals, lead: true });
    };

    const closeLeadModal = () => setModals({ ...modals, lead: false });
    const closeSurveyModal = () => setModals({ ...modals, survey: false });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const submitAndDownload = async () => {
        const { name, email, insta, phone } = formData;
        if (!name || !email || !insta || !phone) {
            alert("Please fill in all fields.");
            return;
        }

        // Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length !== 10) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        setSaveBtnText('Saving...');

        // Save to Supabase
        if (supabaseClient) {
            try {
                await supabaseClient.from('leads').insert({
                    name, email, instagram: insta, phone: phone, quote_price: results.avg
                });
            } catch (err) { console.error("DB Save Error:", err); }
        }

        // Download Image
        if (targetRef.current) {
            try {
                const dataUrl = await toPng(targetRef.current, { backgroundColor: '#050505', cacheBust: true });
                const link = document.createElement('a');
                link.download = `CreatorCalc_Quote_${insta}.png`;
                link.href = dataUrl;
                link.click();

                setSaveBtnText('Download Invoice');
                closeLeadModal();
                setModals({ ...modals, survey: true }); // Open Survey
            } catch (err) {
                console.error(err);
                alert("Error generating image.");
                setSaveBtnText('Download Invoice');
            }
        }
    };

    const submitSurvey = async () => {
        const { surveyNiche, surveyExp, email } = formData;
        if (!surveyNiche || !surveyExp) {
            alert("Please select an option for both questions.");
            return;
        }

        if (supabaseClient && email) {
            supabaseClient
                .from('leads')
                .update({ niche_category: surveyNiche, experience_level: surveyExp })
                .eq('email', email)
                .then(() => console.log("Survey saved"));
        }

        setSurveySubmitted(true);
    };

    const copyTemplate = () => {
        const text = `Hi [Brand Team],\n\nI've been using [Product Name] for a while and I'm a huge fan of what you're building.\n\nI am a content creator in the [Your Niche] space. My audience is highly engaged and always looking for recommendations. \n\nI have an idea for a Reel that highlights [Key Feature] in an authentic way that could drive immediate interest for your brand.\n\nHere is a link to my previous work: [Your Portfolio Link]\n\nWould you be open to a quick 5-min chat?\n\nBest,\n[Your Name]`;
        navigator.clipboard.writeText(text);
        setCopyBtnText('Copied!');
        setTimeout(() => setCopyBtnText('Copy'), 2000);
    };

    const fmt = (num: number) => num.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });


    return (
        <div className="bg-[#050505] font-sans text-slate-100 min-h-screen relative overflow-x-hidden selection:bg-[#8a2ce2] selection:text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 grid-overlay pointer-events-none z-0"></div>
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] glow-orb pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] glow-orb pointer-events-none z-0"></div>

            {/* --- LEAD MODAL --- */}
            {modals.lead && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeLeadModal}></div>
                    <div className="relative w-full max-w-md p-6 animate-fade-in-up">
                        <div className="bg-[#121212] border border-[#8a2ce2] rounded-2xl p-8 shadow-[0_0_50px_rgba(138,44,226,0.2)]">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-black text-white mb-2">Save Your Quote ⚡</h3>
                                <p className="text-slate-400 text-sm">Enter details to download the official valuation card.</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">Full Name</label>
                                    <input id="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full bg-black/40 border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#8a2ce2] focus:ring-0 outline-none transition-all placeholder:text-slate-600" placeholder="Enter your name" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">Email Address</label>
                                    <input id="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full bg-black/40 border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#8a2ce2] focus:ring-0 outline-none transition-all placeholder:text-slate-600" placeholder="you@example.com" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">Instagram ID</label>
                                        <input id="insta" value={formData.insta} onChange={handleInputChange} type="text" className="w-full bg-black/40 border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#8a2ce2] focus:ring-0 outline-none transition-all placeholder:text-slate-600" placeholder="@username" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">WhatsApp</label>
                                        <input id="phone" value={formData.phone} onChange={handleInputChange} type="tel" maxLength={10} className="w-full bg-black/40 border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#8a2ce2] focus:ring-0 outline-none transition-all placeholder:text-slate-600" placeholder="9999999999" />
                                    </div>
                                </div>
                                <button onClick={submitAndDownload} className="w-full bg-[#8a2ce2] hover:bg-[#7a25c9] text-white font-bold py-4 rounded-xl transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer">
                                    <span>{saveBtnText}</span>
                                    {saveBtnText === 'Download Invoice' && <span className="material-symbols-outlined text-sm">download</span>}
                                </button>
                                <button onClick={closeLeadModal} className="w-full text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white mt-4">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SURVEY MODAL --- */}
            {modals.survey && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
                    <div className="relative w-full max-w-lg p-6 animate-fade-in-up">
                        <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden">

                            {!surveySubmitted ? (
                                <div id="surveyQuestions">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-500 mb-4">
                                        <span className="material-symbols-outlined text-2xl">check_circle</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2">Quote Downloading...</h3>
                                    <p className="text-slate-400 text-sm mb-6">Answer 2 quick questions to unlock our <b>Winning Brand Pitch Template</b>.</p>
                                    <div className="space-y-4 text-left">
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">1. What is your primary niche?</label>
                                            <select id="surveyNiche" value={formData.surveyNiche} onChange={handleInputChange} className="w-full bg-black/40 border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#8a2ce2] focus:ring-0 transition-all cursor-pointer outline-none">
                                                <option value="" disabled>Select your niche...</option>
                                                <option value="Tech & Engineering">Tech & Engineering</option>
                                                <option value="Finance & SaaS">Finance & SaaS</option>
                                                <option value="Beauty & Makeup">Beauty & Makeup</option>
                                                <option value="Health & Fitness">Health & Fitness</option>
                                                <option value="Travel & Vlog">Travel & Vlog</option>
                                                <option value="Food & Cooking">Food & Cooking</option>
                                                <option value="Lifestyle & Fashion">Lifestyle & Fashion</option>
                                                <option value="Gaming & Esports">Gaming & Esports</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">2. Brand Deal Experience</label>
                                            <select id="surveyExp" value={formData.surveyExp} onChange={handleInputChange} className="w-full bg-black/40 border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#8a2ce2] focus:ring-0 transition-all cursor-pointer outline-none">
                                                <option value="Newbie">I'm new (0 deals)</option>
                                                <option value="Beginner">1-5 deals</option>
                                                <option value="Intermediate">5-20 deals</option>
                                                <option value="Pro">20+ deals</option>
                                            </select>
                                        </div>
                                        <button onClick={submitSurvey} className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-slate-200 transition-all mt-4 cursor-pointer">
                                            Unlock Template Now
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div id="surveyResult" className="text-left animate-fade-in">
                                    <h3 className="text-xl font-bold text-white mb-4 text-center">🎉 Here is your Pitch Template</h3>
                                    <div className="relative mb-6">
                                        <textarea id="pitchTemplate" className="w-full h-48 bg-[#1A1A1A] border border-[#333] rounded-xl p-4 text-slate-300 text-sm leading-relaxed focus:outline-none resize-none font-mono" readOnly value={`Hi [Brand Team],\n\nI've been using [Product Name] for a while and I'm a huge fan of what you're building.\n\nI am a content creator in the [Your Niche] space. My audience is highly engaged and always looking for recommendations. \n\nI have an idea for a Reel that highlights [Key Feature] in an authentic way that could drive immediate interest for your brand.\n\nHere is a link to my previous work: [Your Portfolio Link]\n\nWould you be open to a quick 5-min chat?\n\nBest,\n[Your Name]`}></textarea>
                                        <button onClick={copyTemplate} className={`absolute top-3 right-3 ${copyBtnText === 'Copied!' ? 'bg-green-600' : 'bg-[#8a2ce2] hover:bg-[#7a25c9]'} text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer`}>
                                            <span className="material-symbols-outlined text-sm">{copyBtnText === 'Copied!' ? 'check' : 'content_copy'}</span> {copyBtnText}
                                        </button>
                                    </div>

                                    <div className="bg-[#111] border border-white/5 rounded-xl p-4 text-center">
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Want more brand deals?</p>
                                        <a href="https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq" target="_blank" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 group">
                                            <Image src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" width={24} height={24} className="w-6 h-6" alt="WhatsApp" />
                                            <span>Join Creator Community</span>
                                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </a>
                                    </div>

                                    <button onClick={closeSurveyModal} className="w-full text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white mt-4">
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


            <div className="relative z-10 layout-container flex flex-col min-h-screen">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/5 px-6 lg:px-20 py-4 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex items-center gap-3 text-white">
                        <div className="size-6 text-[#8a2ce2]">
                            <span className="material-symbols-outlined text-3xl">calculate</span>
                        </div>
                        <h2 className="text-white text-xl font-black leading-tight tracking-tight">CREATOR<span className="text-[#8a2ce2]">CALC</span></h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <a href="https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq" target="_blank" className="hidden md:flex items-center gap-2 text-sm font-bold text-[#25D366] hover:text-white transition-colors">
                            <Image src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" width={16} height={16} className="w-4 h-4" alt="WhatsApp" />
                            Join Community
                        </a>
                    </div>
                </header>

                <main className="flex-1 flex flex-col items-center px-4 py-12 lg:py-20 max-w-[1200px] mx-auto w-full">
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-white text-5xl lg:text-7xl font-black tracking-tighter leading-none">
                            STOP GUESSING.<br />
                            <span className="text-[#8a2ce2]">KNOW YOUR WORTH.</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
                            The algorithmic standard for content creator pricing in India.
                        </p>
                    </div>

                    <div ref={targetRef} id="capture-target" className="w-full max-w-4xl rounded-2xl p-8 lg:p-12 mb-20 relative bg-[rgba(12,12,12,0.7)] backdrop-blur-xl border border-[rgba(138,44,226,0.3)] shadow-[0_0_40px_rgba(138,44,226,0.1)]">
                        <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                            <span className="material-symbols-outlined text-6xl text-[#8a2ce2]">analytics</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-6">
                                <label className="block">
                                    <span className="text-[#cbd5e1] text-xs font-bold uppercase tracking-widest mb-2 block">Average Views (30d)</span>
                                    <div className="relative group">
                                        <input
                                            value={views}
                                            onChange={(e) => setViews(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && calculateRate()}
                                            className="w-full bg-[rgba(0,0,0,0.4)] border-2 border-[#1a1a1a] focus:border-[#8a2ce2] focus:ring-0 rounded-xl h-16 px-6 text-xl font-mono text-[#ffffff] transition-all placeholder:text-[#334155] outline-none"
                                            placeholder="50000"
                                            type="number"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 group/tooltip z-20">
                                            <span className="material-symbols-outlined text-[#64748b] cursor-help hover:text-[#ffffff] transition-colors">info</span>
                                            <div className="absolute bottom-full right-0 mb-3 w-64 p-3 bg-[#111] border border-[rgba(255,255,255,0.2)] rounded-xl text-xs text-[#cbd5e1] opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] pointer-events-none transform translate-y-2 group-hover/tooltip:translate-y-0">
                                                The average views of your last 5 days divide by 5.
                                                <div className="absolute -bottom-1 right-2 w-2 h-2 bg-[#111] border-b border-r border-[rgba(255,255,255,0.2)] rotate-45"></div>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                                <label className="block">
                                    <span className="text-[#cbd5e1] text-xs font-bold uppercase tracking-widest mb-2 block">Campaign Niche</span>
                                    <div className="relative group">
                                        <select
                                            value={niche}
                                            onChange={(e) => setNiche(e.target.value)}
                                            className="w-full bg-[rgba(0,0,0,0.4)] border-2 border-[#1a1a1a] focus:border-[#8a2ce2] focus:ring-0 rounded-xl h-16 px-6 text-lg text-[#ffffff] transition-all appearance-none cursor-pointer outline-none"
                                        >
                                            <option value="tech">Tech & Engineering</option>
                                            <option value="finance">Finance & SaaS</option>
                                            <option value="beauty">Beauty & Makeup</option>
                                            <option value="health">Health & Fitness</option>
                                            <option value="travel">Travel & Vlog</option>
                                            <option value="food">Food & Drinks</option>
                                            <option value="lifestyle">Lifestyle & Fashion</option>
                                            <option value="gaming">Gaming & Esports</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none">expand_more</span>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <span className="text-[#cbd5e1] text-xs font-bold uppercase tracking-widest mb-2 block">Usage Rights</span>
                                    <div className="flex p-1.5 bg-[rgba(0,0,0,0.6)] rounded-xl border border-[#1a1a1a] h-16">
                                        {['social', 'full', 'perpetual'].map((opt) => (
                                            <label key={opt} className={`flex-1 flex items-center justify-center cursor-pointer rounded-lg transition-all text-sm font-bold ${rights === opt ? 'bg-[#8a2ce2] text-[#ffffff]' : 'text-[#64748b] hover:text-[#cbd5e1]'} relative group/opt`}>
                                                <input
                                                    className="hidden"
                                                    name="rights"
                                                    type="radio"
                                                    value={opt}
                                                    checked={rights === opt}
                                                    onChange={() => setRights(opt)}
                                                />
                                                {opt === 'social' ? 'Social Only' : opt === 'full' ? 'Full Usage' : 'Perpetual'}
                                                <span className="material-symbols-outlined text-[14px] ml-1 opacity-50 hover:opacity-100">info</span>
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 p-2 bg-[#111] border border-[rgba(255,255,255,0.2)] rounded-lg text-[10px] text-[#cbd5e1] opacity-0 invisible group-hover/opt:opacity-100 group-hover/opt:visible transition-all shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] z-30 font-normal normal-case">
                                                    {opt === 'social' ? 'Standard organic usage on social media.' : opt === 'full' ? 'Includes Paid Ads and Digital Rights.' : 'Lifetime buyout. Brand owns the video.'}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={calculateRate} className="w-full bg-[#8a2ce2] h-16 rounded-xl text-[#ffffff] font-black text-lg tracking-widest uppercase shadow-[0_10px_30px_rgba(138,44,226,0.3)] flex items-center justify-center gap-3 cursor-pointer">
                                    Calculate Value
                                    <span className="material-symbols-outlined">bolt</span>
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-[rgba(255,255,255,0.05)] pt-10 text-center">
                            <p className="text-[#64748b] text-xs font-bold uppercase tracking-[0.2em] mb-4">Estimated Campaign Value (Average)</p>
                            <div className="font-mono text-6xl md:text-8xl font-bold text-[#8a2ce2] flex items-center justify-center gap-4 drop-shadow-[0_0_15px_rgba(138,44,226,0.8)]">
                                <span className="opacity-50 text-4xl md:text-5xl">₹</span>
                                <span suppressHydrationWarning>{results.avg === 0 ? '0.00' : fmt(results.avg).replace(/[^\d.,]/g, '').trim()}</span>
                            </div>
                            <div className="mt-8 grid grid-cols-3 divide-x divide-[rgba(255,255,255,0.1)] border-t border-[rgba(255,255,255,0.1)] pt-6">
                                <div className="text-center px-4">
                                    <p className="text-[#64748b] text-[10px] font-bold uppercase tracking-widest mb-1">Lowest</p>
                                    <p className="text-[#ffffff] font-mono text-xl font-bold" suppressHydrationWarning>{fmt(results.min)}</p>
                                </div>
                                <div className="text-center px-4">
                                    <p className="text-[#64748b] text-[10px] font-bold uppercase tracking-widest mb-1">Average</p>
                                    <p className="text-[#8a2ce2] font-mono text-xl font-bold" suppressHydrationWarning>{fmt(results.avg)}</p>
                                </div>
                                <div className="text-center px-4">
                                    <p className="text-[#64748b] text-[10px] font-bold uppercase tracking-widest mb-1">Maximum</p>
                                    <p className="text-[#ffffff] font-mono text-xl font-bold" suppressHydrationWarning>{fmt(results.max)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-20 text-center space-y-4">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">👇 Save this for your next negotiation</p>
                        <button onClick={openLeadModal} className="group relative inline-flex items-center gap-3 bg-white text-black text-lg font-black uppercase tracking-wider px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)] cursor-pointer">
                            <span className="material-symbols-outlined text-2xl group-hover:animate-bounce">download</span>
                            Download Official Quote
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-20">
                        <div className="bg-[#0c0c0c] border border-[#1a1a1a] p-8 rounded-2xl hover:border-[#8a2ce2]/50 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-[#8a2ce2]/10 flex items-center justify-center mb-6 group-hover:bg-[#8a2ce2]/20 transition-colors">
                                <span className="material-symbols-outlined text-[#8a2ce2]">monitoring</span>
                            </div>
                            <h3 className="text-white text-xl font-bold mb-3">Base Rate</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">Calculated using dynamic CPM floor based on your niche selection.</p>
                            <div className="text-white font-mono font-bold" suppressHydrationWarning>{fmt(results.baseRate)}</div>
                        </div>
                        <div className="bg-[#0c0c0c] border border-[#1a1a1a] p-8 rounded-2xl hover:border-[#8a2ce2]/50 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-[#8a2ce2]/10 flex items-center justify-center mb-6 group-hover:bg-[#8a2ce2]/20 transition-colors">
                                <span className="material-symbols-outlined text-[#8a2ce2]">movie_edit</span>
                            </div>
                            <h3 className="text-white text-xl font-bold mb-3">Production Fee</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">Estimated overhead for high-complexity video content.</p>
                            <div className="text-white font-mono font-bold" suppressHydrationWarning>{fmt(results.prodFee)}</div>
                        </div>
                        <div className="bg-[#0c0c0c] border border-[#1a1a1a] p-8 rounded-2xl hover:border-[#8a2ce2]/50 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-[#8a2ce2]/10 flex items-center justify-center mb-6 group-hover:bg-[#8a2ce2]/20 transition-colors">
                                <span className="material-symbols-outlined text-[#8a2ce2]">verified_user</span>
                            </div>
                            <h3 className="text-white text-xl font-bold mb-3">Rights Multiplier</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">Multiplier based on usage rights duration.</p>
                            <div className="text-[#8a2ce2] font-mono font-bold">{results.multiplier}x Applied</div>
                        </div>
                    </div>

                    <footer className="w-full border-t border-white/5 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3 opacity-50">
                            <span className="material-symbols-outlined text-xl">calculate</span>
                            <span className="text-xs font-bold tracking-widest uppercase">CreatorCalc © 2024</span>
                        </div>
                    </footer>
                </main>

                <style jsx global>{`
          .grid-overlay {
            background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
            background-size: 40px 40px;
          }
          .glow-orb {
            background: radial-gradient(circle, rgba(138, 44, 226, 0.15) 0%, rgba(5, 5, 5, 0) 70%);
          }
          input[type=number]::-webkit-inner-spin-button, 
          input[type=number]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
          }
        `}</style>
            </div>
        </div>
    );
}
