import { createClient } from "@/utils/supabase/server";
import ArticleCard from "@/components/ArticleCard";

export const revalidate = 0; // Disable cache for feeds if needed

export default async function FeedsPage() {
  const supabase = await createClient();

  // Fetch published articles
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8406f9]/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/20 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(132,6,249,0.15)] animate-fade-in">
            Insights & Updates
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-white drop-shadow-lg animate-fade-in animate-delay-100">
            ELITE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8406f9] to-pink-500">JOURNAL</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed animate-fade-in animate-delay-200">
            Master the creator economy. Strategies, brand deal guides, and community highlights to help you scale your personal empire.
          </p>
        </header>

        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="max-w-xl mx-auto text-center py-24 bg-[#111111] rounded-3xl border border-white/5 backdrop-blur-sm shadow-2xl">
            <span className="material-symbols-outlined text-6xl text-white/10 mb-6 block">article</span>
            <h3 className="text-2xl font-bold mb-3 text-white">No transmissions yet.</h3>
            <p className="text-white/50 text-lg max-w-sm mx-auto">The journal is currently empty. Check back shortly for high-value insights.</p>
          </div>
        )}
      </div>
    </div>
  );
}
