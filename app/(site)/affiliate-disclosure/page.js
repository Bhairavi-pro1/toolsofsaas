import PageWrapper from '@/components/PageWrapper';

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'Bhairavi.co@gmail.com';

export const metadata = {
  title: 'Affiliate Disclosure - Transparency & Trust',
  description:
    'Read our affiliate disclosure policy. ToolsOfSaaS explains how we use affiliate links and how it impacts your usage of our directory.',
  keywords: [
    'affiliate disclosure',
    'affiliate links policy',
    'advertising disclosure',
    'toolsofsaas affiliate policy',
    'transparency pledge',
  ],
  alternates: {
    canonical: '/affiliate-disclosure',
  },
};

export default function AffiliateDisclosurePage() {
  return (
    <PageWrapper>
      <div className="container content-page">
        <h1>Affiliate Disclosure</h1>
        <p style={{ textAlign: 'center', marginBottom: '30px' }}>Last Updated: June 26, 2026</p>

        <section style={{ marginBottom: '25px' }}>
          <h2>1. Overview and Commitment to Transparency</h2>
          <p>
            In compliance with the Federal Trade Commission (FTC) guidelines and in alignment with our commitment to transparency, experience, expertise, authoritativeness, and trustworthiness (E-E-A-T), we are providing this disclosure page.
          </p>
          <p style={{ marginTop: '15px' }}>
            ToolsOfSaaS is an independent directory of web-based tools and SaaS utilities. To fund the research, hosting, development, and upkeep of our completely free-to-use directory, we participate in various affiliate marketing programs. This means that we may earn a small referral commission if you choose to purchase or subscribe to products or services through our links.
          </p>
        </section>

        <section style={{ marginBottom: '25px' }}>
          <h2>2. How Affiliate Links Work</h2>
          <p>
            When you browse the SaaS listings, read blog reviews, or utilize recommendations on ToolsOfSaaS, you will encounter outbound links pointing to external services. Some of these outbound links contain custom tracking parameters (affiliate links).
          </p>
          <p style={{ marginTop: '15px' }}>
            If you click on one of these tracking links and complete a purchase or sign up for a paid subscription within a specific cookie duration window, the vendor provides us with a small referral commission.
          </p>
          <p style={{ marginTop: '15px', fontWeight: 'bold', color: 'var(--primary)' }}>
            This referral fee is paid entirely by the vendor and incurs absolutely NO additional cost to you.
          </p>
        </section>

        <section style={{ marginBottom: '25px' }}>
          <h2>3. Our Editorial Standards and Honesty Pledge</h2>
          <p>
            We take pride in the quality and independence of our directory. While we receive commissions, this does not influence our evaluation of the software tools we catalog. We do not accept payment to provide positive reviews for poor quality tools.
          </p>
          <p style={{ marginTop: '15px' }}>
            Our review guidelines ensure:
          </p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>User First:</strong> Tools are indexed based on utility, performance, security, and accessibility.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Unbiased Evaluation:</strong> If a tool has drawbacks, limitations, or poor mobile responsiveness, we clearly state so regardless of their affiliate program parameters.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Equal Presentation:</strong> Free open-source alternatives are highlighted alongside paid commercial services to guarantee users find the best fit.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '25px' }}>
          <h2>4. Affiliate Partners</h2>
          <p>
            ToolsOfSaaS may engage in partnerships with several affiliate network registries, including but not limited to Impact Radius, ShareASale, CJ Affiliate, Amazon Services LLC Associates Program, ClickBank, and direct SaaS partner programs.
          </p>
        </section>

        <section style={{ marginBottom: '25px' }}>
          <h2>5. Your Support Matters</h2>
          <p>
            By purchasing or registering through our referral links, you are directly helping us cover server expenses, developer fees, and licensing requirements necessary to expand and maintain our free utilities directory. We sincerely appreciate your support in helping us build the ultimate web tools platform.
          </p>
        </section>

        <section>
          <h2>6. Questions and Contact</h2>
          <p>
            If you have any questions or require further clarification regarding our affiliate relationships, please reach out to us at{' '}
            <a href={`mailto:${contactEmail}`} style={{ color: 'var(--primary)' }}>
              {contactEmail}
            </a>.
          </p>
        </section>
      </div>
    </PageWrapper>
  );
}
