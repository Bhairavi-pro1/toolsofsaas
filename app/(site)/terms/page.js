import PageWrapper from '@/components/PageWrapper';

export const metadata = {
  title: 'Terms of Service - User Guidelines & Rules',
  description:
    'Read the Terms of Service for ToolsOfSaaS. Understand our guidelines, user responsibilities, and the rules of using our curated directory of SaaS and web tools.',
  keywords: [
    'terms of service',
    'user agreement',
    'toolsofsaas rules',
    'web tools usage terms',
    'saas directory guidelines',
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <PageWrapper>
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
