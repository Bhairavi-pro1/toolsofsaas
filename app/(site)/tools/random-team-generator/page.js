import PageWrapper from '@/components/PageWrapper';
import RandomTeamGeneratorClient from './RandomTeamGeneratorClient';
import SeoLandingPage from '@/components/SeoLandingPage';
import { teamPlannerSeoData } from './seoData';
import { client } from '@/sanity/lib/client';
import { TOOLS_QUERY } from '@/sanity/lib/queries';

export const revalidate = 86400; // 24-hour cache

const { seoMetadata } = teamPlannerSeoData;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsofsaas.com';

export const metadata = {
  title: seoMetadata.metaTitle,
  description: seoMetadata.metaDescription,
  openGraph: {
    title: seoMetadata.ogTitle,
    description: seoMetadata.ogDescription,
    url: `${siteUrl}/tools/random-team-generator/`,
  },
  twitter: {
    card: 'summary_large_image',
    title: seoMetadata.twitterTitle,
    description: seoMetadata.twitterDescription,
  },
  alternates: {
    canonical: `${siteUrl}/tools/random-team-generator/`,
  },
};

export default async function RandomTeamGeneratorPage() {
  let sanityTools = [];
  try {
    const allTools = await client.fetch(TOOLS_QUERY);
    sanityTools = (allTools || []).filter(
      (t) =>
        t.slug !== 'random-team-generator' &&
        !t.href?.includes('random-team-generator')
    );
  } catch (err) {
    console.error('Failed to fetch tools from Sanity for team planner:', err);
  }

  return (
    <PageWrapper>
      <RandomTeamGeneratorClient />
      <SeoLandingPage data={teamPlannerSeoData} sanityTools={sanityTools} />
    </PageWrapper>
  );
}
