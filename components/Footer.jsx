import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
            <img src="/favicon.png" alt="ToolsOfSaaS Logo" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
            <h4 style={{ margin: 0 }}>ToolsOfSaaS</h4>
          </div>
          <p style={{ opacity: 0.7, lineHeight: 1.6 }}>
            The ultimate directory for web-based tools. Supercharge your productivity with our curated collection.
          </p>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <div className="footer-links-grid">
            <Link href="/about">About Us</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/blog">Blog</Link>
          </div>
        </div> 
      </div>
      <div className="copyright">
        © {currentYear} ToolsOfSaaS. All rights reserved.
      </div>
    </footer>
  );
}
