"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("Article not found or you don't have permission to edit it.");
        setLoading(false);
        return;
      }

      // Check permission
      if (data.author_id !== user.id) {
        setError("You do not have permission to edit this article.");
        setLoading(false);
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setImageUrl(data.image_url || "");
      setLoading(false);
    };

    fetchArticle();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("articles")
      .update({
        title,
        content,
        image_url: imageUrl || null
      })
      .eq("id", id);

    if (updateError) {
      setError("Failed to update the article.");
      setSaving(false);
      return;
    }

    router.push(`/feeds/${id}`);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;
    
    setSaving(true);
    const { error: deleteError } = await supabase.from("articles").delete().eq("id", id);
    
    if (deleteError) {
      setError("Failed to delete article.");
      setSaving(false);
      return;
    }
    
    router.push("/feeds");
    router.refresh();
  };

  if (loading) {
    return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading article...</div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Edit Article</h1>
          <button 
            type="button"
            onClick={handleDelete}
            className="text-red-500 font-bold hover:underline"
          >
            Delete Article
          </button>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Article Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8406f9] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Cover Image URL (Optional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8406f9] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Article Content</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8406f9] focus:border-transparent transition-all resize-y"
            />
          </div>

          <div className="flex gap-4 pt-6 border-t border-zinc-800">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-[#8406f9] text-white font-bold rounded-xl hover:bg-[#8406f9]/80 transition-colors shadow-[0_0_20px_rgba(132,6,249,0.3)] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => router.push(`/feeds/${id}`)}
              className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
