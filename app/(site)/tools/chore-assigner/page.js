import PageWrapper from '@/components/PageWrapper';
import ChoreAssignerClient from './ChoreAssignerClient';
import SeoLandingPage from '@/components/SeoLandingPage';
import { choreAssignerSeoData } from './seoData';
import { client } from '@/sanity/lib/client';
import { TOOLS_QUERY } from '@/sanity/lib/queries';

export const revalidate = 86400; // 24-hour cache

const { seoMetadata } = choreAssignerSeoData;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsofsaas.com';

export const metadata = {
  title: seoMetadata.metaTitle,
  description: seoMetadata.metaDescription,
  openGraph: {
    title: seoMetadata.ogTitle,
    description: seoMetadata.ogDescription,
    url: `${siteUrl}/tools/chore-assigner/`,
  },
  twitter: {
    card: 'summary_large_image',
    title: seoMetadata.twitterTitle,
    description: seoMetadata.twitterDescription,
  },
  alternates: {
    canonical: `${siteUrl}/tools/chore-assigner/`,
  },
};

export default async function ChoreAssignerPage() {
  let sanityTools = [];
  try {
    const allTools = await client.fetch(TOOLS_QUERY);
    sanityTools = (allTools || []).filter(
      (t) =>
        t.slug !== 'chore-assigner' &&
        !t.href?.includes('chore-assigner')
    );
  } catch (err) {
    console.error('Failed to fetch tools from Sanity for chore assigner:', err);
  }

  return (
    <PageWrapper>
      <ChoreAssignerClient />
      <SeoLandingPage data={choreAssignerSeoData} sanityTools={sanityTools} />
    </PageWrapper>
  );
}
