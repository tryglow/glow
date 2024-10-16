'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { isForbiddenSlug, isReservedSlug } from '@/lib/slugs';

import { FormValues as DesignPageSettingsFormValues } from './design-settings-form';
import { FormValues as GeneralPageSettingsFormValues } from './general-settings-form';
import { designPageSettingsSchema, generalPageSettingsSchema } from './shared';

export const fetchPageSettings = async (slug: string) => {
  const session = await auth();

  if (!session) {
    return null;
  }

  const page = await prisma.page.findUnique({
    where: {
      deletedAt: null,
      slug,
      userId: session.user.id,
    },
    select: {
      id: true,
      publishedAt: true,
      slug: true,
      metaTitle: true,
      metaDescription: true,
      backgroundImage: true,
      themeId: true,
    },
  });

  return {
    page,
  };
};

export const updateGeneralPageSettings = async (
  formData: GeneralPageSettingsFormValues,
  currentPageSlug: string
) => {
  const session = await auth();

  if (!session) {
    return {
      message: 'error',
      data: null,
    };
  }

  const validatedFields = generalPageSettingsSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: {
        message: 'Missing required fields',
      },
    };
  }

  const { metaTitle, pageSlug, published } = validatedFields.data;

  if (!pageSlug || !metaTitle) {
    return {
      error: {
        message: 'Missing required fields',
      },
    };
  }

  if (currentPageSlug !== pageSlug) {
    const existingPage = await prisma.page.findUnique({
      where: {
        deletedAt: null,
        slug: pageSlug,
      },
    });

    if (isForbiddenSlug(pageSlug)) {
      return {
        error: {
          message: 'Slug is forbidden',
          field: 'pageSlug',
        },
      };
    }

    if (isReservedSlug(pageSlug)) {
      return {
        error: {
          message: 'Slug is reserved - reach out on twitter to request this',
          field: 'pageSlug',
        },
      };
    }

    if (existingPage) {
      return {
        error: {
          message: 'Page with this slug already exists',
          field: 'pageSlug',
        },
      };
    }
  }

  const page = await prisma.page.findUnique({
    where: {
      deletedAt: null,
      team: {
        id: session.currentTeamId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      slug: currentPageSlug,
    },
  });

  if (!page) {
    return {
      error: {
        message: 'Page not found',
      },
    };
  }

  const updatedPage = await prisma.page.update({
    where: {
      team: {
        id: session.currentTeamId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      slug: currentPageSlug,
    },
    data: {
      metaTitle,
      slug: pageSlug,
      publishedAt: published ? new Date() : null,
    },
    select: {
      id: true,
    },
  });

  return {
    data: {
      page: updatedPage,
    },
  };
};

export const updateDesignPageSettings = async (
  formData: DesignPageSettingsFormValues,
  currentPageSlug: string
) => {
  const session = await auth();

  if (!session) {
    return {
      error: {
        message: 'Unauthorized',
      },
    };
  }

  const validatedFields = designPageSettingsSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: {
        message: 'Missing required fields',
      },
    };
  }

  const { themeId, backgroundImage } = validatedFields.data;

  const updatedPage = await prisma.page.update({
    where: {
      slug: currentPageSlug,
      team: {
        id: session.currentTeamId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    data: {
      themeId,
      backgroundImage,
    },
    select: {
      id: true,
    },
  });

  return {
    data: {
      page: updatedPage,
    },
  };
};
