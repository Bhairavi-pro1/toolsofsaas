import PageWrapper from '@/components/PageWrapper';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsofsaas.com';

export const metadata = {
  title: 'Terms of Service – User Guidelines & Directory Rules',
  description:
    'Read the Terms of Service for ToolsOfSaaS. Understand our guidelines, user responsibilities, and the rules of using our curated directory of SaaS and web tools.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service – ToolsOfSaaS',
    description: 'Guidelines and rules for using ToolsOfSaaS directory.',
    url: `${siteUrl}/terms`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'ToolsOfSaaS Terms of Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service – ToolsOfSaaS',
    description: 'Guidelines and rules for using ToolsOfSaaS directory.',
    images: [`${siteUrl}/og-image.png`],
  },
};

const termsSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/terms#webpage`,
      url: `${siteUrl}/terms`,
      name: 'Terms of Service – ToolsOfSaaS',
      description: 'Terms and conditions for ToolsOfSaaS web platform.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'ToolsOfSaaS',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${siteUrl}/terms#breadcrumb`,
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
          name: 'Terms of Service',
          item: `${siteUrl}/terms`,
        },
      ],
    },
  ],
};

export default function TermsPage() {
  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
      />
      <div className="container content-page">
        <h1>Terms of Service</h1>
        <p style={{ textAlign: 'center' }}>Last Updated: March 4, 2026</p>

        <section>
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing ToolsOfSaaS, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily use the information on ToolsOfSaaS for personal, non-commercial transitory viewing only.
          </p>
        </section>

        <section>
          <h2>3. Disclaimer</h2>
          <p>
            The materials on ToolsOfSaaS are provided on an &apos;as is&apos; basis. ToolsOfSaaS makes no warranties, expressed or implied, and hereby disclaims all other warranties including, without limitation, implied warranties of merchantability or fitness for a particular purpose.
          </p>
        </section>

        <section>
          <h2>4. Accuracy of Materials</h2>
          <p>
            The materials appearing on ToolsOfSaaS could include technical, typographical, or photographic errors. ToolsOfSaaS does not warrant that any of the materials on its website are accurate, complete, or current.
          </p>
        </section>

        <section>
          <h2>5. Links</h2>
          <p>
            ToolsOfSaaS has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ToolsOfSaaS.
          </p>
        </section>
      </div>
    </PageWrapper>
  );
}
