import PageWrapper from '@/components/PageWrapper';
import AmazonAffiliateCalculatorClient from './AmazonAffiliateCalculatorClient';
import SeoLandingPage from '@/components/SeoLandingPage';
import { amazonAffiliateSeoData } from './seoData';

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

export default function AmazonAffiliateCalculatorPage() {
  return (
    <PageWrapper>
      <AmazonAffiliateCalculatorClient />
      <SeoLandingPage data={amazonAffiliateSeoData} />
    </PageWrapper>
  );
}
