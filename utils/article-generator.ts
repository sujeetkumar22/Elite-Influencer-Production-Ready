import { createClient } from '@supabase/supabase-js';

export interface GeneratedArticleResult {
    id: string;
    title: string;
    wordCount: number;
    imageUrl: string;
    topic: string;
    publishedAt: string;
}

// Curated high-aesthetic Unsplash images for creator & influencer topics as robust fallbacks
const TOPIC_IMAGES: Record<string, string[]> = {
    monetization: [
        'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1200&q=80'
    ],
    creator_studio: [
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80'
    ],
    social_media: [
        'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80'
    ],
    luxury_lifestyle: [
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80'
    ]
};

function selectFallbackImage(keyword: string): string {
    const lower = keyword.toLowerCase();
    let category = 'creator_studio';
    if (lower.includes('money') || lower.includes('deal') || lower.includes('rate') || lower.includes('price') || lower.includes('contract')) {
        category = 'monetization';
    } else if (lower.includes('instagram') || lower.includes('youtube') || lower.includes('tiktok') || lower.includes('algorithm') || lower.includes('viral')) {
        category = 'social_media';
    } else if (lower.includes('brand') || lower.includes('luxury') || lower.includes('elite') || lower.includes('lifestyle')) {
        category = 'luxury_lifestyle';
    }
    const list = TOPIC_IMAGES[category] || TOPIC_IMAGES.creator_studio;
    return list[Math.floor(Math.random() * list.length)];
}

