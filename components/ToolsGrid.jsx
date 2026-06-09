'use client';

import { useEffect, useMemo } from 'react';
import { cacheTools } from '@/lib/toolsCache';
import ToolCard from './ToolCard';
import AdBanner from './AdBanner';
import { useSearch } from '@/context/SearchContext';

export default function ToolsGrid({ initialTools, initialUpcoming }) {
  const { searchQuery } = useSearch();

  // Cache tools in sessionStorage on first render
  useEffect(() => {
    cacheTools(initialTools, initialUpcoming);
  }, [initialTools, initialUpcoming]);

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return initialTools;
    const query = searchQuery.toLowerCase();
    return initialTools.filter(
      (tool) =>
        tool.title?.toLowerCase().includes(query) ||
        tool.description?.toLowerCase().includes(query) ||
        tool.tag?.toLowerCase().includes(query)
    );
  }, [initialTools, searchQuery]);

  const filteredUpcoming = useMemo(() => {
    if (!searchQuery.trim()) return initialUpcoming;
    const query = searchQuery.toLowerCase();
    return initialUpcoming.filter(
      (tool) =>
        tool.title?.toLowerCase().includes(query) ||
        tool.description?.toLowerCase().includes(query) ||
        tool.tag?.toLowerCase().includes(query)
    );
  }, [initialUpcoming, searchQuery]);

  return (
    <>
      {/* HERO SECTION */}
      <div className="hero">
        <h1>
          Discover the Best <span style={{ color: 'var(--primary)' }}>Web Tools</span>
        </h1>
        <p>Curated list of powerful tools to supercharge your workflow.</p>
      </div>

      {/* TOOLS GRID */}
      <div className="tools-grid">
        {/* Live Tools */}
        {filteredTools.map((tool) => (
          <ToolCard key={tool._id} tool={tool} />
        ))}

        {/* In-Feed Ad — show between live and upcoming */}
        {(filteredTools.length > 0 || filteredUpcoming.length > 0) && (
          <AdBanner position="in-feed" />
        )}

        {/* Upcoming Tools */}
        {filteredUpcoming.map((tool) => (
          <ToolCard key={tool._id} tool={tool} isUpcoming />
        ))}
      </div>
    </>
  );
}
