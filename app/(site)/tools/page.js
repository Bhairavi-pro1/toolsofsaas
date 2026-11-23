import PageWrapper from '@/components/PageWrapper';
import AdBanner from '@/components/AdBanner';
import ToolsGrid from '@/components/ToolsGrid';
import { client } from '@/sanity/lib/client';
import { TOOLS_QUERY, UPCOMING_TOOLS_QUERY } from '@/sanity/lib/queries';

export const revalidate = 86400; // 24-hour cache

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsofsaas.com';

export const metadata = {
  title: 'All Free Web Utilities & Browser Micro-Tools Directory | ToolsOfSaaS',
  description:
    'Browse our comprehensive catalog of 100% free web utilities, team rotators, affiliate calculators, and productivity tools. Instant client-side execution with complete privacy.',
  alternates: {
    canonical: `${siteUrl}/tools/`,
  },
  openGraph: {
    title: 'Free Web Utilities & Browser Tools Directory | ToolsOfSaaS',
    description:
      'Browse our comprehensive catalog of 100% free web utilities, team rotators, affiliate calculators, and productivity tools.',
    url: `${siteUrl}/tools/`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'ToolsOfSaaS Free Web Tools Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Web Utilities & Browser Tools Directory | ToolsOfSaaS',
    description:
      'Browse our comprehensive catalog of 100% free web utilities, team rotators, affiliate calculators, and productivity tools.',
  },
};

export default async function ToolsDirectoryPage() {
  let tools = [];
  let upcomingTools = [];

  try {
    tools = await client.fetch(TOOLS_QUERY);
    upcomingTools = await client.fetch(UPCOMING_TOOLS_QUERY);
  } catch (error) {
    console.error('Failed to fetch tools for directory:', error);
  }

  // Build ItemList structured data
  const directorySchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tools',
            item: `${siteUrl}/tools/`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/tools/#webpage`,
        name: 'ToolsOfSaaS Web Utilities & Tools Directory',
        description:
          'Comprehensive directory of 100% free, client-side web tools, calculators, and team generators.',
        url: `${siteUrl}/tools/`,
      },
      {
        '@type': 'ItemList',
        name: 'All Web Utilities',
        numberOfItems: (tools || []).length,
        itemListElement: (tools || []).map((tool, idx) => {
          const slug = typeof tool.slug === 'string' ? tool.slug : tool.slug?.current;
          const toolUrl = slug
            ? `${siteUrl}/tool/${slug}/`
            : tool.href?.startsWith('http')
              ? tool.href
              : `${siteUrl}${tool.href || ''}`;
          return {
            '@type': 'ListItem',
            position: idx + 1,
            name: tool.title,
            url: toolUrl,
            description: tool.description,
          };
        }),
      },
    ],
  };

  return (
    <PageWrapper>
      <AdBanner position="header" />

      {/* Unified Single Tools Grid with Search & Real-time Filter */}
      <ToolsGrid
        initialTools={tools}
        initialUpcoming={upcomingTools}
        badge="Tools Directory"
        title={
          <>
            Explore Our Suite of <span style={{ color: 'var(--primary)' }}>Free Web Tools</span>
          </>
        }
        subtitle="High-performance, privacy-first browser utilities designed to solve everyday tasks. All tools execute locally in your browser with zero logins and zero data retention."
      />

      {/* Directory Value Proposition & Trust Signals */}
      <section className="seo-section" style={{ marginTop: '70px' }}>
        <h2 className="seo-section-title">Why Choose ToolsOfSaaS Utilities?</h2>
        <div className="seo-features-grid" style={{ marginTop: '24px' }}>
          <div className="seo-feature-card">
            <h3 className="seo-feature-title">🔒 100% Client-Side Privacy</h3>
            <p className="seo-feature-desc">
              Your inputs, names, prices, and duty lists never leave your device. All algorithms execute directly in your web browser.
            </p>
          </div>
          <div className="seo-feature-card">
            <h3 className="seo-feature-title">⚡ Instant Execution</h3>
            <p className="seo-feature-desc">
              No registration forms, no subscription tiers, and no countdown timers. Paste your data and get immediate results.
            </p>
          </div>
          <div className="seo-feature-card">
            <h3 className="seo-feature-title">📱 Responsive & Cross-Platform</h3>
            <p className="seo-feature-desc">
              Optimized for phones, tablets, laptops, and desktop workstations with automatic dark and light theme switching.
            </p>
          </div>
        </div>
      </section>

      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(directorySchema),
        }}
      />
    </PageWrapper>
  );
}
