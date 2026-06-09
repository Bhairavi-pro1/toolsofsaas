import PageWrapper from '@/components/PageWrapper';

export const metadata = {
  title: 'About Us - Our Mission & Vision',
  description:
    'Discover the story behind ToolsOfSaaS. Our mission is to provide a curated, high-performance directory of web-based tools and SaaS solutions to optimize your digital workflow.',
  keywords: [
    'about toolsofsaas',
    'saas directory mission',
    'web tools curation',
    'digital productivity journey',
    'our vision toolsofsaas',
  ],
  openGraph: {
    title: 'About Us - ToolsOfSaaS',
    description: 'Learn about our mission to curate the best digital tools.',
    url: '/about',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="container content-page">
        <h1>About Us</h1>
        <div className="about-content">
          <p>
            Welcome to <strong>ToolsOfSaaS</strong>, the premier curated directory for high-performance web-based tools and SaaS solutions. In an era where digital efficiency defines success, we serve as your compass in the vast landscape of online utilities.
          </p>

          <div className="highlight-box">
            <h3>Our Mission</h3>
            <p>
              To empower creators, developers, and entrepreneurs by providing a single, reliable point of access to the most innovative and effective digital tools available on the web today.
            </p>
          </div>

          <h2>Who We Are</h2>
          <p>
            We are a team of technology enthusiasts, developers, and digital marketers who understand the frustration of switching between dozens of tabs and software installations. We believe that the most powerful tools should be accessible instantly, right from your browser.
          </p>

          <h2>What We Do</h2>
          <p>
            Our platform meticulously curates utilities across multiple domains—from SEO and YouTube analytics to productivity suites and developer tools. Every tool listed on ToolsOfSaaS undergoes a selection process to ensure it provides genuine value, reliability, and a superior user experience.
          </p>

          <h2>Why Choose Us?</h2>
          <p>
            Unlike cluttered directories, we focus on quality over quantity. We prioritize tools that are &quot;installer-free,&quot; platform-independent, and designed for immediate impact on your workflow.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
