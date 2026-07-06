import { unstable_cache } from "next/cache";

export interface CityEvent {
    title: string;
    venue: string;
    dates: string;
    category: string;
    description: string;
    why_instagrammable: string;
    link: string;
}

// City allowlist — keeps the Gemini budget bounded and blocks prompt
// injection. Each city gets its own static URL (/events/<slug>) so it
// can rank individually on Google.
export interface CityInfo {
    slug: string;
    name: string;
    /** Areas mentioned in SEO copy so the page reads locally authentic */
    areas: string;
}

export const CITY_INFO: CityInfo[] = [
    { slug: "delhi-ncr", name: "Delhi NCR", areas: "Delhi, Gurugram and Noida" },
    { slug: "mumbai", name: "Mumbai", areas: "South Bombay, Bandra and Lower Parel" },
    { slug: "pune", name: "Pune", areas: "Koregaon Park, Viman Nagar and Baner" },
    { slug: "hyderabad", name: "Hyderabad", areas: "Jubilee Hills, Gachibowli and Hitech City" },
];

export function cityBySlug(slug?: string): CityInfo | undefined {
    if (!slug) return undefined;
    return CITY_INFO.find((c) => c.slug === slug.toLowerCase().trim());
}

export function cityByName(name?: string): CityInfo | undefined {
    if (!name) return undefined;
    return CITY_INFO.find((c) => c.name.toLowerCase() === name.toLowerCase().trim());
}

const CATEGORIES = ["Music", "Art", "Food", "Culture", "Nightlife", "Market", "Festival", "Exhibition", "Sports", "Other"];

async function fetchEventsFromGemini(city: string): Promise<CityEvent[]> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return [];

    const monthYear = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const prompt = `Search the web and find 8 REAL events happening now or coming up in ${city}, India (today is ${monthYear}) that are highly "instagrammable" — visually spectacular places/experiences where content creators can shoot great photos and reels (immersive art shows, flea markets, music festivals, food carnivals, light installations, exhibitions, themed pop-ups, cultural festivals).

Return ONLY a JSON array, no markdown, no commentary. Each item must have exactly these fields:
- "title": event name
- "venue": venue name and area
- "dates": human-readable dates or "Ongoing" (keep short)
- "category": one of ${CATEGORIES.join(", ")}
- "description": what the event is, max 25 words
- "why_instagrammable": what makes it great for content, max 15 words
- "link": the official event page or ticketing page URL (BookMyShow, District, Paytm Insider, AllEvents or the venue's site). If you are not confident the URL is real, use an empty string "".

Only include events you found via search. Do not invent events.`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    tools: [{ google_search: {} }],
                    generationConfig: {
                        temperature: 0.3,
                        // Thinking tokens count against maxOutputTokens and can
                        // silently consume the whole budget — disable it here.
                        thinkingConfig: { thinkingBudget: 0 },
                        maxOutputTokens: 8192,
                    },
                }),
                signal: AbortSignal.timeout(45000),
            }
        );

        if (!response.ok) {
            console.error("Gemini events fetch failed:", response.status, await response.text());
            return [];
        }

        const data = await response.json();
        const text: string =
            data.candidates?.[0]?.content?.parts
                ?.map((p: { text?: string }) => p.text || "")
                .join("") || "";

        // Extract the JSON array even if the model wrapped it in prose/fences
        const start = text.indexOf("[");
        const end = text.lastIndexOf("]");
        if (start === -1 || end === -1 || end <= start) {
            console.error(
                "Gemini events: no JSON array in response.",
                "finishReason:", data.candidates?.[0]?.finishReason,
                "textLength:", text.length
            );
            return [];
        }

        const parsed: unknown = JSON.parse(text.slice(start, end + 1));
        if (!Array.isArray(parsed)) return [];

        return parsed
            .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
            .map((e) => ({
                title: String(e.title || "").slice(0, 120),
                venue: String(e.venue || "").slice(0, 120),
                dates: String(e.dates || "").slice(0, 80),
                category: CATEGORIES.includes(String(e.category)) ? String(e.category) : "Other",
                description: String(e.description || "").slice(0, 220),
                why_instagrammable: String(e.why_instagrammable || "").slice(0, 140),
                link: /^https?:\/\//.test(String(e.link || "")) ? String(e.link) : "",
            }))
            .filter((e) => e.title)
            .slice(0, 9);
    } catch (error) {
        console.error("Gemini events fetch error:", error);
        return [];
    }
}

// Throw on empty so unstable_cache never caches a failed fetch for 24h
// (rejected promises are not cached — the next visitor triggers a retry).
async function fetchEventsOrThrow(city: string): Promise<CityEvent[]> {
    const events = await fetchEventsFromGemini(city);
    if (events.length === 0) throw new Error(`No events fetched for ${city}`);
    return events;
}

const cachedCityEvents = unstable_cache(fetchEventsOrThrow, ["city-events-v2"], {
    revalidate: 86400,
});

// Cache per city for 24h — events don't change hourly, and this keeps
// Gemini usage to at most (number of cities) calls per day.
export async function getCityEvents(city: string): Promise<CityEvent[]> {
    try {
        return await cachedCityEvents(city);
    } catch {
        return [];
    }
}
