/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
};

export default nextConfig;
