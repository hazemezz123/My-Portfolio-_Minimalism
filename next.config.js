/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint checking during build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
  images: {
    domains: ["localhost", "vercel.app", "res.cloudinary.com"],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "hazemdev.vercel.app"],
    },
  },
};

module.exports = nextConfig;
