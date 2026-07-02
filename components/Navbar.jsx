'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import { useSearch } from '@/context/SearchContext';
import { client } from '@/sanity/lib/client';
import { TOOLS_QUERY } from '@/sanity/lib/queries';
import { getCachedTools } from '@/lib/toolsCache';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [toolsList, setToolsList] = useState([]);
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch tools for search suggestions
  useEffect(() => {
    const cached = getCachedTools();
    if (cached && cached.tools) {
      setToolsList(cached.tools);
    } else {
      const fetchTools = async () => {
        try {
          const fetched = await client.fetch(TOOLS_QUERY);
          setToolsList(fetched);
        } catch (error) {
          console.error('Failed to fetch tools for search overlay:', error);
        }
      };
      fetchTools();
    }
  }, []);

  // Lock body scroll when search overlay is active on mobile
  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOverlayOpen]);

  // Compute search suggestions
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return toolsList.slice(0, 8); // suggest first 8 tools if query is empty
    }
    const query = searchQuery.toLowerCase();
    return toolsList.filter(
      (tool) =>
        tool.title?.toLowerCase().includes(query) ||
        tool.description?.toLowerCase().includes(query) ||
        tool.tag?.toLowerCase().includes(query)
    );
  }, [toolsList, searchQuery]);

  const handleSuggestionClick = (tool) => {
    setSearchQuery(tool.title);
    setIsOverlayOpen(false);
    if (tool.href) {
      window.location.href = tool.href;
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : 'transparent'}`}>
      {/* DESKTOP NAVBAR VIEW */}
      <div className="navbar-desktop">
        <Link href="/" className="logo">
          <img src="/favicon.png" alt="ToolsOfSaaS Logo" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
          <span className="logo-text">ToolsOfSaaS</span>
        </Link>
        <div className="nav-links">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <Link href="/blog" className="nav-link">
            Blog
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* MOBILE NAVBAR VIEW */}
      <div className="navbar-mobile">
        {/* Row 1: Logo & Header Controls */}
        <div className="navbar-mobile-row">
          <Link href="/" className="logo">
            <img src="/favicon.png" alt="ToolsOfSaaS Logo" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
            <span className="logo-text-mobile">ToolsOfSaaS</span>
          </Link>
          <div className="navbar-mobile-controls">
            {/* Blog Button - styled like "Advertise" in Justdial */}
            <Link href="/blog" className="mobile-blog-btn">
              <svg 
                className="blog-btn-icon"
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
              <span>Blog</span>
            </Link>
            {/* Theme Toggle - replaces profile icon */}
            <ThemeToggle />
          </div>
        </div>

        {/* Row 2: Full-width persistent Search Bar (acts as trigger) */}
        <div className="navbar-mobile-search-row">
          <div className="mobile-search-box" onClick={() => setIsOverlayOpen(true)}>
            <span className="mobile-search-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              type="text"
              className="mobile-search-input"
              placeholder="Search for tools..."
              value={searchQuery}
              readOnly
              onClick={(e) => {
                e.stopPropagation();
                setIsOverlayOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* FULL SCREEN SEARCH OVERLAY ON MOBILE */}
      {isOverlayOpen && (
        <div className="mobile-search-overlay">
          {/* Top Header Row */}
          <div className="overlay-header">
            <button 
              className="overlay-back-btn" 
              onClick={() => setIsOverlayOpen(false)}
              aria-label="Back"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <div className="overlay-search-box">
              <span className="overlay-search-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <input
                type="text"
                className="overlay-search-input"
                placeholder="Search for tools..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="overlay-search-clear-btn" 
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Suggestions List Body */}
          <div className="overlay-body">
            <h3 className="suggestions-title">
              {searchQuery ? 'Search Results' : 'Trending Searches'}
            </h3>
            <div className="suggestions-list">
              {filteredSuggestions.map((tool) => (
                <div 
                  key={tool._id} 
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(tool)}
                >
                  <div className="suggestion-icon-wrapper">
                    <svg className="trend-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                      <polyline points="16 7 22 7 22 13" />
                    </svg>
                  </div>
                  <div className="suggestion-info">
                    <span className="suggestion-name">{tool.title}</span>
                    <span className="suggestion-category">{tool.tag || 'Tool'}</span>
                  </div>
                </div>
              ))}
              {filteredSuggestions.length === 0 && (
                <div className="no-suggestions">No tools found matching &quot;{searchQuery}&quot;</div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
