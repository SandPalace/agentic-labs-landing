import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable to prevent double-mounting of Three.js canvas
};

export default withNextIntl(nextConfig);
