"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function CreateArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Get current user to use as author_id
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      setError("Authentication error. Please log in.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("articles").insert({
      title,
      content,
      author_id: user.id,
      published: true, // Auto-publish
      image_url: imageUrl || null
    });

    if (insertError) {
      console.error(insertError);
      setError("Failed to create the article.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh(); // Refresh dashboard data
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Article</h1>
        
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
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="e.g. How to Negotiate Brand Deals"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Cover Image URL (Optional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="e.g. https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Article Content</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-y"
              placeholder="Write the full content of your article here..."
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-zinc-800 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Article"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-8 py-3 border border-zinc-700 text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
