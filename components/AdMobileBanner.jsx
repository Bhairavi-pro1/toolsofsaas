'use client';

import { useEffect, useRef } from 'react';
import { ADS_CONFIG, areAdsEnabled } from '@/lib/adsConfig';

export default function AdMobileBanner({ className = '' }) {
  const isEnabled = areAdsEnabled();
  const adKey = ADS_CONFIG.highRevenueFormat?.mobileBannerKey || '08c962ba39cc51ed22ba2dd21a43b419';
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isEnabled || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.width = '320';
    iframe.height = '50';
    iframe.title = 'Mobile Advertisement';
    iframe.style.width = '320px';
    iframe.style.height = '50px';
    iframe.style.maxWidth = '100%';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';
    iframe.setAttribute('frameborder', '0');

    containerRef.current.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              html, body {
                margin: 0;
                padding: 0;
                width: 320px;
                height: 50px;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                background: transparent;
              }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '${adKey}',
                'format' : 'iframe',
                'height' : 50,
                'width' : 320,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://www.highrevenueformat.com/${adKey}/invoke.js"></script>
          </body>
        </html>
      `);
      doc.close();
    }
  }, [isEnabled, adKey]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className={`ad-mobile-only ad-mobile-banner ${className}`}>
      <div
        className="ad-script-container"
        ref={containerRef}
        style={{ width: '320px', height: '50px', overflow: 'hidden' }}
      />
    </div>
  );
}
