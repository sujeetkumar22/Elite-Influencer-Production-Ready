import { generateAndPublishDailyArticle } from '../utils/article-generator';
import * as fs from 'fs';
import * as path from 'path';

// Helper to load .env.local in development / standalone run if process.env values are missing
function loadLocalEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx > 0) {
                const key = trimmed.slice(0, eqIdx).trim();
                let val = trimmed.slice(eqIdx + 1).trim();
                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.slice(1, -1);
                }
                if (!process.env[key]) {
                    process.env[key] = val;
                }
            }
        }
    }
}

async function main() {
    loadLocalEnv();

    const args = process.argv.slice(2);
    const isDryRun = args.includes('--dry-run');
    const topicArg = args.find((a) => a.startsWith('--topic='));
    const forcedTopic = topicArg ? topicArg.split('=')[1] : undefined;

    console.log('=====================================================');
    console.log('🚀 ELITE INFLUENCER: AUTONOMOUS DAILY ARTICLE PUBLISHER');
    console.log('=====================================================');
    console.log(`⏰ Time: ${new Date().toISOString()}`);
    console.log(`⚙️  Mode: ${isDryRun ? 'DRY-RUN (Preview Only)' : 'LIVE PUBLISHING'}`);
    if (forcedTopic) console.log(`🎯 Forced Topic: "${forcedTopic}"`);
    console.log('-----------------------------------------------------');

    try {
        console.log('🔍 Step 1: Researching fresh SEO topic and trend analysis...');
        console.log('✍️  Step 2: Generating 1,500+ word deep masterclass article with Gemini...');
        console.log('📸 Step 3: Selecting curated high-resolution cover photo...');

        const result = await generateAndPublishDailyArticle({
            dryRun: isDryRun,
            forcedTopic
        });

        console.log('-----------------------------------------------------');
        console.log('✅ SUCCESS! Article generated and processed:');
        console.log(`📌 Title:       "${result.title}"`);
        console.log(`📊 Word Count:  ${result.wordCount} words`);
        console.log(`🖼️ Cover Image: ${result.imageUrl}`);
        console.log(`🆔 Article ID:  ${result.id}`);
        console.log(`🌐 Live URL:    https://eliteinfluencer.in/feeds/${result.id}`);
        console.log('=====================================================');
    } catch (err: any) {
        console.error('❌ FAILED to auto-publish article:', err.message || err);
        process.exit(1);
    }
}

main();
