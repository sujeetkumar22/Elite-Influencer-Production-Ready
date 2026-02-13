import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/auth/'],
        },
        sitemap: 'https://elite-influencer.com/sitemap.xml',
    }
}
