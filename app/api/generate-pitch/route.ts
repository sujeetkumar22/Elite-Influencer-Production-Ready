import { NextResponse } from 'next/server';

// --- Simple in-memory rate limiter (per IP) ---
// Good enough for a single serverless region / small scale.
// For serious scale, swap for Upstash Redis (@upstash/ratelimit).
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 10; // per IP per hour
const hits = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = hits.get(ip);

    if (!entry || now - entry.windowStart > WINDOW_MS) {
        hits.set(ip, { count: 1, windowStart: now });
        return false;
    }

    entry.count += 1;
    return entry.count > MAX_REQUESTS;
}

// Prevent the map from growing forever
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
        if (now - entry.windowStart > WINDOW_MS) hits.delete(ip);
    }
}, WINDOW_MS).unref?.();

export async function POST(req: Request) {
    try {
        const ip =
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            req.headers.get('x-real-ip') ||
            'unknown';

        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again in an hour.' },
                { status: 429 }
            );
        }

        const { brandName, niche, tone, creator } = await req.json();

        if (!brandName || !niche || !tone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Cap input sizes so nobody can stuff huge prompts
        if (String(brandName).length > 100 || String(niche).length > 100) {
            return NextResponse.json({ error: 'Input too long' }, { status: 400 });
        }

        // Optional creator context (sent when the user is logged in and
        // has a portfolio) — makes the pitch ready-to-send with real data.
        let creatorContext = '';
        if (creator && typeof creator === 'object') {
            const name = String(creator.full_name || '').slice(0, 80);
            const followers = String(creator.followers || '').slice(0, 20);
            const reach = String(creator.reach || '').slice(0, 20);
            const portfolioUrl = String(creator.portfolio_url || '').slice(0, 120);
            const details = [
                name && `Creator name: ${name}`,
                followers && `Followers: ${followers}`,
                reach && `Monthly reach: ${reach}`,
                portfolioUrl && `Portfolio link: ${portfolioUrl}`,
            ].filter(Boolean).join('\n');
            if (details) {
                creatorContext = `\nUse these REAL creator details instead of placeholders:\n${details}\n`;
            }
        }

        const prompt = `You are an elite content creator in the ${niche} space writing an outreach pitch.
Write a personalized, highly engaging brand pitch to ${brandName} directly from yourself.
Tone of voice: ${tone}.
Goal: Highlight why you are a great fit for their brand, propose a high-value content idea, and invite them to a quick alignment call.
${creatorContext}
Important: Output ONLY the pitch text.${creatorContext ? '' : ' Do not use generic placeholders like [Your Name]. Use "[Creator Name]" and "[Portfolio Link]" where needed so you can easily replace them before sending.'} Keep it concise, impactful, and ready to send.`;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2000,
                }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API Error:', data);
            return NextResponse.json({ error: 'Failed to generate pitch' }, { status: 500 });
        }

        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return NextResponse.json({ text: generatedText });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
