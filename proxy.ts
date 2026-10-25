import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);

export default function proxy(req: NextRequest) {
  // www.agenticlabs.site is served by the same Railway service; send it to the canonical apex.
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  if (host.startsWith('www.')) {
    const url = new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${host.slice(4)}`);
    return NextResponse.redirect(url, 308);
  }
  return intl(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(es|en)/:path*']
};
