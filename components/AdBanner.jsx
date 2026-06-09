'use client';



export default function AdBanner({ position = 'header' }) {
  const adKey = 'aef569c54412b99210cfcddce334527f';

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

  const iframeHtml = `<!DOCTYPE html>
<html>
  <head>
    <style>
      body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
  </body>
</html>`;

  return (
    <div className={`ad-placeholder ${classMap[position] || 'ad-header'}`}>
      <div className="ad-placeholder-label">
        <span className="ad-icon">📢</span>
        <span className="ad-text">Advertisement</span>
        <span className="ad-size">{sizeMap[position] || '728 × 90'}</span>
      </div>
      <div className="ad-script-container">
        <iframe
          srcDoc={iframeHtml}
          width="728"
          height="90"
          frameBorder="0"
          scrolling="no"
          style={{ border: 'none', overflow: 'hidden', backgroundColor: 'transparent' }}
          title="Advertisement"
        />
      </div>
    </div>
  );
}
