import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { client } from '@/sanity/lib/client';
import { POST_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import PageWrapper from '@/components/PageWrapper';
import AdBanner from '@/components/AdBanner';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let post = null;

  try {
    post = await client.fetch(POST_QUERY, { slug });
  } catch (error) {
    console.error('Error fetching metadata post:', error);
  }

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.mainImage
        ? [
            {
              url: urlFor(post.mainImage).url(),
              alt: post.title,
            },
          ]
        : [],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

const portableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value) return null;
      return (
        <div
          style={{
            position: 'relative',
            width: '100%',
            margin: '35px 0',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <img
            src={urlFor(value).url()}
            alt={value.alt || 'Post illustration'}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      );
    },
  },
  block: {
    normal: ({ children }) => <p style={{ marginBottom: '25px', lineHeight: '1.8' }}>{children}</p>,
    h2: ({ children }) => {
      const headingId = children
        ? children.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : '';
      return (
        <h2
          id={headingId}
          style={{
            fontSize: '30px',
            borderLeft: '4px solid var(--primary)',
            paddingLeft: '15px',
            margin: '40px 0 20px 0',
            color: 'var(--text-main)',
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: '700',
          }}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => (
      <h3
        style={{
          fontSize: '24px',
          margin: '30px 0 15px 0',
          color: 'var(--text-main)',
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: '600',
        }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          borderLeft: '4px solid var(--secondary)',
          paddingLeft: '20px',
          fontStyle: 'italic',
          margin: '30px 0',
          color: 'var(--text-main)',
        }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul
        style={{
          listStyleType: 'disc',
          paddingLeft: '25px',
          marginBottom: '25px',
          color: 'var(--text-muted)',
        }}
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        style={{
          listStyleType: 'decimal',
          paddingLeft: '25px',
          marginBottom: '25px',
          color: 'var(--text-muted)',
        }}
      >
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li style={{ marginBottom: '10px', lineHeight: '1.7', listStyle: 'inherit' }}>{children}</li>
    ),
    number: ({ children }) => (
      <li style={{ marginBottom: '10px', lineHeight: '1.7', listStyle: 'inherit' }}>{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong style={{ color: 'var(--text-main)', fontWeight: '600' }}>{children}</strong>
    ),
    code: ({ children }) => (
      <code
        style={{
          fontFamily: 'monospace',
          fontSize: '15px',
          background: 'var(--border)',
          padding: '2px 6px',
          borderRadius: '4px',
          color: 'var(--text-main)',
        }}
      >
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const rel = value?.href && !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <a
          href={value?.href || '#'}
          rel={rel}
          style={{ color: 'var(--primary)', textDecoration: 'underline' }}
        >
          {children}
        </a>
      );
    },
  },
};

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  let post = null;

  try {
    post = await client.fetch(POST_QUERY, { slug });
  } catch (error) {
    console.error('Error fetching post data:', error);
  }

  if (!post) {
    return (
      <PageWrapper>
        <div
          className="content-page"
          style={{
            textAlign: 'center',
            margin: '40px auto',
            maxWidth: '600px',
            padding: '40px',
          }}
        >
          <h2>Article Not Found</h2>
          <p style={{ marginTop: '15px' }}>
            The blog post you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="visit-btn"
            style={{ display: 'inline-block', marginTop: '20px' }}
          >
            Back to Blog
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  // Simple reading time estimation helper
  const wordCount = post.body
    ? post.body
        .filter((block) => block._type === 'block' && block.children)
        .map((block) => block.children.map((child) => child.text).join(' '))
        .join(' ')
        .split(/\s+/).length
    : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <PageWrapper>
      {/* Header Ad */}
      <AdBanner position="header" />

      <div className="post-page">
        <Link href="/blog" className="back-btn">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Articles
        </Link>

        <header className="post-header">
          <div className="post-meta">
            <span>{publishDate}</span>
            <span>{readingTime} min read</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
        </header>

        {post.mainImage && (
          <div className="post-hero-image">
            <img src={urlFor(post.mainImage).url()} alt={post.title} />
          </div>
        )}

        <article className="post-body">
          {post.body && (
            <PortableText value={post.body} components={portableTextComponents} />
          )}
        </article>
      </div>
    </PageWrapper>
  );
}
