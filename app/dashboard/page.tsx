"use client";

import { useEffect, useState } from "react";
// Make sure this path is correct for your project structure
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    instagram: "",
    platform: "instagram", // Default
    platform_url: "",
    city: "",
    tagline: "",
    bio: "",
    followers: "",
    reach: "",
    brands: "",
    email: "",
    phone: "",
    is_available: true,
    video1_title: "", video1_url: "",
    video2_title: "", video2_url: "",
    video3_title: "", video3_url: "",
  });

  useEffect(() => {
    const getData = async () => {
      // 1. Check if User is Logged In
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.log("No user found, redirecting to login...");
        router.push("/login");
        return;
      }

      setUser(user);

      // 2. Try to fetch existing portfolio
      try {
        const { data, error } = await supabase
          .from("portfolios")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle(); // Use maybeSingle() to avoid error if no row exists

        if (error) {
          console.error("Error fetching data:", error.message);
        }

        if (data) {
          console.log("Found existing profile:", data);
          setFormData({
            username: data.username || "",
            full_name: data.full_name || "",
            instagram: data.stats?.instagram || "",
            platform: data.stats?.platform || "instagram",
            platform_url: data.stats?.platform_url || "",
            city: data.city || "",
            tagline: data.tagline || "",
            bio: data.bio || "",
            followers: data.stats?.followers || "",
            reach: data.stats?.reach || "",
            brands: data.brands ? data.brands.join(", ") : "",
            email: data.contact_email || "",
            phone: data.contact_phone || "",
            is_available: data.is_available ?? true,
            video1_title: data.work_links?.[0]?.title || "",
            video1_url: data.work_links?.[0]?.url || "",
            video2_title: data.work_links?.[1]?.title || "",
            video2_url: data.work_links?.[1]?.url || "",
            video3_title: data.work_links?.[2]?.title || "",
            video3_url: data.work_links?.[2]?.url || "",
          });
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [router]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!user) return;

      const brandsArray = formData.brands.split(",").map((s) => s.trim()).filter((s) => s);
      const videos = [];
      if (formData.video1_url) videos.push({ title: formData.video1_title, url: formData.video1_url });
      if (formData.video2_url) videos.push({ title: formData.video2_title, url: formData.video2_url });
      if (formData.video3_url) videos.push({ title: formData.video3_title, url: formData.video3_url });

      const payload = {
        user_id: user.id,
        username: formData.username.toLowerCase().replace(/\s/g, ""),
        full_name: formData.full_name,
        city: formData.city,
        tagline: formData.tagline,
        bio: formData.bio,
        contact_email: formData.email,
        contact_phone: formData.phone,
        brands: brandsArray,
        is_available: formData.is_available,
        stats: {
          followers: formData.followers,
          reach: formData.reach,
          instagram: formData.instagram,
          platform: formData.platform,
          platform_url: formData.platform_url,
        },
        work_links: videos,
      };

      // Check if a record already exists
      const { data: existingData } = await supabase
        .from("portfolios")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      let error;

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("portfolios")
          .update(payload)
          .eq("user_id", user.id);
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("portfolios")
          .insert(payload);
        error = insertError;
      }

      if (error) {
        alert("Database Error: " + error.message);
      } else {
        alert("Saved successfully!");
      }

    } catch (error: any) {
      alert("Error saving: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading your dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Dashboard</h1>
            <p className="text-white/50 text-sm">Welcome, {formData.full_name || "Creator"}</p>
          </div>
          <div className="flex gap-4">
            {formData.username && (
              <Link href={`/${formData.username}`} target="_blank" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                View Live Page
              </Link>
            )}
            <button onClick={handleLogout} className="text-red-500 text-sm font-bold hover:underline">
              Sign Out
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="bg-[#111] border border-white/10 rounded-2xl p-8 space-y-8">

          {/* Status */}
          <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
            <div>
              <h3 className="font-bold text-white">Availability Status</h3>
              <p className="text-xs text-white/50">Are you open for deals?</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_available"
                checked={formData.is_available}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          {/* Identity */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-[#8406f9] tracking-widest">1. Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="username" value={formData.username} onChange={handleChange} placeholder="Username (unique)" className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full" required />
              <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full" required />
            </div>
            {/* Replaced Instagram with Platform Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full appearance-none"
                >
                  <option value="instagram" className="bg-black text-white">Instagram</option>
                  <option value="youtube" className="bg-black text-white">YouTube</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <input name="platform_url" value={formData.platform_url} onChange={handleChange} placeholder="Profile URL (e.g. instagram.com/user)" className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kept City here, moved platform stuff above */}
              <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full" required />
            </div>
            <input name="tagline" value={formData.tagline} onChange={handleChange} placeholder="Tagline" className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full" />
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Bio..." className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full" />
          </div>

          {/* Social Proof */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-[#8406f9] tracking-widest">2. Social Proof</h3>
            <div className="grid grid-cols-2 gap-4">
              <input name="followers" value={formData.followers} onChange={handleChange} placeholder="Followers (e.g. 10k)" className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full" />
              <input name="reach" value={formData.reach} onChange={handleChange} placeholder="Monthly Reach" className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full" />
            </div>
            <input name="brands" value={formData.brands} onChange={handleChange} placeholder="Brands (comma separated)" className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full" />
          </div>

          {/* Work */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-[#8406f9] tracking-widest">3. Best Work</h3>
            {[1, 2, 3].map((num) => (
              <div key={num} className="grid grid-cols-2 gap-4">
                <input
                  name={`video${num}_title`}
                  // @ts-ignore
                  value={formData[`video${num}_title`]}
                  onChange={handleChange}
                  placeholder={`Video ${num} Title`}
                  className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full text-sm"
                />
                <input
                  name={`video${num}_url`}
                  // @ts-ignore
                  value={formData[`video${num}_url`]}
                  onChange={handleChange}
                  placeholder={`Video ${num} URL`}
                  className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full text-sm"
                />
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-[#8406f9] tracking-widest">4. Contact</h3>
            <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Business Email" className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full" required />
            <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="WhatsApp Number" className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full" />
          </div>

          <button disabled={saving} type="submit" className="w-full bg-[#8406f9] hover:bg-[#8406f9]/80 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(132,6,249,0.4)] disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes 💾"}
          </button>
        </form>
      </div>
    </div>
  );
}