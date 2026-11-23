'use client';

import Link from 'next/link';
import { ECOSYSTEM_TOOLS } from '@/lib/ecosystemTools';

export default function InternalLinks({ currentPath = '', title = 'Explore More Free Tools & Browser Utilities' }) {
  // Filter out the active tool page to ensure all links lead to distinct destinations
  const visibleTools = ECOSYSTEM_TOOLS.filter((tool) => {
    if (!currentPath) return true;
    const cleanCurrent = currentPath.replace(/\/+$/, '');
    const cleanTool = tool.url.replace(/\/+$/, '');
    return cleanCurrent !== cleanTool && !cleanCurrent.endsWith(tool.slug);
  });

  return (
    <section className="internal-links-section" aria-label="ToolsOfSaaS Ecosystem Tools">
      <div className="internal-links-header">
        <div className="internal-links-title-wrap">
          <span className="internal-links-badge">ToolsOfSaaS Ecosystem</span>
          <h2 className="internal-links-title">{title}</h2>
          <p className="internal-links-desc">
            100% free client-side micro-tools with zero signups, instant calculations, and complete local privacy.
          </p>
        </div>
        <Link href="/tools/" className="internal-links-view-all">
          <span>Browse All Tools</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>

      <div className="internal-links-grid">
        {visibleTools.map((tool) => (
          <Link
            key={tool.url}
            href={tool.url}
            className="internal-link-card"
            title={`${tool.name} – ${tool.category}`}
          >
            <div className="internal-link-card-top">
              <span className="internal-link-icon" aria-hidden="true">{tool.icon}</span>
              <span className="internal-link-category">{tool.category}</span>
            </div>
            <h3 className="internal-link-name">{tool.name}</h3>
            <p className="internal-link-desc">{tool.description}</p>
            <div className="internal-link-action">
              <span>Launch Tool</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
