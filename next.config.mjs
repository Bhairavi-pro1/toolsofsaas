/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Link',
            value: '<https://toolsofsaas.com/llms.txt>; rel="alternate"; type="text/markdown"',
          },
          {
            key: 'Content-Signal',
            value: 'search=yes, ai-train=no',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/tools/errorfixer',
        destination: 'https://errorfixer.toolsofsaas.com',
        permanent: true,
      },
      {
        source: '/tools/errorfixer/:path*',
        destination: 'https://errorfixer.toolsofsaas.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
