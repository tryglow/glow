import { getPageTheme } from './actions';

export async function GET(req: Request, props: { params: Promise<{ pageSlug: string }> }) {
  const params = await props.params;
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
