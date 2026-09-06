'use client';

import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';
import { toast } from '@/components/Toast';
import Link from 'next/link';

const CITIES = ['Mumbai', 'Delhi NCR', 'Bangalore', 'Pune', 'Hyderabad', 'Remote / Online', 'Other'];
const NICHES = ['Tech & AI', 'Fashion & Beauty', 'Fitness & Health', 'Food & Travel', 'Finance & Business', 'Lifestyle & Vlogs', 'Gaming', 'Entertainment', 'Other'];
const COLLAB_TYPES = ['Joint Reel / Short', 'Podcast Guest', 'YouTube Collab', 'Photoshoot', 'Event Coverage', 'Live Stream', 'Brand Co-Pitch'];

interface CreatorProfile {
    full_name?: string | null;
    username?: string | null;
    profile_image?: string | null;
    city?: string | null;
    stats?: {
        followers?: string;
        instagram?: string;
        [key: string]: unknown;
    } | null;
}

interface PostCollabModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PostCollabModal({ isOpen, onClose, onSuccess }: PostCollabModalProps) {
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);

    const [form, setForm] = useState({
        title: '',
        collab_type: 'Joint Reel / Short',
        city: 'Delhi NCR',
        niche: 'Tech & AI',
        description: '',
        follower_count: '',
        contact_platform: 'instagram',
        contact_handle: '',
    });

    useEffect(() => {
        if (!isOpen) return;

        const checkUser = async () => {
            setCheckingAuth(true);
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Preload portfolio details if available
                const { data: portfolio } = await supabase
                    .from('portfolios')
                    .select('full_name, username, profile_image, city, stats')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (portfolio) {
                    setCreatorProfile(portfolio);
                    setForm((prev) => ({
                        ...prev,
                        city: portfolio.city || prev.city,
                        follower_count: portfolio.stats?.followers || prev.follower_count,
                        contact_handle: portfolio.stats?.instagram ? `@${portfolio.stats.instagram}` : prev.contact_handle,
                    }));
                }
            }
            setCheckingAuth(false);
        };

        checkUser();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast('Please log in to post a collab request', 'error');
            return;
        }

        if (!form.title.trim() || !form.description.trim() || !form.contact_handle.trim()) {
            toast('Please fill in all required fields', 'error');
            return;
        }

        setLoading(true);

        try {
            const creatorName = creatorProfile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Creator';
            const creatorUsername = creatorProfile?.username || null;
            const creatorAvatar = creatorProfile?.profile_image || null;

            const { error } = await supabase.from('collab_requests').insert({
                user_id: user.id,
                creator_name: creatorName,
                creator_username: creatorUsername,
                creator_avatar: creatorAvatar,
                title: form.title.trim(),
                description: form.description.trim(),
                collab_type: form.collab_type,
                city: form.city,
                niche: form.niche,
                follower_count: form.follower_count.trim() || null,
                contact_platform: form.contact_platform,
                contact_handle: form.contact_handle.trim(),
                is_open: true,
            });

            if (error) throw error;

            toast('Collaboration request posted successfully! 🚀', 'success');
            onSuccess();
            onClose();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error('Error posting collab:', message);
            toast('Failed to post: ' + message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>

                {checkingAuth ? (
                    <div className="text-center py-16">
                        <div className="w-10 h-10 border-2 border-[#8406f9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white/60 text-sm">Checking authentication...</p>
                    </div>
                ) : !user ? (
                    /* Not logged in gate */
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-[#8406f9]/20 flex items-center justify-center text-[#8406f9] mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl">handshake</span>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3">Join Elite to Post Collabs</h3>
                        <p className="text-white/60 text-base max-w-md mx-auto mb-8">
                            Only verified creators on Elite Influencer can broadcast collab requests. Log in or create your portfolio in 2 minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/login?next=/collabs"
                                className="w-full sm:w-auto px-8 py-3.5 bg-[#8406f9] text-white font-bold rounded-full hover:bg-[#8406f9]/90 transition-all text-center shadow-lg shadow-[#8406f9]/25"
                            >
                                Log In to Continue
                            </Link>
                            <button
                                onClick={onClose}
                                className="w-full sm:w-auto px-6 py-3.5 bg-white/5 text-white/70 font-semibold rounded-full hover:bg-white/10 transition-all cursor-pointer"
                            >
                                Browse for Now
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Post Collab Form */
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8406f9]/15 border border-[#8406f9]/30 text-[#8406f9] text-xs font-bold uppercase tracking-wider mb-2">
                                Creator Collab Board
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white">Post a Collab Request</h2>
                            <p className="text-white/50 text-sm mt-1">
                                Reach creators in your city or niche to build viral content together.
                            </p>
                        </div>

                        {/* Collab Title */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                                Collab Headline *
                            </label>
                            <input
                                type="text"
                                required
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Looking for a fitness creator in Mumbai for a joint Reel series"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#8406f9] transition-colors text-sm"
                            />
                        </div>

                        {/* Collab Format & City */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                                    Collab Format *
                                </label>
                                <select
                                    value={form.collab_type}
                                    onChange={(e) => setForm({ ...form, collab_type: e.target.value })}
                                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8406f9] transition-colors cursor-pointer"
                                >
                                    {COLLAB_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                                    Location / City *
                                </label>
                                <select
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8406f9] transition-colors cursor-pointer"
                                >
                                    {CITIES.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Niche & Follower Reach */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                                    Primary Niche *
                                </label>
                                <select
                                    value={form.niche}
                                    onChange={(e) => setForm({ ...form, niche: e.target.value })}
                                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8406f9] transition-colors cursor-pointer"
                                >
                                    {NICHES.map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                                    Your Follower Count / Reach
                                </label>
                                <input
                                    type="text"
                                    value={form.follower_count}
                                    onChange={(e) => setForm({ ...form, follower_count: e.target.value })}
                                    placeholder="e.g. 25k followers"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#8406f9] transition-colors text-sm"
                                />
                            </div>
                        </div>

                        {/* Detailed Description */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                                Collab Concept & Deliverables *
                            </label>
                            <textarea
                                rows={4}
                                required
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Explain the concept, what you will film/record, who you are looking for, and timeline..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#8406f9] transition-colors text-sm leading-relaxed"
                            ></textarea>
                        </div>

                        {/* Preferred Contact Platform & Handle */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                                    Contact Via *
                                </label>
                                <select
                                    value={form.contact_platform}
                                    onChange={(e) => setForm({ ...form, contact_platform: e.target.value })}
                                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8406f9] transition-colors cursor-pointer"
                                >
                                    <option value="instagram">Instagram DM</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="email">Email</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                                    Handle / Number / Email *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.contact_handle}
                                    onChange={(e) => setForm({ ...form, contact_handle: e.target.value })}
                                    placeholder={
                                        form.contact_platform === 'whatsapp'
                                            ? 'e.g. 9876543210'
                                            : form.contact_platform === 'email'
                                            ? 'e.g. creator@gmail.com'
                                            : 'e.g. @your_instagram_handle'
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#8406f9] transition-colors text-sm"
                                />
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white/70 font-semibold rounded-full text-sm transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold rounded-full text-sm transition-all shadow-lg shadow-[#8406f9]/30 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                            >
                                {loading ? 'Posting...' : 'Publish Collab Request'}
                                <span className="material-symbols-outlined text-sm">send</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
