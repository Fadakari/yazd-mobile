import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akhoondigroup.ir';
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/profile', '/payment', '/marketer', '/api'],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    }
}
