import { getPageTheme } from './actions';

export async function GET(
  req: Request,
  { params }: { params: { pageSlug: string } }
) {
  const url = new URL(req.url);

  const page = await getPageTheme({ slug: params.pageSlug });

  if (!page) {
    return Response.json({
      error: {
        message: 'Page not found',
      },
    });
  }

  return Response.json(page);
}
