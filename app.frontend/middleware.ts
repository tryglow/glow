import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export const config: MiddlewareConfig = {
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
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  // Get hostname and normalize for dev environment - using a regex for better performance
  const hostname = req.headers
    .get('host')!
    .replace(new RegExp(`.dev.glow:3000$`), `.${rootDomain}`);

  // Create base URL once
  const baseUrl = new URL('', req.url);

  // Handle app subdomain
  if (hostname === `app.${rootDomain}`) {
    return handleAppSubdomain(req, url.pathname, baseUrl);
  }

  // Handle root domain
  if (hostname === rootDomain) {
    return handleRootDomain(req, url.pathname, baseUrl);
  }

  // Handle unknown domains - reuse baseUrl
  baseUrl.pathname = `/${hostname}/unknown`;
  return NextResponse.rewrite(baseUrl);
}

async function handleAppSubdomain(
  req: NextRequest,
  path: string,
  baseUrl: URL
) {
  const getToken = (await import('@auth/core/jwt')).getToken;
  const session = await getToken({ req });

  // Handle authentication redirects
  if (!session && path !== '/login') {
    baseUrl.pathname = '/login';
    baseUrl.search = req.nextUrl.searchParams.toString();
    return NextResponse.redirect(baseUrl);
  }

  if (session && path === '/login') {
    baseUrl.pathname = '/';
    baseUrl.search = req.nextUrl.searchParams.toString();
    return NextResponse.redirect(baseUrl);
  }

  // Rewrite to app directory
  baseUrl.pathname = `/app${path === '/' ? '' : path}`;
  baseUrl.search = req.nextUrl.searchParams.toString();
  return NextResponse.rewrite(baseUrl);
}

function handleRootDomain(req: NextRequest, path: string, baseUrl: URL) {
  const searchParams = req.nextUrl.searchParams.toString();

  // Redirect root to landing page
  if (path === '/') {
    baseUrl.pathname = '/i/landing-page';
    baseUrl.search = searchParams;
    return NextResponse.rewrite(baseUrl);
  }

  // Handle special paths
  if (path.startsWith('/new')) {
    baseUrl.pathname = path;
    baseUrl.search = searchParams;
    return NextResponse.rewrite(baseUrl);
  }

  // Rewrite all other paths
  baseUrl.pathname = `/${req.headers.get('host')}${path}`;
  baseUrl.search = searchParams;
  return NextResponse.rewrite(baseUrl);
}
