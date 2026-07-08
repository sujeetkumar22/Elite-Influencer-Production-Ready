"use client";

import { useEffect, useState } from "react";
// Make sure this path is correct for your project structure
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { toast } from "@/components/Toast";

// Usernames that would collide with app routes or look official
const RESERVED_USERNAMES = [
  "dashboard", "marketplace", "feeds", "login", "logout", "signup",
  "register", "api", "auth", "creator-calc", "privacy", "terms",
  "admin", "about", "contact", "settings", "profile", "home", "help",
  "support", "blog", "creators", "events", "elite", "eliteinfluencer",
];

const USERNAME_REGEX = /^[a-z0-9_.]{3,30}$/;

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");

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
    engagement: "",
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

      // Check admin status (controls offers/articles management UI)
      supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => setIsAdmin(!!data));

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
          setProfileImage(data.profile_image || null);
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
            engagement: data.stats?.engagement || "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    if (name === "username") setUsernameStatus("idle");
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const normalizeUsername = (raw: string) =>
    raw.toLowerCase().trim().replace(/\s/g, "");

  // Validate format + reserved words + uniqueness. Returns error string or null.
  const validateUsername = async (raw: string): Promise<string | null> => {
    const username = normalizeUsername(raw);
    if (!USERNAME_REGEX.test(username)) {
      return "Username must be 3-30 characters: lowercase letters, numbers, dots or underscores.";
    }
    if (RESERVED_USERNAMES.includes(username)) {
      return "This username is reserved. Please choose another.";
    }
    const { data } = await supabase
      .from("portfolios")
      .select("user_id")
      .eq("username", username)
      .maybeSingle();
    if (data && data.user_id !== user?.id) {
      return "This username is already taken.";
    }
    return null;
  };

  const checkUsernameAvailability = async () => {
    if (!formData.username) return;
    setUsernameStatus("checking");
    const error = await validateUsername(formData.username);
    if (!error) {
      setUsernameStatus("available");
    } else if (error.includes("taken") || error.includes("reserved")) {
      setUsernameStatus("taken");
    } else {
      setUsernameStatus("invalid");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast("Image must be under 5MB.", "error");
      return;
    }

    setUploadingImage(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setProfileImage(data.publicUrl);
      toast("Photo uploaded! Remember to save your changes.", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast("Upload failed: " + message, "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!user) return;

      // Validate username before writing anything
      const usernameError = await validateUsername(formData.username);
      if (usernameError) {
        toast(usernameError, "error");
        setSaving(false);
        return;
      }

      const brandsArray = formData.brands.split(",").map((s) => s.trim()).filter((s) => s);
      const videos = [];
      if (formData.video1_url) videos.push({ title: formData.video1_title, url: formData.video1_url });
      if (formData.video2_url) videos.push({ title: formData.video2_title, url: formData.video2_url });
      if (formData.video3_url) videos.push({ title: formData.video3_title, url: formData.video3_url });

      const payload = {
        user_id: user.id,
        username: normalizeUsername(formData.username),
        full_name: formData.full_name,
        city: formData.city,
        tagline: formData.tagline,
        bio: formData.bio,
        contact_email: formData.email,
        contact_phone: formData.phone,
        brands: brandsArray,
        is_available: formData.is_available,
        profile_image: profileImage,
        stats: {
          followers: formData.followers,
          reach: formData.reach,
          engagement: formData.engagement,
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
        toast("Database error: " + error.message, "error");
      } else {
        toast("Portfolio saved successfully!", "success");
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast("Error saving: " + message, "error");
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
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link href="/" className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
              Home
            </Link>
            {formData.username && (
              <Link href={`/${formData.username}`} target="_blank" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                View Live Page
              </Link>
            )}
            {isAdmin && (
              <>
                <Link href="/dashboard/offers" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  Manage Brand Deals
                </Link>
                <Link href="/dashboard/feeds/create" className="bg-[#8406f9]/80 hover:bg-[#8406f9] px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  New Article
                </Link>
              </>
            )}
            <button onClick={handleLogout} className="text-red-500 text-sm font-bold hover:underline">
              Sign Out
            </button>
          </div>
        </div>

        {/* Share & Badge SEO Widgets */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 mb-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8406f9]">share</span> Share Your Portfolio & Boost SEO
            </h2>
            <p className="text-white/60 text-sm">
                Add your portfolio link to your social media bios to get discovered by brands. You can also copy your Verified Badge HTML code below and add it to your personal blog or website to build authority.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 block">Your Portfolio Link</label>
                    <div className="flex gap-2">
                        <input 
                            readOnly 
                            value={formData.username ? `https://eliteinfluencer.in/${formData.username}` : "Save your username to get your link"} 
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white/80 w-full outline-none"
                        />
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                if (!formData.username) return;
                                navigator.clipboard.writeText(`https://eliteinfluencer.in/${formData.username}`);
                                alert("Link copied!");
                            }}
                            className="bg-white/10 hover:bg-white/20 px-4 rounded-lg text-xs font-bold transition-colors"
                        >
                            Copy
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 block">Verified Badge Widget (HTML)</label>
                    <div className="flex gap-2">
                        <textarea 
                            readOnly 
                            rows={1}
                            value={`<a href="https://eliteinfluencer.in" target="_blank" style="display:inline-flex;align-items:center;background:#111;color:#fff;border:1px solid #8406f9;padding:8px 16px;border-radius:8px;font-family:sans-serif;font-weight:bold;text-decoration:none;font-size:12px;gap:8px;"><span style="color:#8406f9;font-size:14px;">★</span> Verified by Elite Influencer</a>`} 
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white/80 w-full outline-none resize-none font-mono"
                        />
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                navigator.clipboard.writeText(`<a href="https://eliteinfluencer.in" target="_blank" style="display:inline-flex;align-items:center;background:#111;color:#fff;border:1px solid #8406f9;padding:8px 16px;border-radius:8px;font-family:sans-serif;font-weight:bold;text-decoration:none;font-size:12px;gap:8px;"><span style="color:#8406f9;font-size:14px;">★</span> Verified by Elite Influencer</a>`);
                                alert("Badge HTML copied!");
                            }}
                            className="bg-white/10 hover:bg-white/20 px-4 rounded-lg text-xs font-bold transition-colors"
                        >
                            Copy
                        </button>
                    </div>
                </div>
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

            {/* Profile Photo */}
            <div className="flex items-center gap-5 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#0a0a0a] border border-white/10 flex items-center justify-center shrink-0">
                {profileImage ? (
                  <Image src={profileImage} alt="Profile" fill className="object-cover" sizes="80px" />
                ) : (
                  <span className="text-2xl font-black text-white/20">
                    {formData.full_name?.[0]?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <div>
                <label className="inline-block bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors">
                  {uploadingImage ? "Uploading..." : profileImage ? "Change Photo" : "Upload Photo"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
                </label>
                <p className="text-xs text-white/40 mt-2">JPG or PNG, up to 5MB. Brands trust profiles with real photos.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={checkUsernameAvailability}
                  placeholder="Username (unique)"
                  className={`bg-white/5 border rounded-lg p-3 text-white w-full ${
                    usernameStatus === "available" ? "border-green-500/50" :
                    usernameStatus === "taken" || usernameStatus === "invalid" ? "border-red-500/50" :
                    "border-white/10"
                  }`}
                  required
                />
                {usernameStatus === "checking" && <p className="text-xs text-white/40 mt-1">Checking availability…</p>}
                {usernameStatus === "available" && <p className="text-xs text-green-500 mt-1">✓ Username available — your page will be eliteinfluencer.in/{normalizeUsername(formData.username)}</p>}
                {usernameStatus === "taken" && <p className="text-xs text-red-500 mt-1">✕ This username is taken or reserved.</p>}
                {usernameStatus === "invalid" && <p className="text-xs text-red-500 mt-1">✕ Use 3-30 lowercase letters, numbers, dots or underscores.</p>}
              </div>
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <input name="followers" value={formData.followers} onChange={handleChange} placeholder="Followers (e.g. 10k)" className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full" />
              <input name="reach" value={formData.reach} onChange={handleChange} placeholder="Monthly Reach" className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full" />
              <input name="engagement" value={formData.engagement} onChange={handleChange} placeholder="Engagement Rate (e.g. 4.5%)" className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full" />
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
                  value={formData[`video${num}_title` as keyof typeof formData] as string}
                  onChange={handleChange}
                  placeholder={`Video ${num} Title`}
                  className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full text-sm"
                />
                <input
                  name={`video${num}_url`}
                  value={formData[`video${num}_url` as keyof typeof formData] as string}
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