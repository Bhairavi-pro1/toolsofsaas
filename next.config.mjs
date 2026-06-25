/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/errorfixer',
        destination: 'https://errorfixer002.netlify.app/errorfixer',
      },
      {
        source: '/errorfixer/:path*',
        destination: 'https://errorfixer002.netlify.app/errorfixer/:path*',
      },
    ];
  },
};

export default nextConfig;
