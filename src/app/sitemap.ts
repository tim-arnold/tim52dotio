import { MetadataRoute } from 'next'

export const dynamic = 'force-static'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://tim52.io',
      lastModified: new Date('2025-08-07'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://tim52.io/portfolio',
      lastModified: new Date('2025-08-07'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}