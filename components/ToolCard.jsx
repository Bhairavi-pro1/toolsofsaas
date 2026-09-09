import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';

export default function ToolCard({ tool, isUpcoming = false }) {
  const slug = typeof tool.slug === 'string' ? tool.slug : tool.slug?.current;
  const detailUrl = slug ? `/tool/${slug}` : (tool.href || '#');

  // Subtitle / handle fallback
  const authorHandle = tool.author ? tool.author.toLowerCase().replace(/[^a-z0-9]/g, '') : null;
  const subtitleText = tool.subtitle || (authorHandle && slug ? `${authorHandle}/${slug}` : (tool.tag || 'Web Tool'));

  if (isUpcoming) {
    return (
      <div className="tool-card tool-card-upcoming" aria-disabled="true">
        {/* Top Header: Logo + Title & Subtitle */}
        <div className="tool-card-header">
          <div className="tool-card-logo">
            {tool.iconImage ? (
              <img
                src={urlFor(tool.iconImage).width(100).height(100).url()}
                alt={`${tool.title} logo`}
                width={48}
                height={48}
                loading="lazy"
              />
            ) : (
              <span className="tool-card-logo-fallback">
                {tool.title ? tool.title.charAt(0).toUpperCase() : 'T'}
              </span>
            )}
          </div>

          <div className="tool-card-meta">
            <h3 className="tool-card-title">{tool.title}</h3>
            <span className="tool-card-subtitle">{subtitleText}</span>
          </div>
        </div>

        {/* Description Snippet */}
        <p className="tool-card-desc">{tool.description}</p>

        {/* Bottom Footer: Tag & Coming Soon Badge */}
        <div className="tool-card-footer">
          <div className="tool-card-author-box">
            {tool.tag ? <span className="tool-card-tag">{tool.tag}</span> : null}
          </div>

          <div className="tool-card-badge-box">
            <span className="badge badge-upcoming" title="Currently in development">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={detailUrl} className="tool-card">
      {/* Top Header: Logo + Title & Subtitle */}
      <div className="tool-card-header">
        <div className="tool-card-logo">
          {tool.iconImage ? (
            <img
              src={urlFor(tool.iconImage).width(100).height(100).url()}
              alt={`${tool.title} logo`}
              width={48}
              height={48}
              loading="lazy"
            />
          ) : (
            <span className="tool-card-logo-fallback">
              {tool.title ? tool.title.charAt(0).toUpperCase() : 'T'}
            </span>
          )}
        </div>

        <div className="tool-card-meta">
          <h3 className="tool-card-title">{tool.title}</h3>
          <span className="tool-card-subtitle">{subtitleText}</span>
        </div>
      </div>

      {/* Description Snippet */}
      <p className="tool-card-desc">{tool.description}</p>

      {/* Bottom Footer: Author Info (avatar strictly if uploaded) + Tag/Badge */}
      <div className="tool-card-footer">
        <div className="tool-card-author-box">
          {tool.authorAvatar && (
            <img
              src={urlFor(tool.authorAvatar).width(44).height(44).url()}
              alt={tool.author || 'Author'}
              className="tool-card-avatar"
              width={22}
              height={22}
            />
          )}
          {tool.author ? (
            <span className="tool-card-author-name">{tool.author}</span>
          ) : tool.tag ? (
            <span className="tool-card-tag">{tool.tag}</span>
          ) : null}
        </div>

        <div className="tool-card-badge-box">
          <span className="badge">{tool.badge || tool.pricing || 'Free'}</span>
        </div>
      </div>
    </Link>
  );
}


