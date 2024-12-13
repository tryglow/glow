import { getToken } from '@auth/core/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'experimental-edge';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /i (internal pages)
     * 4. /_static (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     * 6. _vercel
     * 7. assets
     */
    '/((?!api/|_next/|i/|_static/|_vercel|assets|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams ? `?${searchParams}` : ''}`;

  // Get hostname and normalize for dev environment
  const hostname = req.headers
    .get('host')!
    .replace('.dev.glow:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // Handle app subdomain
  if (hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    return handleAppSubdomain(req, path);
  }

  // Handle root domain
  if (hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    return handleRootDomain(req, path);
  }

  // Handle unknown domains
  return NextResponse.rewrite(new URL(`/${hostname}/unknown`, req.url));
}

async function handleAppSubdomain(req: NextRequest, path: string) {
  const session = await getToken({ req });

  // Handle authentication redirects
  if (!session && path !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (session && path === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Rewrite to app directory
  return NextResponse.rewrite(
    new URL(`/app${path === '/' ? '' : path}`, req.url)
  );
}

function handleRootDomain(req: NextRequest, path: string) {
  // Redirect root to landing page
  if (path === '/') {
    const newUrl = new URL('/i/landing-page', req.url);
    newUrl.search = req.nextUrl.searchParams.toString();
    return NextResponse.rewrite(newUrl);
  }

  // Handle special paths
  if (path.startsWith('/new')) {
    return NextResponse.rewrite(new URL(path, req.url));
  }

  // Rewrite all other paths
  return NextResponse.rewrite(
    new URL(`/${req.headers.get('host')}${path}`, req.url)
  );
}
