import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { POSTS_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import PageWrapper from '@/components/PageWrapper';
import AdBanner from '@/components/AdBanner';

export const revalidate = 60;

export const metadata = {
  title: 'Blog - SaaS Insights, Tips & Web Tool Reviews',
  description:
    'Stay up to date with the latest SaaS tools, digital workflows, tutorials, and productivity guides on the ToolsOfSaaS blog.',
  keywords: [
    'SaaS blog',
    'web tools reviews',
    'productivity tips',
    'developer resources',
    'software tools guide',
  ],
  alternates: {
    canonical: '/blog',
  },
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
                    <img src={urlFor(post.mainImage).url()} alt={post.title} />
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
