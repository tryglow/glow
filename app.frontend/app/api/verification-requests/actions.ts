'use server';

import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';
import { VerificationRequestStatus } from '@tryglow/prisma';

export async function createVerificationRequest({
  pageId,
  requestedPageTitle,
}: {
  pageId: string;
  requestedPageTitle: string;
}) {
  const session = await auth();

  if (!session?.user) {
    return {
      error: 'Unauthorized',
    };
  }

  if (!requestedPageTitle || requestedPageTitle.length === 0) {
    return {
      error: 'Page title is required',
    };
  }

  const page = await prisma.page.findUnique({
    where: {
      id: pageId,
      team: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
  });

  if (!page) {
    return {
      error: 'Page not found',
    };
  }

  const existingVerificationRequest =
    await prisma.verificationRequest.findFirst({
      where: {
        pageId,
      },
    });

  if (existingVerificationRequest) {
    switch (existingVerificationRequest.status) {
      case VerificationRequestStatus.APPROVED:
        return {
          error: 'A verification request already exists for this page',
        };
      case VerificationRequestStatus.PENDING:
        return {
          error: 'A verification request is already pending for this page',
        };
    }
  }

  await prisma.verificationRequest.create({
    data: {
      page: {
        connect: {
          id: pageId,
        },
      },
      requestedBy: {
        connect: {
          id: session.user.id,
        },
      },
      requestedPageTitle,
    },
  });

  return {
    success: true,
  };
}
