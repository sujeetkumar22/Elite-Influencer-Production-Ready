-- SQL Migration to Seed SEO Blog Articles in Supabase
-- Paste and run this script in your Supabase SQL Editor.
-- Make sure to replace the author_id with your admin user ID if it is different.
-- The current admin ID in your database is: ff52f340-3eb3-4a0d-ba6f-e1bed3f64a65

INSERT INTO articles (id, title, content, author_id, published, image_url, created_at)
VALUES 
(
  'e6b8c9d0-256d-41a3-b67f-5d2ef340fa01',
  'How to Pitch to Brands (with 5 Free Templates)',
  E'Securing paid brand collaborations as a creator starts with a single, highly effective email. Sending a cold pitch can feel intimidating, but brands are constantly looking for authentic creators who align with their audience.

The secret to a successful pitch is personalization, direct value, and proof. Instead of writing a generic message asking for "collab opportunities," you need to show the brand why partnering with you will drive real results for them. Here is a step-by-step guide and 5 proven email templates.

Step 1: Research the Brand. Find the exact name of their influencer marketing manager or PR contact. Do not send your pitch to generic info@ or support@ emails unless absolutely necessary.
Step 2: State Your Value Proposition. What makes your audience unique? Highlight your niche and engagement.
Step 3: Propose a Specific Concept. Instead of asking what they want, pitch a concrete idea like a dedicated reel or integration that showcases their key features.
Step 4: Provide Proof. Link to your professional portfolio showing your views, reach, and past work.
Step 5: Call to Action. Ask for a brief 5-minute chat to discuss the concept.

To make pitching effortless, you can use our built-in AI Pitch Generator on the home page (https://eliteinfluencer.in/#ai-pitch). It instantly generates custom pitches based on your stats.

Before you email a brand, always calculate your defensible rates using CreatorCalc (https://eliteinfluencer.in/creator-calc) so you know exactly what to charge when they reply.

--- TEMPLATE 1: THE DEDICATED REEL PITCH ---
Subject: Collaboration Idea: [Brand Name] x [Your Name]

Hi [Contact Name],

I\'ve been using [Product Name] for my content creation workflow, and I am a huge fan of what you\'re building.

I\'m a content creator in the [Your Niche] space, where I help [Your Audience Size/Niche details] creators optimize their personal brands. My audience is highly engaged (averaging [Average Views] views per post) and actively looks to me for recommendations.

I have a specific concept for a dedicated Reel: "3 Hacks to [Solve a User Pain Point] using [Brand\'s Product]." This format naturally integrates [Product Name] and demonstrates its immediate value.

You can view my full media kit, verified reach, and audience demographics here: [Your Portfolio Link]

Would you be open to a quick chat this week to see if we can bring this to life?

Best,
[Your Name]',
  'ff52f340-3eb3-4a0d-ba6f-e1bed3f64a65',
  true,
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1000',
  NOW()
),
(
  'e6b8c9d0-256d-41a3-b67f-5d2ef340fa02',
  'What is a Media Kit & How to Create One',
  E'A media kit is a creator\'s resume. It is a professional document that showcases your personal brand, audience demographics, key stats, and past collaborations. 

When you reach out to brands for paid collaborations, sending a media kit immediately sets you apart from 99% of other creators. It proves you treat your content creation as a serious business.

Here is what every high-converting media kit must include:
1. Short Bio & Niche: Tell brands who you are and what kind of content you specialize in.
2. Verified Social Stats: Do not just list followers. Brands care about average views, monthly reach, and engagement rate.
3. Audience Demographics: Show where your viewers live, their age range, and their gender split. Brands need to know if your audience matches their target customers.
4. Best Work & Case Studies: Share links to your top-performing videos or previous brand collaborations with actual results.
5. Contact Details: Make it easy for brands to reach your business email or WhatsApp.

Instead of spending hours designing a static PDF that becomes outdated the moment your follower count changes, you should build a dynamic, web-based media kit. 

You can create a professional, real-time media kit in minutes using our free Portfolio Builder (https://eliteinfluencer.in/dashboard). Your portfolio automatically displays your availability status, verified stats, and latest videos, keeping it perfectly up-to-date for brands.',
  'ff52f340-3eb3-4a0d-ba6f-e1bed3f64a65',
  true,
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000',
  NOW()
),
(
  'e6b8c9d0-256d-41a3-b67f-5d2ef340fa03',
  'How to Negotiate Brand Deals as a Micro-Influencer',
  E'Negotiation is where most micro-influencers lose money. Many creators accept low-paying barter deals because they do not know what their content is worth or how to defend their pricing.

To negotiate brand campaigns successfully, you must shift the conversation from "follower count" to "business value" and "deliverable costs."

Rule 1: Base Your Rate on Average Views, Not Followers. Followers do not see your content—views do. Brands pay based on CPM (cost per thousand views). In India, standard CPMs range from ₹150 for gaming to ₹800+ for finance. 

Rule 2: Factor in Production Overhead. Creating high-quality video content takes time, equipment, and editing skills. Always charge a base production fee on top of your view-based rate to cover your time.

Rule 3: Charge Extra for Usage Rights. If a brand wants to run your video as a paid Instagram ad, they are amplifying your face to millions of people. Charge a usage rights multiplier (usually 1.5x for ad rights and 2x+ for perpetual buyouts).

To calculate exactly what you should charge for your next campaign, use CreatorCalc (https://eliteinfluencer.in/creator-calc). It applies real Indian market CPM benchmarks, engagement boosts, and usage rights multipliers to give you a solid, defensible quote to present to brands.

Never say "my rate is X." Say "Based on my average reach, production costs, and ad usage rights, the investment for this campaign is X." This completely changes the negotiation dynamics.',
  'ff52f340-3eb3-4a0d-ba6f-e1bed3f64a65',
  true,
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000',
  NOW()
);
