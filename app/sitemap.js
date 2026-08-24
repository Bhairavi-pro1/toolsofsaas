import { client } from '@/sanity/lib/client';
import { ALL_TOOL_SLUGS_QUERY, POSTS_QUERY } from '@/sanity/lib/queries';

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsofsaas.com';

  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/affiliate-disclosure`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/tools/random-team-generator`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tools/chore-assigner`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  let toolRoutes = [];
  let blogRoutes = [];

  try {
    const toolSlugs = await client.fetch(ALL_TOOL_SLUGS_QUERY);
    if (toolSlugs && toolSlugs.length > 0) {
      toolRoutes = toolSlugs.map((slug) => ({
        url: `${siteUrl}/tool/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      }));
    }

    const posts = await client.fetch(POSTS_QUERY);
    if (posts && posts.length > 0) {
      blogRoutes = posts.map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.75,
      }));
    }
  } catch (error) {
    console.error('Error populating dynamic sitemap routes:', error);
  }

  return [...staticRoutes, ...toolRoutes, ...blogRoutes];
}

