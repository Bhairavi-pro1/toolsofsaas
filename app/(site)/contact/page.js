import PageWrapper from '@/components/PageWrapper';

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'Bhairavi.co@gmail.com';

export const metadata = {
  title: 'Contact Us - Get in Touch for Support & Feedback',
  description:
    'Have questions or feedback? Contact ToolsOfSaaS. We\'re here to help with tool suggestions, support inquiries, and collaboration requests related to our web tools directory.',
  keywords: [
    'contact toolsofsaas',
    'saas support',
    'tool suggestions',
    'web tools feedback',
    'customer service saas directory',
  ],
  openGraph: {
    title: 'Contact Us - ToolsOfSaaS',
    description: 'Get in touch with the ToolsOfSaaS team for support or feedback.',
    url: '/contact',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <PageWrapper>
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
