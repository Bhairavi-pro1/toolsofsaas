import { client } from '@/sanity/lib/client';
import { TOOLS_SITEMAP_QUERY, POSTS_QUERY } from '@/sanity/lib/queries';

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsofsaas.com';

  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
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
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/affiliate-disclosure`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
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
    const tools = await client.fetch(TOOLS_SITEMAP_QUERY);
    if (tools && tools.length > 0) {
      toolRoutes = tools
        .filter((t) => t && t.slug)
        .map((t) => ({
          url: `${siteUrl}/tool/${t.slug}`,
          lastModified: t._updatedAt ? new Date(t._updatedAt) : t._createdAt ? new Date(t._createdAt) : new Date(),
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

