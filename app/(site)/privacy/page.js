import PageWrapper from '@/components/PageWrapper';

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'Bhairavi.co@gmail.com';

export const metadata = {
  title: 'Privacy Policy - Your Data Safety & Privacy',
  description:
    'Learn how ToolsOfSaaS protects your privacy and handles your data. Our privacy policy outlines our commitment to transparency and security.',
  keywords: [
    'privacy policy',
    'data protection',
    'toolsofsaas privacy',
    'web tools safety',
    'user data security',
  ],
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <PageWrapper>
      <div className="container content-page">
        <h1>Privacy Policy</h1>
        <p style={{ textAlign: 'center' }}>Last Updated: March 4, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to ToolsOfSaaS. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
          </p>
        </section>

        <section>
          <h2>2. Data We Collect</h2>
          <p>
            We do not require users to create accounts to use our directory. However, we may collect minimal data such as:
          </p>
          <ul>
            <li>
              <strong>Usage Data:</strong> Information about how you use our website (e.g., tools clicked, search queries).
            </li>
            <li>
              <strong>Technical Data:</strong> IP address, browser type, and version, time zone setting, and location.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Cookies</h2>
          <p>
            We use cookies to enhance your experience, analyze site traffic, and serve targeted advertisements through partners like Google AdSense or other ad networks.
          </p>
        </section>

        <section>
          <h2>4. Third-Party Links</h2>
          <p>
            Our website contains links to third-party websites (the tools in our directory). Clicking on those links may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
          </p>
        </section>

        <section>
          <h2>5. Contact Information</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at{' '}
            <a href={`mailto:${contactEmail}`} style={{ color: 'var(--primary)' }}>
              {contactEmail}
            </a>.
          </p>
        </section>
      </div>
    </PageWrapper>
  );
}
