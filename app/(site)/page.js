import { client } from '@/sanity/lib/client';
import { TOOLS_QUERY, UPCOMING_TOOLS_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import PageWrapper from '@/components/PageWrapper';
import AdBanner from '@/components/AdBanner';
import ToolsGrid from '@/components/ToolsGrid';
import { homeSeoData } from './homeSeoData';

export const revalidate = 60; // Revalidate this page cache every 60 seconds

export default async function HomePage() {
  let tools = [];
  let upcomingTools = [];

  try {
    tools = await client.fetch(TOOLS_QUERY);
    upcomingTools = await client.fetch(UPCOMING_TOOLS_QUERY);
  } catch (error) {
    console.error('Failed to fetch tools from Sanity:', error);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsofsaas.com';

  // Build ItemList / SoftwareApplication structured data for all live tools
  const itemListSchema = {
    '@type': 'ItemList',
    '@id': `${siteUrl}#tool-list`,
    name: 'Hand-Picked Free Web Tools & Browser Utilities',
    description: 'Curated collection of 100% free, client-side browser tools and SaaS utilities.',
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => {
      const slug = typeof tool.slug === 'string' ? tool.slug : tool.slug?.current;
      const toolUrl = slug
        ? `${siteUrl}/tool/${slug}`
        : tool.href?.startsWith('http')
          ? tool.href
          : `${siteUrl}${tool.href || ''}`;

      let imageUrl;
      try {
        if (tool.iconImage) {
          imageUrl = urlFor(tool.iconImage).width(120).height(120).url();
        }
      } catch {
        // Fallback if image builder fails
      }

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: tool.title,
        url: toolUrl,
        item: {
          '@type': 'SoftwareApplication',
          '@id': `${toolUrl}#software`,
          name: tool.title,
          description: tool.description || `Free client-side ${tool.title} browser utility.`,
          url: toolUrl,
          applicationCategory: tool.tag ? tool.tag.replace(/^#/, '') : 'UtilitiesApplication',
          operatingSystem: 'All / Web Browser',
          browserRequirements: 'Requires JavaScript and HTML5 support',
          ...(imageUrl ? { image: imageUrl } : {}),
          offers: {
            '@type': 'Offer',
            price: '0.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          author: {
            '@type': 'Organization',
            name: tool.author || 'ToolsOfSaaS',
            url: siteUrl,
          },
        },
      };
    }),
  };

  // Combine site, FAQ, and ItemList schemas into a unified @graph
  const homepageSchemas = {
    '@context': 'https://schema.org',
    '@graph': [...(homeSeoData.schemas?.['@graph'] || []), itemListSchema],
  };

  return (
    <PageWrapper>
      {/* Header Ad */}
      <AdBanner position="header" /> 

      {/* Hero + Tools Grid (Client Component) */}
      <ToolsGrid initialTools={tools} initialUpcoming={upcomingTools} />

      {/* Dynamic Homepage JSON-LD Schema Injection (WebSite + FAQPage + ItemList / SoftwareApplication) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageSchemas),
        }}
      />

      {/* Homepage SEO Copy Sections */}
      <div className="seo-content" style={{ marginTop: '80px', display: 'flex', flexDirection: 'column', gap: '60px' }}>
        
        {/* Why Choose Us */}
        <section className="seo-section">
          <h2 className="seo-section-title">{homeSeoData.whyChooseUs.title}</h2>
          <p className="seo-text" style={{ marginBottom: '30px' }}>{homeSeoData.whyChooseUs.description}</p>
          <div className="seo-features-grid">
            {homeSeoData.whyChooseUs.points.map((pt, idx) => (
              <div key={idx} className="seo-feature-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                <h3 className="seo-feature-title">{pt.title}</h3>
                <p className="seo-feature-desc">{pt.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Directory Key Features */}
        <section className="seo-section">
          <h2 className="seo-section-title">{homeSeoData.keyFeatures.title}</h2>
          <div className="seo-features-grid">
            {homeSeoData.keyFeatures.cards.map((card, idx) => (
              <div key={idx} className="seo-feature-card">
                <h3 className="seo-feature-title">{card.title}</h3>
                <p className="seo-feature-desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Use Directory */}
        <section className="seo-section">
          <h2 className="seo-section-title">{homeSeoData.howToUse.title}</h2>
          <div className="seo-steps-list">
            {homeSeoData.howToUse.steps.map((step, idx) => (
              <div key={idx} className="seo-step-item">
                <div className="seo-step-num">{(idx + 1).toString().padStart(2, '0')}</div>
                <div className="seo-step-body">
                  <h3 className="seo-step-heading">{step.title}</h3>
                  <p className="seo-step-explanation">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Benefits */}
        <section className="seo-section">
          <h2 className="seo-section-title">{homeSeoData.benefits.title}</h2>
          <div className="seo-benefits-grid">
            {homeSeoData.benefits.items.map((benefit, idx) => (
              <div key={idx} className="seo-benefit-card">
                <h3 className="seo-benefit-title">{benefit.title}</h3>
                <p className="seo-benefit-desc">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Comparison */}
        <section className="seo-section">
          <h2 className="seo-section-title">{homeSeoData.comparison.title}</h2>
          <div className="seo-table-container">
            <table className="seo-table">
              <thead>
                <tr>
                  {homeSeoData.comparison.headers.map((h, idx) => (
                    <th key={idx}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {homeSeoData.comparison.rows.map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.metric}</strong></td>
                    <td className="highlight">{row.ours}</td>
                    {row.others ? (
                      row.others.map((val, cIdx) => (
                        <td key={cIdx}>{val}</td>
                      ))
                    ) : (
                      <>
                        <td>{row.ph}</td>
                        <td>{row.alt}</td>
                        <td>{row.g2}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Accordion using native details-summary tags */}
        <section className="seo-section" style={{ marginBottom: '60px' }}>
          <h2 className="seo-section-title">Frequently Asked Questions</h2>
          <div className="seo-faq-list">
            {homeSeoData.faqs.map((faq, idx) => (
              <details key={idx} className="seo-faq-item">
                <summary className="seo-faq-question">
                  <span>{faq.q}</span>
                  <span className="seo-faq-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </summary>
                <div className="seo-faq-answer">
                  <div className="seo-faq-answer-inner">{faq.a}</div>
                </div>
              </details>
            ))}
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}

