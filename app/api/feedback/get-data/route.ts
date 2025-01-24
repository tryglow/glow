import prisma from '@/lib/prisma';

// GET Handler
export async function GET(req: Request) {
  try {
    // Extract `pageId` from the query parameters
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get('pageId');
    const type = searchParams.get('type') || '';

    if (!pageId) {
      return Response.json({ error: 'pageId is required' }, { status: 400 });
    }

    // Fetch feedback data for the given pageId
    const feedback = await prisma.feedback.findMany({
      where: { pageId, blockType: type },
    });

    return Response.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}