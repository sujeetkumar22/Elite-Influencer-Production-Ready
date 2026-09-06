import Link from 'next/link';

export interface CollabRequest {
    id: string;
    created_at: string;
    creator_name: string;
    creator_username?: string | null;
    creator_avatar?: string | null;
    title: string;
    description: string;
    niche: string;
    city: string;
    collab_type: string;
    follower_count?: string | null;
    contact_platform: string;
    contact_handle: string;
}

export default function CollabCard({ collab }: { collab: CollabRequest }) {
    const formattedDate = new Date(collab.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    const getContactHref = () => {
        const handle = collab.contact_handle.trim();
        if (collab.contact_platform === 'whatsapp') {
            const cleanPhone = handle.replace(/\D/g, '');
            return `https://wa.me/${cleanPhone}`;
        }
        if (collab.contact_platform === 'email') {
            return `mailto:${handle}`;
        }
        // Default to Instagram
        const igUser = handle.replace(/^@/, '');
        return `https://instagram.com/${igUser}`;
    };

    const getContactLabel = () => {
        if (collab.contact_platform === 'whatsapp') return 'WhatsApp';
        if (collab.contact_platform === 'email') return 'Send Email';
        return 'Instagram DM';
    };

    return (
        <div className="group bg-[#111111] border border-white/5 hover:border-[#8406f9]/50 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden hover:bg-[#151515] flex flex-col justify-between hover:-translate-y-1 shadow-lg hover:shadow-[0_15px_35px_rgba(132,6,249,0.12)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8406f9]/5 rounded-full blur-3xl group-hover:bg-[#8406f9]/15 transition-all pointer-events-none"></div>

            <div>
                {/* Header: Creator details & post date */}
                <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#8406f9] to-pink-500 p-0.5 shrink-0">
                            {collab.creator_avatar ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={collab.creator_avatar}
                                    alt={collab.creator_name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center text-white font-black text-sm">
                                    {collab.creator_name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-base leading-snug group-hover:text-[#8406f9] transition-colors">
                                {collab.creator_name}
                            </h3>
                            {collab.creator_username ? (
                                <Link
                                    href={`/${collab.creator_username}`}
                                    className="text-xs text-[#8406f9] hover:underline font-medium"
                                >
                                    @{collab.creator_username}
                                </Link>
                            ) : (
                                <span className="text-xs text-white/40 font-medium">Creator</span>
                            )}
                        </div>
                    </div>

                    <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                        {formattedDate}
                    </span>
                </div>

                {/* Collab Type & City Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8406f9]/15 border border-[#8406f9]/30 text-[#8406f9] text-xs font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8406f9]"></span>
                        {collab.collab_type}
                    </span>

                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium">
                        <span className="material-symbols-outlined text-xs text-white/50">location_on</span>
                        {collab.city}
                    </span>

                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium">
                        <span className="material-symbols-outlined text-xs text-white/50">tag</span>
                        {collab.niche}
                    </span>

                    {collab.follower_count && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold">
                            {collab.follower_count} Reach
                        </span>
                    )}
                </div>

                {/* Title */}
                <h2 className="text-lg md:text-xl font-black text-white mb-3 leading-snug">
                    {collab.title}
                </h2>

                {/* Description */}
                <p className="text-white/60 text-sm leading-relaxed mb-6 whitespace-pre-line line-clamp-4">
                    {collab.description}
                </p>
            </div>

            {/* Action footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4 mt-auto">
                <div className="text-xs text-white/40">
                    Connect via <span className="text-white/70 font-semibold capitalize">{collab.contact_platform}</span>
                </div>

                <a
                    href={getContactHref()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8406f9] hover:bg-[#8406f9]/90 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#8406f9]/20 hover:shadow-lg hover:shadow-[#8406f9]/30 hover:-translate-y-0.5"
                >
                    <span>{getContactLabel()}</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
            </div>
        </div>
    );
}
