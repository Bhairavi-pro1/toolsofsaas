import PageWrapper from '@/components/PageWrapper';
import RandomTeamGeneratorClient from './RandomTeamGeneratorClient';
import SeoLandingPage from '@/components/SeoLandingPage';
import { teamPlannerSeoData } from './seoData';

const { seoMetadata } = teamPlannerSeoData;

export const metadata = {
  title: seoMetadata.metaTitle,
  description: seoMetadata.metaDescription,
  keywords: [
    seoMetadata.primaryKeyword,
    ...seoMetadata.secondaryKeywords,
    ...seoMetadata.lsiKeywords,
  ],
  openGraph: {
    title: seoMetadata.ogTitle,
    description: seoMetadata.ogDescription,
    url: seoMetadata.canonicalUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: seoMetadata.twitterTitle,
    description: seoMetadata.twitterDescription,
  },
  alternates: {
    canonical: seoMetadata.canonicalUrl,
  },
};

export default function RandomTeamGeneratorPage() {
  return (
    <PageWrapper>
      <RandomTeamGeneratorClient />
      <SeoLandingPage data={teamPlannerSeoData} />
    </PageWrapper>
  );
}

