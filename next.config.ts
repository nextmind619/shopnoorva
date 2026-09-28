import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion", "date-fns"],
  },
  images: {
    qualities: [75, 80, 90, 95],
    localPatterns: [
      { pathname: "/products/**" },
      { pathname: "/lifestyle/**" },
      { pathname: "/products/**", search: "?v=*" },
      { pathname: "/lifestyle/**", search: "?v=*" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "image.pollinations.ai" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  poweredByHeader: false,
  compress: true,
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "X-DNS-Prefetch-Control", value: "on" },
      ],
    },
    {
      source: "/:path*\\.(png|jpg|jpeg|webp|gif|avif|svg|ico|woff2|woff|mp4|webm)",
      headers: [
        { key: "Cross-Origin-Resource-Policy", value: "same-site" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/ar/products/:slug*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      ],
    },
    {
      source: "/ar",
      headers: [
        {
          key: "Cache-Control",
          value: "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      ],
    },
  ],
};

export default withNextIntl(nextConfig);
