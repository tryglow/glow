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

  // Get hostname and normalize for dev environment
  const hostname = req.headers
    .get('host')!
    .replace('.dev.glow:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // Handle app subdomain
  if (hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    return handleAppSubdomain(req, url.pathname);
  }

  // Handle root domain
  if (hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    return handleRootDomain(req, url.pathname);
  }

  // Handle unknown domains
  return NextResponse.rewrite(new URL(`/${hostname}/unknown`, req.url));
}

async function handleAppSubdomain(req: NextRequest, path: string) {
  const session = await getToken({ req });

  // Handle authentication redirects
  if (!session && path !== '/login') {
    const loginUrl = new URL('/login', req.url);
    loginUrl.search = req.nextUrl.searchParams.toString();
    return NextResponse.redirect(loginUrl);
  }

  if (session && path === '/login') {
    const homeUrl = new URL('/', req.url);
    homeUrl.search = req.nextUrl.searchParams.toString();
    return NextResponse.redirect(homeUrl);
  }

  // Rewrite to app directory
  const rewriteUrl = new URL(`/app${path === '/' ? '' : path}`, req.url);
  rewriteUrl.search = req.nextUrl.searchParams.toString();
  return NextResponse.rewrite(rewriteUrl);
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
    const newUrl = new URL(path, req.url);
    newUrl.search = req.nextUrl.searchParams.toString();
    return NextResponse.rewrite(newUrl);
  }

  // Rewrite all other paths
  const rewriteUrl = new URL(`/${req.headers.get('host')}${path}`, req.url);
  rewriteUrl.search = req.nextUrl.searchParams.toString();
  return NextResponse.rewrite(rewriteUrl);
}
