import PageWrapper from '@/components/PageWrapper';
import AmazonAffiliateCalculatorClient from './AmazonAffiliateCalculatorClient';
import SeoLandingPage from '@/components/SeoLandingPage';
import { amazonAffiliateSeoData } from './seoData';
import { client } from '@/sanity/lib/client';
import { TOOLS_QUERY } from '@/sanity/lib/queries';

export const revalidate = 60;

const { seoMetadata } = amazonAffiliateSeoData;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsofsaas.com';

export const metadata = {
  title: seoMetadata.metaTitle,
  description: seoMetadata.metaDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: seoMetadata.ogTitle,
    description: seoMetadata.ogDescription,
    url: `${siteUrl}/tools/amazon-affiliate-commission-calculator`,
    siteName: 'ToolsOfSaaS',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 512,
        height: 512,
        type: 'image/png',
        alt: 'ToolsOfSaaS Logo',
      },
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Amazon Affiliate Commission Calculator - ToolsOfSaaS',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: seoMetadata.twitterTitle,
    description: seoMetadata.twitterDescription,
    images: [`${siteUrl}/logo.png`],
  },
  alternates: {
    canonical: `${siteUrl}/tools/amazon-affiliate-commission-calculator`,
  },
};

export default async function AmazonAffiliateCalculatorPage() {
  let sanityTools = [];
  try {
    const allTools = await client.fetch(TOOLS_QUERY);
    sanityTools = (allTools || []).filter(
      (t) =>
        t.slug !== 'amazon-affiliate-commission-calculator' &&
        !t.href?.includes('amazon-affiliate-commission-calculator')
    );
  } catch (err) {
    console.error('Failed to fetch tools from Sanity for Amazon calculator:', err);
  }

  return (
    <PageWrapper>
      <AmazonAffiliateCalculatorClient />
      <SeoLandingPage data={amazonAffiliateSeoData} sanityTools={sanityTools} />
    </PageWrapper>
  );
}

