import { NextResponse } from 'next/server';
import { generateAndPublishDailyArticle } from '@/utils/article-generator';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const authHeader = req.headers.get('authorization');
        const token = searchParams.get('key') || authHeader?.replace('Bearer ', '');

        const cronSecret = process.env.CRON_SECRET;

        // Security protection: require valid CRON_SECRET if configured in environment
        if (cronSecret && token !== cronSecret) {
            return NextResponse.json({ error: 'Unauthorized: Invalid cron secret' }, { status: 401 });
        }

        const isDryRun = searchParams.get('dryRun') === 'true';
        const topic = searchParams.get('topic') || undefined;

        const result = await generateAndPublishDailyArticle({
            dryRun: isDryRun,
            forcedTopic: topic
        });

        return NextResponse.json({
            success: true,
            article: result
        });
    } catch (error: any) {
        console.error('Auto-publish cron error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    return GET(req);
}
