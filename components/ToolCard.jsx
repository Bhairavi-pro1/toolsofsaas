import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';

export default function ToolCard({ tool, isUpcoming = false }) {
  const cardContent = (
    <>
      <div className="tool-header">
        <div className="tool-icon">
          {tool.iconImage ? (
            <img
              src={urlFor(tool.iconImage).width(112).height(112).url()}
              alt={`${tool.title} icon`}
              width={56}
              height={56}
            />
          ) : null}
        </div>
        <span className="badge">
          {isUpcoming ? 'Coming Soon' : (tool.badge || 'Free')}
        </span>
      </div>
      <div>
        <div className="tool-title">{tool.title}</div>
        <div className="tool-desc">{tool.description}</div>
      </div>
      <div className="tool-footer">
        <span style={{ fontSize: 14, color: '#64748b' }}>{tool.tag}</span>
        <span className="visit-btn">{isUpcoming ? 'Waitlist' : 'Visit'}</span>
      </div>
    </>
  );

  if (isUpcoming) {
    return (
      <div className="tool-card coming-soon">
        {cardContent}
      </div>
    );
  }

  const isInternal = tool.href && tool.href.startsWith('/');

  if (isInternal) {
    return (
      <Link href={tool.href} className="tool-card">
        {cardContent}
      </Link>
    );
  }

  return (
    <a
      href={tool.href}
      target="_blank"
      rel="noopener noreferrer"
      className="tool-card"
    >
      {cardContent}
    </a>
  );
}

