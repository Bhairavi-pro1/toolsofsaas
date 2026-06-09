'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // Initialize search query from URL on client mount and pathname changes
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('search') || '';
      setSearchQuery(query);
    };

    handleUrlChange();
    
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [pathname]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    
    // If not on the homepage, redirect to home with search parameter
    if (pathname !== '/') {
      const params = new URLSearchParams();
      if (query) {
        params.set('search', query);
      }
      router.push(`/?${params.toString()}`);
    } else {
      // If on the homepage, update the URL search param without pushing a new history state if possible
      const params = new URLSearchParams(window.location.search);
      if (query) {
        params.set('search', query);
      } else {
        params.delete('search');
      }
      const newUrl = params.toString() ? `/?${params.toString()}` : '/';
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    }
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery: handleSearchChange }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
