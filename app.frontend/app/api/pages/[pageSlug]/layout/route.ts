import { getPageLayout } from './actions';

export async function GET(req: Request, props: { params: Promise<{ pageSlug: string }> }) {
  const params = await props.params;
  const pageSlug = params.pageSlug;

  if (!pageSlug) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  const page = await getPageLayout({ slug: pageSlug });

  if (!page) {
    return Response.json({
      error: {
        message: 'Page not found',
      },
    });
  }

  return Response.json({ sm: page.sm, xxs: page.xxs });
}
