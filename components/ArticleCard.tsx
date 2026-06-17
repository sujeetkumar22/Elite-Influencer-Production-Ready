import Link from "next/link";

interface ArticleProps {
  article: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    author_id: string;
    image_url?: string;
  };
}

export default function ArticleCard({ article }: ArticleProps) {
  const date = new Date(article.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Extract a short preview
  const preview =
    article.content.length > 120
      ? article.content.substring(0, 120) + "..."
      : article.content;

  return (
    <article className="group flex flex-col h-full bg-[#111111] border border-white/5 hover:border-[#8406f9]/50 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(132,6,249,0.15)] relative">
      {article.image_url ? (
        <div className="w-full h-56 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent z-10"></div>
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        </div>
      ) : (
        <div className="w-full h-52 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] relative overflow-hidden">
             {/* Abstract pattern fallback */}
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#8406f9]/10 rounded-full blur-2xl group-hover:bg-[#8406f9]/20 transition-colors duration-700"></div>
             <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-colors duration-700"></div>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="material-symbols-outlined text-5xl text-white/5 group-hover:scale-110 transition-transform duration-700">article</span>
             </div>
        </div>
      )}
      
      <div className="flex flex-col flex-1 p-8 relative z-20 -mt-12">
        <time className="text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-4 bg-[#0a0a0a] inline-block px-3 py-1.5 rounded-full border border-white/10 w-fit drop-shadow-md">
          {date}
        </time>
        <h2 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-[#8406f9] transition-colors">{article.title}</h2>
        <p className="text-white/50 leading-relaxed mb-8 flex-1 text-sm md:text-base font-light">{preview}</p>
        
        <div className="pt-6 border-t border-white/10 mt-auto">
          <Link 
            href={`/feeds/${article.id}`} 
            className="text-white font-bold text-sm uppercase tracking-widest hover:text-[#8406f9] transition-colors flex items-center gap-2 w-fit group/link"
          >
            Read Post <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
