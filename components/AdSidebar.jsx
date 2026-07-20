'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdSidebar({ side = 'left', delay = 0 }) {
  const zoneId = '11767662';
  const [shouldRender, setShouldRender] = useState(delay === 0);
  const containerRef = useRef(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  useEffect(() => {
    if (!shouldRender || !containerRef.current || hasRunRef.current) return;

    let timeoutId;
    const runAd = () => {
      if (window.aclib && typeof window.aclib.runBanner === 'function') {
        try {
          hasRunRef.current = true;
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.text = `aclib.runBanner({ zoneId: '${zoneId}' });`;
          if (containerRef.current) {
            containerRef.current.appendChild(script);
          }
        } catch (e) {
          console.error('Adcash runBanner error:', e);
        }
      } else {
        timeoutId = setTimeout(runAd, 200);
      }
    };

    runAd();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [shouldRender, zoneId]);

  return (
    <aside className="ad-column">
      <div className="ad-sticky">
        <div className="ad-placeholder-label">
          <span className="ad-icon">📢</span>
          <span className="ad-text">Advertisement</span>
          <span className="ad-size">160 × 600</span>
        </div>
        {shouldRender && (
          <div className="ad-script-container" ref={containerRef} />
        )}
      </div>
    </aside>
  );
}
