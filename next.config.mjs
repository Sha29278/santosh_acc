/** @type {import("next").NextConfig} */
const nextConfig = {
  // Dev origins for LAN access
  allowedDevOrigins: ['192.168.1.7', '192.168.1.11'],

  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,

  // Image optimization (we use mostly SVGs, no external images)
  images: {
    unoptimized: true,
  },

  // Custom domain ready — add your domain in Vercel dashboard
  // No changes needed here, Vercel handles domains automatically
};

export default nextConfig;
