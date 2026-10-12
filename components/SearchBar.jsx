'use client';

import { useEffect, useRef } from 'react';
import { useSearch } from '@/context/SearchContext';

export default function SearchBar({ searchQuery: propQuery, setSearchQuery: propSetQuery }) {
  const searchCtx = useSearch();
  const searchQuery = propQuery !== undefined ? propQuery : searchCtx.searchQuery;
  const setSearchQuery = propSetQuery !== undefined ? propSetQuery : searchCtx.setSearchQuery;
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus on pressing "/" if not already typing in an input
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="search-container">
      <input
        ref={inputRef}
        type="text"
        id="searchInput"
        className="search-input"
        placeholder="Search for tools..."
        aria-label="Search for tools"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="search-icon-wrapper">
        {searchQuery ? (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : (
          <>
            {/* <span className="search-shortcut">/</span> */}
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
          </>
        )}
      </div>
    </div>
  );
}

