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
