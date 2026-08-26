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
            The ultimate directory for web-based tools. Supercharge your productivity with our curated collection.
          </p>
        </div>

        <div className="footer-col footer-col-links">
          <h4 className="footer-heading">Company</h4>
          <div className="footer-links-grid">
            <Link href="/about" className="footer-link">About Us</Link>
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <Link href="/contact" className="footer-link">Contact Us</Link>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
            <Link href="/blog" className="footer-link">Blog</Link>
            <Link href="/affiliate-disclosure" className="footer-link">Affiliate Disclosure</Link>
          </div>
        </div> 
      </div>

      <div className="copyright">
        © {currentYear} ToolsOfSaaS. All rights reserved.
      </div>
    </footer>
  );
}

