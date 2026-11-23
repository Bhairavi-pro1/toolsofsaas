import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col footer-col-brand">
          <Link href="/" className="footer-brand">
            <img
              src="/favicon.png"
              alt="ToolsOfSaaS Logo"
              className="footer-logo-img"
              width={36}
              height={36}
            />
            <span className="footer-logo-text">ToolsOfSaaS</span>
          </Link>
          <p className="footer-tagline">
            The ultimate directory for web-based tools and browser utilities. Supercharge your productivity with our curated collection.
          </p>
        </div>

        <div className="footer-col footer-col-links">
          <h4 className="footer-heading">Free Utilities</h4>
          <div className="footer-links-grid">
            <Link href="/tools/random-team-generator/" className="footer-link">Random Team Generator</Link>
            <Link href="/tools/chore-assigner/" className="footer-link">Fair Chore Assigner</Link>
            <Link href="/tools/amazon-affiliate-commission-calculator/" className="footer-link">Amazon Commission Calculator</Link>
            <Link href="/tool/color-palette-gen/" className="footer-link">Color Palette Generator</Link>
            <Link href="/tools/" className="footer-link">Browse All Tools →</Link>
          </div>
        </div>

        <div className="footer-col footer-col-links">
          <h4 className="footer-heading">Company</h4>
          <div className="footer-links-grid">
            <Link href="/about/" className="footer-link">About Us</Link>
            <Link href="/privacy/" className="footer-link">Privacy Policy</Link>
            <Link href="/contact/" className="footer-link">Contact Us</Link>
            <Link href="/terms/" className="footer-link">Terms of Service</Link>
            <Link href="/blog/" className="footer-link">Blog & Guides</Link>
            <Link href="/affiliate-disclosure/" className="footer-link">Affiliate Disclosure</Link>
          </div>
        </div> 
      </div>

      <div className="copyright">
        © {currentYear} ToolsOfSaaS. All rights reserved.
      </div>
    </footer>
  );
}
