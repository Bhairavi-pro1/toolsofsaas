'use client';

/**
 * StructuredData Component (JSON-LD)
 * Renders structured data graphs safely for search crawlers (Google, Bing, Schema.org)
 */
export default function StructuredData({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
