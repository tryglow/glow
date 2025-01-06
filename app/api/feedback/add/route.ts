import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  
    const { pageId, email, text, option } = await req.json();

    // Validate input
    if (!pageId) {
      return Response.json({ error: 'PageId not found' });
    }

    if (!email) {
      return Response.json({ error: 'Email field is required' });
    }

    try {
      // Insert data into the Feedback table
      const feedback = await prisma.feedback.create({
        data: {
          pageId,
          email,
          text,
          option,
        },
      });

      return Response.json(feedback);
    } catch (error) {
      console.error('Error creating feedback:', error);
      return Response.json({ error: 'Internal server error' });
    }
  
}
