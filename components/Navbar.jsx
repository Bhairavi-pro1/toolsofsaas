'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import { useSearch } from '@/context/SearchContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
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

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : 'transparent'}`}>
      <Link href="/" className="logo">
        <img src="/favicon.png" alt="ToolsOfSaaS Logo" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
        <span>ToolsOfSaaS</span>
      </Link>
      <div className="nav-links">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Link href="/blog" className="nav-link">
          Blog
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
