import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // Skip all internal Next.js paths
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
