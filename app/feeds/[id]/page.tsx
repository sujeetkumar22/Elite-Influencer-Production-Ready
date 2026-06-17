import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 0;

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  // Check current user
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the article by ID
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    notFound();
  }

  const isAuthor = user && user.id === article.author_id;

  const date = new Date(article.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glowing orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8406f9]/20 blur-[130px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-10">
          <Link 
            href="/feeds"
            className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span> Back
          </Link>

          {isAuthor && (
            <Link 
              href={`/dashboard/feeds/edit/${article.id}`}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:border-[#8406f9]/50 hover:bg-[#8406f9]/10 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg"
            >
              <span className="material-symbols-outlined text-sm">edit</span> Edit
            </Link>
          )}
        </div>
        
        <article>
          <header className="mb-12 text-center">
            <time className="inline-block px-5 py-1.5 rounded-full border border-[#8406f9]/30 bg-[#8406f9]/10 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(132,6,249,0.2)]">
              {date}
            </time>
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight text-white drop-shadow-lg">
              {article.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-white/50 text-sm font-medium">
              <span>Elite Influencer Central</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8406f9] shadow-[0_0_8px_rgba(132,6,249,0.8)]"></span>
              <span>{Math.max(1, Math.ceil(article.content.split(' ').length / 200))} min read</span>
            </div>
          </header>

          {article.image_url && (
            <div className="w-full relative mb-16 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(132,6,249,0.15)] group">
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 z-10 pointer-events-none"></div>
               <img 
                 src={article.image_url} 
                 alt={article.title} 
                 className="w-full h-[400px] md:h-[550px] object-cover transform group-hover:scale-105 transition-transform duration-1000"
               />
            </div>
          )}
          
          <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-p:text-white/80 prose-p:font-light md:prose-p:text-xl prose-a:text-[#8406f9] hover:prose-a:text-[#4a048a] prose-strong:text-white prose-strong:font-bold prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight prose-blockquote:border-[#8406f9] prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-white/90">
             {article.content.split('\n').map((paragraph: string, idx: number) => {
                if (!paragraph.trim()) return <br key={idx} />;
                
                // Add a stylish drop cap to the very first paragraph for a premium magazine feel
                if (idx === 0) {
                  return (
                    <p key={idx} className="mb-8 leading-relaxed text-white/90">
                      <span className="float-left text-6xl md:text-7xl font-black text-[#8406f9] pr-4 pt-3 pb-2 leading-none drop-shadow-[0_0_15px_rgba(132,6,249,0.4)]">
                        {paragraph.charAt(0)}
                      </span>
                      {paragraph.substring(1)}
                    </p>
                  );
                }
                return <p key={idx} className="mb-8">{paragraph}</p>;
             })}
          </div>

          <div className="mt-24 pt-16 border-t border-white/10 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#8406f9]/20 blur-3xl rounded-full"></div>
            <h3 className="text-3xl font-black mb-4">Scale Your Empire.</h3>
            <p className="text-white/50 mb-10 max-w-lg mx-auto text-lg">Join the Elite Influencer community to get instant access to premium brand deals and high-value networking.</p>
            <a href="https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq" target="_blank" className="inline-block px-12 py-5 bg-[#8406f9] rounded-full font-bold text-lg hover:bg-[#8406f9]/90 transition-all text-white shadow-[0_0_30px_rgba(132,6,249,0.4)] hover:shadow-[0_0_50px_rgba(132,6,249,0.6)] hover:-translate-y-1 transform duration-300">
              Join Elite Community
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
