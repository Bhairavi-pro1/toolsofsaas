'use client';

import { useState, useEffect } from 'react';

export default function AdSidebar({ side = 'left', delay = 0 }) {
  const adKey = '6e75c818adcfc7f15760a313b747c7e0';
  const [shouldRender, setShouldRender] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  const iframeHtml = `<!DOCTYPE html>
<html>
  <head>
    <!-- Side: ${side} -->
    <style>
      body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : 600,
        'width' : 160,
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js?side=${side}"></script>
  </body>
</html>`;

  return (
    <aside className="ad-column">
      <div className="ad-sticky">
        <div className="ad-placeholder-label">
          <span className="ad-icon">📢</span>
          <span className="ad-text">Advertisement</span>
          <span className="ad-size">160 × 600</span>
        </div>
        {shouldRender && (
          <div className="ad-script-container">
            <iframe
              srcDoc={iframeHtml}
              width="160"
              height="600"
              frameBorder="0"
              scrolling="no"
              style={{ border: 'none', overflow: 'hidden', backgroundColor: 'transparent' }}
              title={`Advertisement ${side}`}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
