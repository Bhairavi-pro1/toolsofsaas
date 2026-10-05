import PageWrapper from '@/components/PageWrapper';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsofsaas.com';

export const metadata = {
  title: 'About Us – Mission, Vision & Curated Web Tools',
  description:
    'Discover the story behind ToolsOfSaaS. Our mission is to provide a curated, high-performance directory of web-based tools and SaaS solutions to optimize your digital workflow.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us – Mission & Curated Web Tools | ToolsOfSaaS',
    description:
      'Learn about our mission to curate the best digital utilities and SaaS solutions for creators, developers, and entrepreneurs.',
    url: `${siteUrl}/about`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'About ToolsOfSaaS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us – ToolsOfSaaS',
    description:
      'Discover the story behind ToolsOfSaaS. Learn how we curate high-performance web tools.',
    images: [`${siteUrl}/og-image.png`],
  },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': `${siteUrl}/about#webpage`,
      url: `${siteUrl}/about`,
      name: 'About Us – ToolsOfSaaS',
      description:
        'Discover the story behind ToolsOfSaaS. Our mission is to provide a curated, high-performance directory of web-based tools.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'ToolsOfSaaS',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${siteUrl}/about#breadcrumb`,
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
          name: 'About Us',
          item: `${siteUrl}/about`,
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <div className="container content-page">
        <h1>About Us</h1>
        <div className="about-content">
          <p>
            Welcome to <strong>ToolsOfSaaS</strong>, the premier curated directory for high-performance web-based tools and SaaS solutions. In an era where digital efficiency defines success, we serve as your compass in the vast landscape of online utilities.
          </p>

          <div className="highlight-box">
            <h3>Our Mission</h3>
            <p>
              To empower creators, developers, and entrepreneurs by providing a single, reliable point of access to the most innovative and effective digital tools available on the web today.
            </p>
          </div>

          <h2>Who We Are</h2>
          <p>
            We are a team of technology enthusiasts, developers, and digital marketers who understand the frustration of switching between dozens of tabs and software installations. We believe that the most powerful tools should be accessible instantly, right from your browser.
          </p>

          <h2>What We Do</h2>
          <p>
            Our platform meticulously curates utilities across multiple domains—from SEO and YouTube analytics to productivity suites and developer tools. Every tool listed on ToolsOfSaaS undergoes a selection process to ensure it provides genuine value, reliability, and a superior user experience.
          </p>

          <h2>Why Choose Us?</h2>
          <p>
            Unlike cluttered directories, we focus on quality over quantity. We prioritize tools that are &quot;installer-free,&quot; platform-independent, and designed for immediate impact on your workflow.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
