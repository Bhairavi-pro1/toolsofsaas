import PageWrapper from '@/components/PageWrapper';
import ChoreAssignerClient from './ChoreAssignerClient';
import SeoLandingPage from '@/components/SeoLandingPage';
import { choreAssignerSeoData } from './seoData';

const { seoMetadata } = choreAssignerSeoData;

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

export default function ChoreAssignerPage() {
  return (
    <PageWrapper>
      <ChoreAssignerClient />
      <SeoLandingPage data={choreAssignerSeoData} />
    </PageWrapper>
  );
}
