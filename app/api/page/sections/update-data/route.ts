import {getServerSession} from 'next-auth';
import {authOptions} from '@/lib/auth';
import prisma from '@/lib/prisma';
import {revalidatePath, revalidateTag} from 'next/cache';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({
      message: 'error',
      data: null,
    });
  }

  const bodyData = await req.json();

  const {sectionId, newData} = bodyData;

  if (!sectionId || !newData) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  const section = await prisma.section.findUnique({
    where: {
      id: sectionId,
      page: {
        userId: session.user.id,
      },
    },
  });

  if (!section) {
    return Response.json({
      error: {
        message: 'Section not found',
      },
    });
  }

  // TODO - validate newData against schema

  const updatedSection = await prisma.section.update({
    where: {
      id: sectionId,
    },
    data: {
      data: newData,
    },
  });

  return Response.json({
    data: {
      section: updatedSection,
    },
  });
}
