import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'export', // Enable static export for GitHub Pages
  assetPrefix: '/agentic-labs-landing',
  basePath: '/agentic-labs-landing',
  trailingSlash: true, // Required for proper static routing
  reactStrictMode: false, // Disable to prevent double-mounting of Three.js canvas
  images: {
    unoptimized: true, // Required for static export
  },
};

export default withNextIntl(nextConfig);
