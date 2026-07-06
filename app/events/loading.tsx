export default function EventsLoading() {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="h-7 w-64 bg-white/5 rounded-full mx-auto mb-6 animate-pulse"></div>
                    <div className="h-14 md:h-20 w-full max-w-xl bg-white/5 rounded-2xl mx-auto mb-6 animate-pulse"></div>
                    <div className="h-5 w-80 bg-white/5 rounded-full mx-auto animate-pulse"></div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-10 w-24 bg-white/5 rounded-full animate-pulse"></div>
                    ))}
                </div>

                <div className="flex items-center justify-center gap-3 mb-10 text-white/40 text-sm font-bold">
                    <span className="material-symbols-outlined animate-spin text-[#8406f9]">progress_activity</span>
                    Scouting the most instagrammable events in your city…
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-[#111111] border border-white/5 rounded-2xl p-6 animate-pulse">
                            <div className="flex justify-between mb-5">
                                <div className="h-6 w-24 bg-white/5 rounded-full"></div>
                                <div className="h-6 w-20 bg-white/5 rounded-full"></div>
                            </div>
                            <div className="h-6 w-3/4 bg-white/10 rounded mb-3"></div>
                            <div className="h-4 w-1/2 bg-white/5 rounded mb-5"></div>
                            <div className="h-16 w-full bg-white/5 rounded mb-5"></div>
                            <div className="h-11 w-full bg-white/5 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
