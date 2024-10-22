import { getPageTheme } from './actions';

export async function GET(
  req: Request,
  { params }: { params: { pageSlug: string } }
) {
  const url = new URL(req.url);

  let hostname = url.hostname;

  if (process.env.NODE_ENV === 'development') {
    hostname = 'localhost:3000';
  }

  const page = await getPageTheme(params.pageSlug, hostname);

  if (!page) {
    return Response.json({
      error: {
        message: 'Page not found',
      },
    });
  }

  return Response.json(page);
}
