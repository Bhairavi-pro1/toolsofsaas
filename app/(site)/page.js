import { client } from '@/sanity/lib/client';
import { TOOLS_QUERY, UPCOMING_TOOLS_QUERY } from '@/sanity/lib/queries';
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

  return (
    <PageWrapper>
      {/* Header Ad */}
      <AdBanner position="header" /> 

      {/* Hero + Tools Grid (Client Component) */}
      <ToolsGrid initialTools={tools} initialUpcoming={upcomingTools} />

      {/* Dynamic Homepage JSON-LD Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeSeoData.schemas)
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
                    <td>{row.metric}</td>
                    <td className="highlight">{row.ours}</td>
                    <td>{row.ph}</td>
                    <td>{row.alt}</td>
                    <td>{row.g2}</td>
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
                  <span className="seo-faq-icon">▼</span>
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

