/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/company/about',
        permanent: true,
      },
      {
        source: '/news',
        destination: '/company/news',
        permanent: true,
      },
      {
        source: '/team',
        destination: '/company/team',
        permanent: true,
      },
      {
        source: '/careers',
        destination: '/company/careers',
        permanent: true,
      },
      {
        source: '/careers/:id',
        destination: '/company/careers/:id',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