export async function generateAndPublishDailyArticle(options?: {
    dryRun?: boolean;
    forcedTopic?: string;
}): Promise<GeneratedArticleResult> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!supabaseUrl || (!serviceRoleKey && !anonKey)) {
        throw new Error('Supabase environment variables (URL or Key) are missing.');
    }
    if (!geminiKey) {
        throw new Error('GEMINI_API_KEY is not configured in environment.');
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey || anonKey!, {
        auth: { persistSession: false }
    });

    // If using anonKey and admin credentials exist, authenticate the session
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    let authenticatedUserId: string | null = null;

    if (!serviceRoleKey && adminEmail && adminPassword) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: adminPassword
        });
        if (authError) {
            console.warn(`⚠️ Warning: Admin auth login failed (${authError.message}). Attempting unauthenticated request.`);
        } else if (authData.user) {
            authenticatedUserId = authData.user.id;
        }
    }

    // 1. Fetch recent article titles to prevent topic duplication
    const { data: recentArticles } = await supabase
        .from('articles')
        .select('title')
        .order('created_at', { ascending: false })
        .limit(30);

    const existingTitles = (recentArticles || []).map((a) => a.title).join('\n- ');

    // 2. Discover trending topic using Gemini
    let targetTopic = options?.forcedTopic;

    if (!targetTopic) {
        const topicDiscoveryPrompt = `You are the Head of SEO and Editorial Strategy for "Elite Influencer" (eliteinfluencer.in), the premier platform for high-earning creators, influencers, and digital brands.

Here are our recently published article headlines:
- ${existingTitles || 'No articles yet.'}

Identify 1 fresh, highly searchable, trending topic for TODAY in the creator economy that creators and influencers are actively searching for on Google.
Focus on high search intent topics such as:
- How to price brand deals & calculate creator rates
- Instagram Reels / TikTok / YouTube Shorts algorithm updates & monetization
- Pitching luxury & high-ticket brands (templates & psychology)
- UGC (User Generated Content) strategies for beginners & pros
- Influencer contract red flags, licensing terms & usage rights
- Creator business structures, invoicing & taxes

Output ONLY a JSON object with this exact format:
{
  "title": "A compelling, high-CTR, SEO-optimized title under 60 characters",
  "targetKeyword": "main target search keyword",
  "searchIntent": "Informational / Practical Guide",
  "imageSearchTerm": "e.g. podcast studio lighting"
}`;

        const topicRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: topicDiscoveryPrompt }] }],
                    generationConfig: {
                        temperature: 0.8,
                        responseMimeType: 'application/json'
                    }
                })
            }
        );

        if (!topicRes.ok) {
            const errText = await topicRes.text();
            throw new Error(`Gemini topic discovery failed (${topicRes.status}): ${errText}`);
        }

        const topicData = await topicRes.json();
        const rawJson = topicData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawJson) throw new Error('No topic generated from Gemini.');
        
        const parsedTopic = JSON.parse(rawJson);
        targetTopic = parsedTopic.title;
    }

    // 3. Generate Full SEO Article Content
    const contentPrompt = `You are an elite, high-earning creator strategist writing a masterclass guide for "Elite Influencer" (eliteinfluencer.in).

Article Title: "${targetTopic}"

Write a comprehensive, deep, authoritative, and actionable 1,200 to 1,800-word article formatted in clean Markdown.

CRITICAL FORMATTING & SEO RULES:
1. Do NOT repeat the H1 title in the body (the website header renders the title).
2. Start immediately with a punchy 2-paragraph hook and executive summary that answers the core question for Google Featured Snippets.
3. Structure with 4 to 6 major sections using "## Section Heading" and sub-sections with "### Sub-heading".
4. Include concrete examples, realistic pricing numbers (e.g. $500, $5,000 CPM calculations), step-by-step checklists, and real brand negotiation tactics.
5. Add a dedicated "## Frequently Asked Questions" section at the end with 3 common questions and crisp answers.
6. Contextual Call-to-Actions (CTAs):
   - Mention our free rate calculator: "[CreatorCalc](/creator-calc)" when discussing pricing/rates.
   - Mention our brand opportunities: "[Brand Marketplace](/marketplace)" when discussing pitching brands.
   - Mention our creator network: "[Elite Influencer Community](https://chat.whatsapp.com/LSM4Vmw3z1cAzjD90QUmtq)" in the conclusion.
7. Tone: Confident, modern, high-value, actionable, and zero fluff.

Output ONLY the markdown content.`;

    const contentRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: contentPrompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 5000
                }
            })
        }
    );

    if (!contentRes.ok) {
        const errText = await contentRes.text();
        throw new Error(`Gemini content generation failed (${contentRes.status}): ${errText}`);
    }

    const contentData = await contentRes.json();
    const articleMarkdown = contentData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!articleMarkdown) {
        throw new Error('No article content generated.');
    }
    if (!targetTopic) {
        throw new Error('Failed to determine a target topic.');
    }

    // 4. Determine cover image
    const coverImage = selectFallbackImage(targetTopic);

    const wordCount = articleMarkdown.split(/\s+/).filter(Boolean).length;

    // 5. If dry run, return without inserting into database
    if (options?.dryRun) {
        return {
            id: 'dry-run-preview',
            title: targetTopic,
            wordCount,
            imageUrl: coverImage,
            topic: targetTopic,
            publishedAt: new Date().toISOString()
        };
    }

    // 6. Find an author ID to assign the article to
    let authorId = authenticatedUserId || process.env.ADMIN_USER_ID;

    if (!authorId) {
        // Try getting any existing author_id from existing articles or portfolios
        const { data: existingArticle } = await supabase
            .from('articles')
            .select('author_id')
            .limit(1)
            .maybeSingle();

        if (existingArticle?.author_id) {
            authorId = existingArticle.author_id;
        } else {
            const { data: existingPortfolio } = await supabase
                .from('portfolios')
                .select('user_id')
                .limit(1)
                .maybeSingle();
            if (existingPortfolio?.user_id) {
                authorId = existingPortfolio.user_id;
            }
        }
    }

    if (!authorId) {
        throw new Error('No admin author_id found. Please provide ADMIN_USER_ID in environment variables or publish a portfolio first.');
    }

    // 7. Insert into Supabase
    const { data: inserted, error: insertError } = await supabase
        .from('articles')
        .insert({
            title: targetTopic,
            content: articleMarkdown,
            author_id: authorId,
            published: true,
            image_url: coverImage
        })
        .select('id, title, created_at')
        .single();

    if (insertError) {
        if (insertError.message.includes('row-level security') || insertError.code === '42501') {
            throw new Error(
                `Supabase RLS policy blocked the automated insert.\n` +
                `👉 Fix: Add your SUPABASE_SERVICE_ROLE_KEY to .env.local (and GitHub Actions Secrets).\n` +
                `Where to find it: Supabase Dashboard -> Project Settings -> API -> 'service_role' key.`
            );
        }
        throw new Error(`Supabase insert failed: ${insertError.message}`);
    }

    return {
        id: inserted.id,
        title: inserted.title,
        wordCount,
        imageUrl: coverImage,
        topic: targetTopic,
        publishedAt: inserted.created_at
    };
}
