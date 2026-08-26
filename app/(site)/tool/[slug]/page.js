import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { client } from '@/sanity/lib/client';
import { TOOL_BY_SLUG_QUERY, RELATED_TOOLS_QUERY, ALL_TOOL_SLUGS_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import PageWrapper from '@/components/PageWrapper';
import AdBanner from '@/components/AdBanner';
import ToolCard from '@/components/ToolCard';

export const revalidate = 60;

const portableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value) return null;
      return (
        <div className="tool-detail-portable-img-box">
          <img
            src={urlFor(value).url()}
            alt={value.alt || 'Tool illustration'}
            className="tool-detail-portable-img"
          />
        </div>
      );
    },
  },
  block: {
    normal: ({ children }) => <p className="tool-detail-p">{children}</p>,
    h2: ({ children }) => <h2 className="tool-detail-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="tool-detail-h3">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="tool-detail-quote">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="tool-detail-ul">{children}</ul>,
    number: ({ children }) => <ol className="tool-detail-ol">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="tool-detail-li">{children}</li>,
    number: ({ children }) => <li className="tool-detail-li">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    code: ({ children }) => <code>{children}</code>,
    link: ({ children, value }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="tool-detail-link"
        >
          {children}
        </a>
      );
    },
  },
};

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(ALL_TOOL_SLUGS_QUERY);
    return (slugs || []).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let tool = null;

  try {
    tool = await client.fetch(TOOL_BY_SLUG_QUERY, { slug });
  } catch (error) {
    console.error('Error fetching tool metadata:', error);
  }

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsofsaas.com';
  const pageTitle = `${tool.title} – Features, Pricing & Review`;
  const pageDesc = tool.description || `Explore ${tool.title} on ToolsOfSaaS. Check features, pricing, and launch the tool directly.`;

  return {
    title: pageTitle,
    description: pageDesc,
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      type: 'website',
      url: `${siteUrl}/tool/${slug}`,
      images: tool.iconImage
        ? [
            {
              url: urlFor(tool.iconImage).width(800).height(600).url(),
              alt: tool.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
    },
    alternates: {
      canonical: `/tool/${slug}`,
    },
  };
}

