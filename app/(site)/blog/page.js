import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { POSTS_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import PageWrapper from '@/components/PageWrapper';
import AdBanner from '@/components/AdBanner';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsofsaas.com';

export const revalidate = 60;

export const metadata = {
  title: 'Blog – SaaS Insights, Tech Tutorials & Web Tool Reviews',
  description:
    'Stay up to date with the latest SaaS tools, digital workflows, software tutorials, and productivity guides on the ToolsOfSaaS blog.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog – SaaS Insights & Web Tool Reviews | ToolsOfSaaS',
    description:
      'Stay up to date with the latest SaaS tools, digital workflows, tutorials, and productivity guides.',
    url: `${siteUrl}/blog`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'ToolsOfSaaS Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog – SaaS Insights & Guides | ToolsOfSaaS',
    description: 'Explore the latest tutorials, SaaS reviews, and digital workflow guides.',
    images: [`${siteUrl}/og-image.png`],
  },
};

const blogSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Blog',
      '@id': `${siteUrl}/blog#blog`,
      url: `${siteUrl}/blog`,
      name: 'ToolsOfSaaS Blog',
      description: 'SaaS insights, software reviews, tutorials, and productivity workflows.',
      publisher: {
        '@type': 'Organization',
        name: 'ToolsOfSaaS',
        url: siteUrl,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${siteUrl}/blog#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${siteUrl}/blog`,
        },
      ],
    },
  ],
};

export default async function BlogPage() {
  let posts = [];
  try {
    posts = await client.fetch(POSTS_QUERY);
  } catch (error) {
    console.error('Failed to fetch posts from Sanity:', error);
  }

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      {/* Header Ad */}
      <AdBanner position="header" />

      <div className="blog-header">
        <h1>Insights & Guides</h1>
        <p>Stay up to date with the latest SaaS tools, digital workflows, and productivity guides.</p>
      </div>

      {posts.length === 0 ? (
        <div
          className="content-page"
          style={{
            textAlign: 'center',
            margin: '40px auto',
            maxWidth: '600px',
            padding: '40px',
          }}
        >
          <h2>No Articles Published Yet</h2>
          <p style={{ marginTop: '15px' }}>
            We are currently crafting some amazing articles and guides for you. Please check back soon!
          </p>
          <Link
            href="/"
            className="visit-btn"
            style={{ display: 'inline-block', marginTop: '20px' }}
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => {
            const publishDate = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Recently';

            return (
              <Link href={`/blog/${post.slug}`} key={post._id} className="blog-card">
                <div className="blog-card-image">
                  {post.mainImage ? (
                    <img
                      src={urlFor(post.mainImage).width(600).height(340).url()}
                      alt={post.title}
                      width={600}
                      height={340}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        opacity: 0.8,
                      }}
                    />
                  )}
                </div>
                <div className="blog-card-content">
                  <div className="blog-card-meta">{publishDate}</div>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-desc">{post.description}</p>
                  <div className="blog-card-footer">
                    Read Article
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}
