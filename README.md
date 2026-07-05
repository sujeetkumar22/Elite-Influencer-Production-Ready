# Elite Influencer

The premier ecosystem for creators to build portfolios, discover high-ticket brand deals, and scale their personal brand. Live at [eliteinfluencer.in](https://eliteinfluencer.in).

## Features

- **Portfolio Builder** — creators build a public portfolio page at `eliteinfluencer.in/<username>` with photo, stats, work samples, and contact details
- **Brand Deals Marketplace** — curated brand collaboration offers (admin-posted)
- **Elite Journal (Feeds)** — articles on the creator economy (admin-posted)
- **CreatorCalc** — sponsored-content rate calculator with invoice download
- **AI Pitch Generator** — Gemini-powered brand outreach pitches, personalized with the logged-in creator's real stats

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Supabase](https://supabase.com) — Postgres, Auth (email + Google OAuth), Storage
- Google Gemini API (pitch generation)
- Deployed on Vercel

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` with:

   ```
   NEXT_PUBLIC_SUPABASE_URL=<your supabase project url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your supabase anon key>
   GEMINI_API_KEY=<your gemini api key>
   ```

3. Set up the database: run [database_schema.sql](database_schema.sql) and then
   [migration_security_fixes.sql](migration_security_fixes.sql) in the Supabase SQL Editor.
   The migration creates the `admins` table — insert your own user id there to get
   admin access (manage brand offers and articles).

4. Run the dev server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx               Landing page
  [username]/            Public creator portfolio pages (ISR, 60s)
  dashboard/             Creator dashboard (portfolio editor; admin: offers + articles)
  marketplace/           Brand deals listing
  feeds/                 Articles ("Elite Journal")
  creator-calc/          Rate calculator
  login/                 Auth (email/password + Google)
  auth/                  OAuth callback, logout, password reset
  api/generate-pitch/    Gemini pitch endpoint (rate-limited)
components/              Navbar, Footer, Toast, LeadForm, AIPitchGenerator, ArticleCard
utils/supabase/          Browser, server (cookie-aware), and public (cacheable) clients
middleware.ts            Session refresh + server-side /dashboard protection
```

## Security Notes

- Row Level Security is enabled on all tables — see `migration_security_fixes.sql`
- Only users in the `admins` table can create brand offers and articles
- Never commit `.env.local`, `client_secret*.json`, or recovery codes (gitignored)

## Authentication Setup

If you encounter "localhost refused to connect" or other auth issues, see
[DEPLOYMENT.md](DEPLOYMENT.md) for Supabase dashboard configuration steps.