export default async function ToolDetailPage({ params }) {
  const { slug } = await params;
  let tool = null;
  let relatedTools = [];

  try {
    tool = await client.fetch(TOOL_BY_SLUG_QUERY, { slug });
    if (tool) {
      relatedTools = await client.fetch(RELATED_TOOLS_QUERY, { slug });
    }
  } catch (error) {
    console.error('Error fetching tool detail data:', error);
  }

  if (!tool) {
    return (
      <PageWrapper>
        <div className="tool-not-found">
          <h2>Tool Not Found</h2>
          <p>The tool you are looking for does not exist or has been removed from our directory.</p>
          <Link href="/" className="btn-primary" style={{ display: 'inline-flex', marginTop: '20px' }}>
            Explore All Tools
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const isUpcoming = tool._type === 'upcomingTool';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsofsaas.com';
  const isInternalLink = tool.href && tool.href.startsWith('/');
  const authorHandle = tool.author ? tool.author.toLowerCase().replace(/[^a-z0-9]/g, '') : null;
  const subtitleText = tool.subtitle || (authorHandle ? `${authorHandle}/${slug}` : (tool.tag || 'Web Tool'));

  let displayDomain = tool.officialDomain || '';
  if (!displayDomain && tool.href) {
    try {
      if (tool.href.startsWith('http')) {
        const parsed = new URL(tool.href);
        displayDomain = parsed.hostname.replace(/^www\./, '');
      } else {
        displayDomain = 'toolsofsaas.com';
      }
    } catch {
      displayDomain = 'web';
    }
  }

  // Structured Schema for WebApplication / SoftwareApplication
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    description: tool.description,
    url: `${siteUrl}/tool/${slug}`,
    applicationCategory: tool.tag ? tool.tag.replace('#', '') : 'UtilitiesApplication',
    operatingSystem: 'All / Web Browser',
    offers: {
      '@type': 'Offer',
      price: tool.badge === 'Free' || tool.pricing === 'Free' ? '0' : '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': tool.author ? 'Organization' : 'Organization',
      name: tool.author || 'ToolsOfSaaS',
    },
  };

  return (
    <PageWrapper>
      {/* Header Ad */}
      <AdBanner position="header" />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="tool-detail-container">
        {/* Breadcrumb Navigation */}
        <nav className="tool-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href="/" className="breadcrumb-link">Tools</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{tool.title}</span>
        </nav>

        {/* Hero Card */}
        <header className="tool-detail-hero">
          <div className="tool-detail-hero-content">
            <div className="tool-detail-icon-box">
              {tool.iconImage ? (
                <img
                  src={urlFor(tool.iconImage).width(160).height(160).url()}
                  alt={`${tool.title} logo`}
                  className="tool-detail-icon"
                  width={80}
                  height={80}
                />
              ) : (
                <div className="tool-detail-icon-fallback">
                  {tool.title.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="tool-detail-heading">
              <div className="tool-detail-badges">
                {isUpcoming ? (
                  <span className="badge badge-upcoming">Upcoming</span>
                ) : (
                  <span className="badge">{tool.badge || tool.pricing || 'Free'}</span>
                )}
                {tool.tag && <span className="tool-detail-tag-pill">{tool.tag}</span>}
              </div>

              <h1 className="tool-detail-title">{tool.title}</h1>
              <p className="tool-detail-handle">{subtitleText}</p>

              {/* Author Info — strictly no avatar if no image uploaded */}
              {tool.author && (
                <div className="tool-detail-author-row">
                  {tool.authorAvatar && (
                    <img
                      src={urlFor(tool.authorAvatar).width(56).height(56).url()}
                      alt={tool.author}
                      className="tool-detail-author-avatar"
                      width={28}
                      height={28}
                    />
                  )}
                  <span className="tool-detail-author-name">
                    By <strong>{tool.author}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons: Visit Tool Site */}
          <div className="tool-detail-actions">
            {isUpcoming ? (
              <div className="tool-visit-btn disabled">
                <span>Coming Soon</span>
              </div>
            ) : tool.href ? (
              isInternalLink ? (
                <Link href={tool.href} className="tool-visit-btn">
                  <span>Open Tool</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </Link>
              ) : (
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tool-visit-btn"
                >
                  <span>Visit Website</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              )
            ) : null}
          </div>
        </header>

        {/* Main Content Layout (2 Columns: Overview + Specs Sidebar) */}
        <div className="tool-detail-body-grid">
          {/* Left Column: Overview & Features */}
          <div className="tool-detail-main">
            <section className="tool-detail-section">
              <h2 className="tool-section-heading">About {tool.title}</h2>
              {Array.isArray(tool.body) && tool.body.length > 0 ? (
                <div className="tool-detail-portable-text">
                  <PortableText value={tool.body} components={portableTextComponents} />
                </div>
              ) : Array.isArray(tool.longDescription) && tool.longDescription.length > 0 ? (
                <div className="tool-detail-portable-text">
                  <PortableText value={tool.longDescription} components={portableTextComponents} />
                </div>
              ) : (
                <p className="tool-detail-description">
                  {typeof tool.body === 'string' ? tool.body : typeof tool.longDescription === 'string' ? tool.longDescription : tool.description}
                </p>
              )}
            </section>

            {/* Features (if provided) */}
            {tool.features && tool.features.length > 0 && (
              <section className="tool-detail-section">
                <h2 className="tool-section-heading">Key Features & Capabilities</h2>
                <ul className="tool-features-list">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="tool-feature-item">
                      <span className="tool-feature-check">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

          </div>

          {/* Right Column: Specifications & Quick Info Card */}
          <aside className="tool-detail-sidebar">
            <div className="tool-specs-card">
              <h3 className="tool-specs-title">Tool Specifications</h3>
              
              <div className="tool-spec-item">
                <span className="tool-spec-label">Category</span>
                <span className="tool-spec-value">{tool.tag || 'Productivity / Utility'}</span>
              </div>

              <div className="tool-spec-item">
                <span className="tool-spec-label">Pricing Model</span>
                <span className="tool-spec-value highlight">{tool.pricing || tool.badge || 'Free'}</span>
              </div>

              {tool.author && (
                <div className="tool-spec-item">
                  <span className="tool-spec-label">Developer / Team</span>
                  <span className="tool-spec-value">{tool.author}</span>
                </div>
              )}

              <div className="tool-spec-item">
                <span className="tool-spec-label">Platform</span>
                <span className="tool-spec-value">{tool.platform || 'Web Application'}</span>
              </div>

              <div className="tool-spec-item">
                <span className="tool-spec-label">Access Type</span>
                <span className="tool-spec-value">{tool.accessType || 'Direct Web App (No Download)'}</span>
              </div>

              <div className="tool-spec-item">
                <span className="tool-spec-label">Account</span>
                <span className="tool-spec-value">{tool.accountRequirement || 'Instant Access / No Login'}</span>
              </div>

              {displayDomain && (
                <div className="tool-spec-item">
                  <span className="tool-spec-label">Official Domain</span>
                  <span className="tool-spec-value" style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                    {displayDomain}
                  </span>
                </div>
              )}

              <div className="tool-spec-item">
                <span className="tool-spec-label">Status</span>
                <span className="tool-spec-value status-active">
                  {isUpcoming ? 'In Development' : 'Live & Active'}
                </span>
              </div>

              <div className="tool-spec-item">
                <span className="tool-spec-label">Verification</span>
                <span className="tool-spec-value status-active">
                  {tool.verificationStatus || '✓ Curated & Safe'}
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Tools Recommendation Section */}
        {relatedTools.length > 0 && (
          <section className="tool-related-section">
            <div className="tool-related-header">
              <h2>More Tools You May Like</h2>
              <Link href="/" className="tool-related-all-link">
                View All Tools →
              </Link>
            </div>

            <div className="tools-grid">
              {relatedTools.map((relTool) => (
                <ToolCard key={relTool._id} tool={relTool} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageWrapper>
  );
}
