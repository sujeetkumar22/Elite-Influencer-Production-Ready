import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { brandName, niche, tone } = await req.json();

        if (!brandName || !niche || !tone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const prompt = `You are an elite content creator in the ${niche} space writing an outreach pitch. 
Write a personalized, highly engaging brand pitch to ${brandName} directly from yourself.
Tone of voice: ${tone}.
Goal: Highlight why you are a great fit for their brand, propose a high-value content idea, and invite them to a quick alignment call.
Important: Output ONLY the pitch text. Do not use generic placeholders like [Your Name]. Use "[Creator Name]" and "[Portfolio Link]" where needed so you can easily replace them before sending. Keep it concise, impactful, and ready to send.`;

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
