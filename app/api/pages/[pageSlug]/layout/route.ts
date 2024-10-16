import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { pageSlug: string } }
) {
  const pageSlug = params.pageSlug;

  if (!pageSlug) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  const page = await prisma.page.findUnique({
    where: {
      deletedAt: null,
      slug: pageSlug,
    },
  });

  if (!page) {
    return Response.json({
      error: {
        message: 'Page not found',
      },
    });
  }

  return Response.json({ sm: page.config, xxs: page.mobileConfig });
}
