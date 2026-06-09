import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SearchProvider } from '@/context/SearchContext';

export default function SiteLayout({ children }) {
  return (
    <SearchProvider>
      <Navbar />
      {children} 
      <Footer />
    </SearchProvider>  
  );
}
