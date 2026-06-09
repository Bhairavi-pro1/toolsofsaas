import { client } from '@/sanity/lib/client';
import { TOOLS_QUERY, UPCOMING_TOOLS_QUERY } from '@/sanity/lib/queries';
import PageWrapper from '@/components/PageWrapper';
import AdBanner from '@/components/AdBanner';
import ToolsGrid from '@/components/ToolsGrid';

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

      {/* SEO Info Section */}
      <div className="info-section">
        <div className="info-grid">
          <div className="info-card">
            <h3>About ToolsOfSaaS</h3>
            <p>
              ToolsOfSaaS is your ultimate destination for discovering top-tier web-based tools and SaaS solutions designed to optimize your digital workflow. Whether you&apos;re a developer, designer, or digital marketer, our curated directory provides access to powerful utilities like YouTube analyzers, online productivity suites, and AI-driven generators.
            </p>
            <p style={{ marginTop: 15 }}>
              We focus on providing high-quality, reliable, and often free web tools that eliminate the need for complex software installations, allowing you to work faster and smarter directly from your browser.
            </p>
          </div>
          <div className="info-card">
            <h3>How to Use Our Directory</h3>
            <ul>
              <li>
                <strong>Explore Categories:</strong> Browse through our wide range of categories, from Productivity to Marketing, to find the perfect fit.
              </li>
              <li>
                <strong>Smart Search:</strong> Use our lightning-fast search bar to find tools by name, function, or keyword.
              </li>
              <li>
                <strong>Instant Access:</strong> Click on &apos;Visit&apos; to launch tools directly. Most featured tools require zero setup.
              </li>
              <li>
                <strong>Stay Updated:</strong> Check back regularly for new &apos;Coming Soon&apos; tools as we expand our curated collection.
              </li>
            </ul>
          </div>
        </div>
      </div>

    </PageWrapper>
  );
}
