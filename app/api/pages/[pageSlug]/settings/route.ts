import { auth } from '@/app/lib/auth';
import { getPageSettings } from './actions';

export async function GET(
  req: Request,
  { params }: { params: { pageSlug: string } }
) {
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
