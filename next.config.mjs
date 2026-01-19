/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    viewTransition: true,
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
};

export default nextConfig;
