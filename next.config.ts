import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export', // Enable static export for GitHub Pages
  assetPrefix: isProd ? '/agentic-labs-landing/' : '',
  basePath: isProd ? '/agentic-labs-landing' : '',
  reactStrictMode: false, // Disable to prevent double-mounting of Three.js canvas
  images: {
    unoptimized: true, // Required for static export
  },
};

export default withNextIntl(nextConfig);
