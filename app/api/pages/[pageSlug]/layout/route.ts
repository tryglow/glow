import { Layout } from 'react-grid-layout';

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

  /**
   * Here we build a layout for mobile where we default each item to be 12
   * columns wide. Perhaps we could make this configurable in the future.
   */
  const smallLayout = (page.config as unknown as Layout[])?.map(
    (layoutItem: Layout) => ({
      ...layoutItem,
      w: 12,
    })
  );

  return Response.json({ sm: page.config, xss: smallLayout });
}
