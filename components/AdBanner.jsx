'use client';

import { useEffect, useRef } from 'react';

export default function AdBanner({ position = 'header' }) {
  const zoneId = '11767574';
  const containerRef = useRef(null);
  const hasRunRef = useRef(false);

  const classMap = {
    header: 'ad-header',
    footer: 'ad-footer',
    'in-feed': 'ad-in-feed',
  };

  const sizeMap = {
    header: '728 × 90',
    footer: '728 × 90',
    'in-feed': '728 × 90',
  };

  useEffect(() => {
    if (!containerRef.current || hasRunRef.current) return;

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
  }, [zoneId]);

  return (
    <div className={`ad-placeholder ${classMap[position] || 'ad-header'}`}>
      <div className="ad-placeholder-label">
        <span className="ad-icon">📢</span>
        <span className="ad-text">Advertisement</span>
        <span className="ad-size">{sizeMap[position] || '728 × 90'}</span>
      </div>
      <div className="ad-script-container" ref={containerRef} />
    </div>
  );
}
