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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.RENDER_EXTERNAL_URL
    ? `https://${process.env.RENDER_EXTERNAL_URL.replace(/^https?:\/\//, '')}`
    : 'https://toolsofsaas.com');

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ToolsOfSaaS - Discover Best Web Tools & SaaS Solutions',
    template: '%s | ToolsOfSaaS',
  },
  description:
    'ToolsOfSaaS is the ultimate curated directory for discovering powerful web-based tools and SaaS solutions to supercharge your workflow.',
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
      'ToolsOfSaaS is the ultimate curated directory for discovering powerful web-based tools and SaaS solutions to supercharge your workflow.',
    images: [
      {
        url: '/og-image.png',
        width: 640,
        height: 640,
        type: 'image/png',
        alt: 'ToolsOfSaaS - Discover Best Web Tools & SaaS Solutions',
      },
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        type: 'image/png',
        alt: 'ToolsOfSaaS Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolsOfSaaS - Discover Best Web Tools & SaaS Solutions',
    description:
      'ToolsOfSaaS is the ultimate curated directory for discovering powerful web-based tools and SaaS solutions to supercharge your workflow.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }) {
  const adsEnabled = areAdsEnabled();

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        {/* OpenGraph / Social Media Link Preview Meta Tags */}
        <meta property="og:site_name" content="ToolsOfSaaS" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ToolsOfSaaS - Discover Best Web Tools & SaaS Solutions" />
        <meta
          property="og:description"
          content="ToolsOfSaaS is the ultimate curated directory for discovering powerful web-based tools and SaaS solutions to supercharge your workflow."
        />
        <meta property="og:image" content={`${siteUrl}/og-image.png`} />
        <meta property="og:image:secure_url" content={`${siteUrl}/og-image.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="640" />
        <meta property="og:image:height" content="640" />
        <meta property="og:image:alt" content="ToolsOfSaaS - Discover Best Web Tools & SaaS Solutions" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ToolsOfSaaS - Discover Best Web Tools & SaaS Solutions" />
        <meta
          name="twitter:description"
          content="ToolsOfSaaS is the ultimate curated directory for discovering powerful web-based tools and SaaS solutions to supercharge your workflow."
        />
        <meta name="twitter:image" content={`${siteUrl}/og-image.png`} />

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
