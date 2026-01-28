# Deployment Guide for Elite Influencer

Ready to go live? Follow these steps to deploy your Next.js application to production (Vercel is recommended).

## 1. Environment Variables (Critical)
When you deploy, your local `.env.local` file is **NOT** uploaded for security reasons. You must manually add these keys to your hosting dashboard.

**Keys to Add:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Where to find them:**
Check your local `.env.local` file.

**How to add (Vercel):**
1. Go to your Project Settings.
2. Click **Environment Variables**.
3. Add both keys and their values.
4. Redeploy if necessary.

## 2. Database Security
Before sharing your site publicly, you **MUST** secure your database.
1. Open the [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor**.
3. Copy the contents of `database_schema.sql` (found in your project root).
4. Run the query.

This will:
- Create the tables (if they don't exist).
- **Enable Row Level Security (RLS)**.
- Create policies so users can only edit *their own* portfolios.

## 3. Deploy
1. Push your code to GitHub.
2. Import the repository in Vercel.
3. Configure the Environment Variables (Step 1).
4. Click **Deploy**.

🚀 Your Creator Empire is ready to scale!
