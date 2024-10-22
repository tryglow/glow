import { auth } from '@/app/lib/auth';
import { getPageSettings } from './actions';

export async function GET(req: Request, props: { params: Promise<{ pageSlug: string }> }) {
  const params = await props.params;
  const session = await auth();

  if (!session) {
    return Response.json({
      error: {
        message: 'Unauthorized',
      },
    });
  }

  const page = await getPageSettings({ slug: params.pageSlug });

  if (!page) {
    return Response.json({
      error: {
        message: 'Page not found',
      },
    });
  }

  return Response.json(page);
}
