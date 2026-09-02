import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { ADS_CONFIG, areAdsEnabled } from '@/lib/adsConfig';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsofsaas.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ToolsOfSaaS - Discover Best Web Tools & SaaS Solutions',
    template: '%s | ToolsOfSaaS',
  },
  description:
    'ToolsOfSaaS is the ultimate directory for powerful web-based tools and SaaS solutions. Explore curated tools for productivity, development, design, and marketing.',
  keywords: [
    'SaaS directory',
    'web tools',
    'productivity tools',
    'developer tools',
    'free web apps',
    'ToolsOfSaaS',
    'design tools',
    'marketing tools',
    'SaaS tools',
    'best web apps',
  ],
  authors: [{ name: 'ToolsOfSaaS Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'ToolsOfSaaS',
    title: 'ToolsOfSaaS - Discover Best Web Tools & SaaS Solutions',
    description:
      'Ultimate directory for powerful web-based tools and SaaS solutions. Discover tools to supercharge your workflow.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ToolsOfSaaS - Web Tools Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolsOfSaaS - Discover Best Web Tools & SaaS Solutions',
    description:
      'Ultimate directory for powerful web-based tools and SaaS solutions. Discover tools to supercharge your workflow.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
  },
  alternates: {
    canonical: siteUrl,
  },
  other: {
    monetag: 'b5ca600ae5298abd1b918cbbb9c0560c',
  },
};

export default function RootLayout({ children }) {
  const adsEnabled = areAdsEnabled();

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <meta name="monetag" content="b5ca600ae5298abd1b918cbbb9c0560c" />
        {/* Monetag Vignette Ad Tag */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='11710230',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        />
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('theme');
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const theme = savedTheme || systemTheme;
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'ToolsOfSaaS',
              description:
                'A curated directory of the best web-based SaaS tools and productivity utilities.',
              url: siteUrl,
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              author: {
                '@type': 'Organization',
                name: 'ToolsOfSaaS',
              },
            }),
          }}
        />
        {/* Google AdSense verification / script (loaded only if Client ID is configured) */}
        {ADS_CONFIG.adsenseClientId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R22W1REZVM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R22W1REZVM');
          `}
        </Script>
        {/* Third-party ad script loaded only when ads are enabled */}
        {adsEnabled && (
          <Script
            src="https://acscdn.com/script/aclib.js"
            id="aclib"
            strategy="afterInteractive"
          />
        )}
        {children}
      </body>
    </html>
  );
}
