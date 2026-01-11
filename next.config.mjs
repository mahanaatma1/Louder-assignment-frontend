/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.timeout.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.evbuc.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.evbuc.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.timeout.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.eventbrite.com.au',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.eventbrite.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
