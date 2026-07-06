import { MetadataRoute } from 'next'
import { supabasePublic } from '@/utils/supabase/public'

const BASE_URL = 'https://eliteinfluencer.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
        { url: `${BASE_URL}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/feeds`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/creator-calc`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
        { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ]

    // Every public creator portfolio — free SEO for each creator
    const { data: portfolios } = await supabasePublic
        .from('portfolios')
        .select('username, updated_at')
        .limit(5000)

    const profilePages: MetadataRoute.Sitemap = (portfolios || []).map((p) => ({
        url: `${BASE_URL}/${p.username}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Published articles
    const { data: articles } = await supabasePublic
        .from('articles')
        .select('id, created_at')
        .eq('published', true)
        .limit(1000)

    const articlePages: MetadataRoute.Sitemap = (articles || []).map((a) => ({
        url: `${BASE_URL}/feeds/${a.id}`,
        lastModified: a.created_at ? new Date(a.created_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    return [...staticPages, ...profilePages, ...articlePages]
}
