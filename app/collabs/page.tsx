'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CollabCard, { CollabRequest } from '@/components/CollabCard';
import PostCollabModal from '@/components/PostCollabModal';
import { supabase } from '@/utils/supabase/client';

const CITIES = ['All Cities', 'Delhi NCR', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Remote / Online'];
const COLLAB_TYPES = ['All Formats', 'Joint Reel / Short', 'Podcast Guest', 'YouTube Collab', 'Photoshoot', 'Event Coverage', 'Live Stream'];
const NICHES = ['All Niches', 'Tech & AI', 'Fashion & Beauty', 'Fitness & Health', 'Food & Travel', 'Finance & Business', 'Lifestyle & Vlogs', 'Gaming'];

const STARTER_COLLABS: CollabRequest[] = [
    {
        id: 'starter-1',
        created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
        creator_name: 'Aarav Sharma',
        creator_username: 'aaravtech',
        creator_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        title: 'Tech Creator looking for AI Startup Founders / Creators for Podcast Ep',
        description: 'Hosting an upcoming season of "The AI Frontier". Looking for AI engineers, tech influencers, and founders based in Delhi NCR or available for remote recording.',
        niche: 'Tech & AI',
        city: 'Delhi NCR',
        collab_type: 'Podcast Guest',
        follower_count: '45K+',
        contact_platform: 'instagram',
        contact_handle: 'aaravtech'
    },
    {
        id: 'starter-2',
        created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
        creator_name: 'Rhea Kapoor',
        creator_username: 'styledbyrhea',
        creator_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        title: 'Looking for a Fashion Creator in Mumbai for Street Style Reel Series',
        description: 'Planning a high-production 3-part aesthetic reel series covering Bandra & Colaba thrift vs luxury fashion. Need a co-creator with good camera energy!',
        niche: 'Fashion & Beauty',
        city: 'Mumbai',
        collab_type: 'Joint Reel / Short',
        follower_count: '110K+',
        contact_platform: 'instagram',
        contact_handle: 'styledbyrhea'
    },
    {
        id: 'starter-3',
        created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
        creator_name: 'Vikram Sethi',
        creator_username: 'vikram_fit',
        creator_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        title: 'Calisthenics x Gym Challenge Video in Bangalore',
        description: 'Shooting a fun workout challenge comparing strength & endurance between bodyweight calisthenics and heavy powerlifting. Open to fitness creators in BLR.',
        niche: 'Fitness & Health',
        city: 'Bangalore',
        collab_type: 'YouTube Collab',
        follower_count: '28K+',
        contact_platform: 'whatsapp',
        contact_handle: '+919876543210'
    }
];

export default function CollabsPage() {
    const [collabs, setCollabs] = useState<CollabRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Filter states
    const [search, setSearch] = useState('');
    const [selectedCity, setSelectedCity] = useState('All Cities');
    const [selectedType, setSelectedType] = useState('All Formats');
    const [selectedNiche, setSelectedNiche] = useState('All Niches');

    const fetchCollabs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('collab_requests')
                .select('*')
                .eq('is_open', true)
                .order('created_at', { ascending: false });

            if (!error && data && data.length > 0) {
                setCollabs(data as CollabRequest[]);
            } else {
                // If table is empty or error (e.g. migration pending), show starter collabs
                setCollabs(STARTER_COLLABS);
            }
        } catch (err) {
            console.error('Failed to fetch collabs:', err);
            setCollabs(STARTER_COLLABS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollabs();

        // Check if user is logged in for Navbar
        supabase.auth.getUser().then(({ data: { user } }) => {
            setIsLoggedIn(!!user);
        });
    }, []);

    // Filter logic
    const filteredCollabs = useMemo(() => {
        return collabs.filter((collab) => {
            const matchesCity = selectedCity === 'All Cities' || collab.city.toLowerCase().includes(selectedCity.toLowerCase());
            const matchesType = selectedType === 'All Formats' || collab.collab_type.toLowerCase() === selectedType.toLowerCase();
            const matchesNiche = selectedNiche === 'All Niches' || collab.niche.toLowerCase().includes(selectedNiche.toLowerCase());

            const searchLower = search.toLowerCase();
            const matchesSearch =
                !search.trim() ||
                collab.title.toLowerCase().includes(searchLower) ||
                collab.description.toLowerCase().includes(searchLower) ||
                collab.creator_name.toLowerCase().includes(searchLower) ||
                collab.city.toLowerCase().includes(searchLower) ||
                collab.niche.toLowerCase().includes(searchLower);

            return matchesCity && matchesType && matchesNiche && matchesSearch;
        });
    }, [collabs, selectedCity, selectedType, selectedNiche, search]);

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden">
            <Navbar isLoggedIn={isLoggedIn} />

            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8406f9]/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-pink-600/5 blur-[150px] rounded-full pointer-events-none"></div>

            <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-14 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(132,6,249,0.15)] animate-fade-in">
                        Creator Networking & Partnerships
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-white drop-shadow-lg animate-fade-in animate-delay-100">
                        COLLAB <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8406f9] to-pink-500">FINDER</span>
                    </h1>
                    <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-8 animate-fade-in animate-delay-200">
                        Connect with fellow creators in your city or niche for joint Reels, podcast appearances, and viral cross-promotions.
                    </p>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold text-base transition-all shadow-[0_0_30px_rgba(132,6,249,0.3)] hover:shadow-[0_0_50px_rgba(132,6,249,0.5)] hover:-translate-y-0.5 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        <span>Post a Collab Request</span>
                    </button>
                </header>

                {/* Filter & Search Bar */}
                <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-12 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search Input */}
                        <div className="relative md:col-span-1">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg">
                                search
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search collabs, keywords..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#8406f9] transition-colors"
                            />
                        </div>

                        {/* City Filter */}
                        <div>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8406f9] transition-colors cursor-pointer"
                            >
                                {CITIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Collab Format Filter */}
                        <div>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8406f9] transition-colors cursor-pointer"
                            >
                                {COLLAB_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Niche Filter */}
                        <div>
                            <select
                                value={selectedNiche}
                                onChange={(e) => setSelectedNiche(e.target.value)}
                                className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8406f9] transition-colors cursor-pointer"
                            >
                                {NICHES.map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    {(selectedCity !== 'All Cities' || selectedType !== 'All Formats' || selectedNiche !== 'All Niches' || search) && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5 flex-wrap">
                            <span className="text-xs text-white/40">Active Filters:</span>
                            {selectedCity !== 'All Cities' && (
                                <span className="inline-flex items-center gap-1 text-xs bg-[#8406f9]/20 text-[#8406f9] px-2.5 py-1 rounded-full">
                                    {selectedCity}
                                    <button onClick={() => setSelectedCity('All Cities')} className="hover:text-white cursor-pointer">×</button>
                                </span>
                            )}
                            {selectedType !== 'All Formats' && (
                                <span className="inline-flex items-center gap-1 text-xs bg-[#8406f9]/20 text-[#8406f9] px-2.5 py-1 rounded-full">
                                    {selectedType}
                                    <button onClick={() => setSelectedType('All Formats')} className="hover:text-white cursor-pointer">×</button>
                                </span>
                            )}
                            {selectedNiche !== 'All Niches' && (
                                <span className="inline-flex items-center gap-1 text-xs bg-[#8406f9]/20 text-[#8406f9] px-2.5 py-1 rounded-full">
                                    {selectedNiche}
                                    <button onClick={() => setSelectedNiche('All Niches')} className="hover:text-white cursor-pointer">×</button>
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    setSelectedCity('All Cities');
                                    setSelectedType('All Formats');
                                    setSelectedNiche('All Niches');
                                    setSearch('');
                                }}
                                className="text-xs text-white/50 hover:text-white underline ml-2 cursor-pointer"
                            >
                                Reset All
                            </button>
                        </div>
                    )}
                </div>

                {/* Collab Listings Grid */}
                {loading ? (
                    <div className="text-center py-24">
                        <div className="w-12 h-12 border-3 border-[#8406f9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white/60">Loading collaboration requests...</p>
                    </div>
                ) : filteredCollabs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredCollabs.map((collab) => (
                            <CollabCard key={collab.id} collab={collab} />
                        ))}
                    </div>
                ) : (
                    /* Empty state */
                    <div className="max-w-xl mx-auto text-center py-20 px-6 bg-[#111111] rounded-3xl border border-white/5 shadow-2xl">
                        <span className="material-symbols-outlined text-6xl text-white/15 mb-4 block">
                            handshake
                        </span>
                        <h3 className="text-2xl font-black text-white mb-2">No Collabs Found</h3>
                        <p className="text-white/50 text-sm max-w-sm mx-auto mb-6">
                            No open collaboration requests match your current filters. Be the first to post an opportunity!
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold rounded-full text-sm transition-all shadow-lg shadow-[#8406f9]/20 cursor-pointer"
                        >
                            Post a Collab Request
                        </button>
                    </div>
                )}
            </main>

            {/* Post Collab Modal */}
            <PostCollabModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchCollabs}
            />

            <Footer />
        </div>
    );
}
