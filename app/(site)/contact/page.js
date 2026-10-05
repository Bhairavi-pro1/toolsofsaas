import PageWrapper from '@/components/PageWrapper';

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'Bhairavi.co@gmail.com';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsofsaas.com';

export const metadata = {
  title: 'Contact Us – Support, Submissions & Inquiries',
  description:
    'Have questions or feedback? Contact ToolsOfSaaS. We\'re here to help with tool suggestions, support inquiries, and collaboration requests related to our web tools directory.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us – ToolsOfSaaS',
    description: 'Get in touch with the ToolsOfSaaS team for support, listings, or feedback.',
    url: `${siteUrl}/contact`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Contact ToolsOfSaaS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us – ToolsOfSaaS',
    description: 'Get in touch with the ToolsOfSaaS team for support, listings, or feedback.',
    images: [`${siteUrl}/og-image.png`],
  },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': `${siteUrl}/contact#webpage`,
      url: `${siteUrl}/contact`,
      name: 'Contact Us – ToolsOfSaaS',
      description: 'Contact page for ToolsOfSaaS support and directory inquiries.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'ToolsOfSaaS',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${siteUrl}/contact#breadcrumb`,
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
          name: 'Contact Us',
          item: `${siteUrl}/contact`,
        },
      ],
    },
  ],
};

export default function ContactPage() {
  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <div className="container content-page">
        <h1>Contact Us</h1>
        <div className="contact-content">
          <p>
            Have a question about a tool? Want to suggest a new SaaS solution for our directory? Or perhaps you&apos;ve found a bug that needs squashing? We&apos;re all ears!
          </p>
          <p>
            At <strong>ToolsOfSaaS</strong>, we are committed to providing the most accurate and up-to-date directory of web tools to help you optimize your workflow. Your feedback is crucial in helping us maintain the quality and relevance of our curated collection.
          </p>
          <p>
            Whether you&apos;re a developer looking to list your tool or a user seeking support, please reach out to us via the email below. We aim to respond to all inquiries within 24-48 hours.
          </p>

          <div className="highlight-box">
            <h3>Direct Email Support</h3>
            <a href={`mailto:${contactEmail}`} className="email-link">
              {contactEmail}
            </a>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
