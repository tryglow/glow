import { uploadAsset } from '@/app/api/page/asset/upload/actions';
import { auth } from '@/app/lib/auth';
import { encrypt } from '@/lib/encrypt';
import prisma from '@/lib/prisma';
import { captureException } from '@sentry/nextjs';
import { track } from '@vercel/analytics/server';
import safeAwait from 'safe-await';

// Example output: "x7hj2k9"
const generateRandomCode = () => {
  return Math.random().toString(36).substring(2, 9);
};

const createPage = async ({
  teamId,
  userId,
  tiktokUsername,
}: {
  teamId: string;
  userId: string;
  tiktokUsername: string;
}) => {
  let newPageSlug = tiktokUsername;

  const [existingPageError, existingPage] = await safeAwait(
    prisma.page.findFirst({
      where: {
        slug: tiktokUsername,
        deletedAt: null,
      },
    })
  );

  if (existingPageError) {
    captureException(existingPageError);
    return null;
  }

  if (existingPage) {
    newPageSlug = `${tiktokUsername}-${generateRandomCode()}`;
  }

  try {
    const page = await prisma.page.create({
      data: {
        userId,
        teamId,
        slug: newPageSlug,
        metaTitle: `${tiktokUsername} on Glow`,
        metaDescription: `${tiktokUsername} on Glow`,
        publishedAt: new Date(),
        config: {},
      },
    });

    return page;
  } catch (error) {
    captureException(error);
    return null;
  }
};

const createHeaderBlock = async ({
  pageId,
  tiktokUsername,
  tiktokDisplayName,
  avatarUrl,
}: {
  pageId: string;
  tiktokUsername: string;
  tiktokDisplayName: string;
  avatarUrl?: string | null;
}) => {
  try {
    const block = await prisma.block.create({
      data: {
        pageId,
        type: 'header',
        config: {},
        data: {
          title: tiktokDisplayName,
          description: `@${tiktokUsername} on Glow`,
          avatar: avatarUrl
            ? {
                src: avatarUrl,
              }
            : undefined,
        },
      },
    });

    return block;
  } catch (error) {
    captureException(error);
    return null;
  }
};

const createContentBlock = async ({ pageId }: { pageId: string }) => {
  try {
    const block = await prisma.block.create({
      data: {
        pageId,
        type: 'content',
        config: {},
        data: {
          title: 'Welcome to my page!',
          content:
            "This is my new page on Glow. I'm a TikTok creator, and I post videos about... well, you'll have to see for yourself!",
        },
      },
    });

    return block;
  } catch (error) {
    captureException(error);
    return null;
  }
};

const createStackBlock = async ({ pageId }: { pageId: string }) => {
  try {
    const block = await prisma.block.create({
      data: {
        pageId,
        type: 'stack',
        config: {},
        data: {
          items: [
            {
              icon: {
                src: 'https://cdn.glow.as/default-data/icons/instagram.svg',
              },
              link: 'https://instagram.com',
              label: '@yourinstagramhandle',
              title: 'Instagram',
            },
            {
              icon: {
                src: 'https://cdn.glow.as/default-data/icons/twitter.svg',
              },
              link: 'https://x.com',
              label: '@yourxhandle',
              title: 'X / Twitter',
            },
            {
              icon: {
                src: 'https://cdn.glow.as/default-data/icons/youtube.svg',
              },
              link: 'https://youtube.com',
              label: '@youryoutubechannel',
              title: 'YouTube',
            },
          ],
          label: 'My links',
          title: 'Find me here',
        },
      },
    });

    return block;
  } catch (error) {
    captureException(error);
    return null;
  }
};

const createTikTokFollowersBlock = async ({
  pageId,
  integrationId,
}: {
  pageId: string;
  integrationId: string;
}) => {
  try {
    const block = await prisma.block.create({
      data: {
        pageId,
        type: 'tiktok-follower-count',
        config: {},
        data: {},
      },
    });

    await prisma.block.update({
      where: {
        id: block.id,
      },
      data: {
        integration: {
          connect: {
            id: integrationId,
          },
        },
      },
    });

    return block;
  } catch (error) {
    captureException(error);
    return null;
  }
};

const createTikTokLatestVideoBlock = async ({
  pageId,
  integrationId,
  hasLatestVideo,
}: {
  pageId: string;
  integrationId: string;
  hasLatestVideo: boolean;
}) => {
  if (!hasLatestVideo) {
    return null;
  }

  try {
    const block = await prisma.block.create({
      data: {
        pageId,
        type: 'tiktok-latest-post',
        config: {},
        data: {},
      },
    });

    await prisma.block.update({
      where: {
        id: block.id,
      },
      data: {
        integration: {
          connect: {
            id: integrationId,
          },
        },
      },
    });

    return block;
  } catch (error) {
    captureException(error);
    return null;
  }
};

const createTiktokIntegration = async ({
  userId,
  teamId,
  accessToken,
  refreshToken,
}: {
  userId: string;
  teamId: string;
  accessToken: string;
  refreshToken: string;
}) => {
  const encryptedConfig = await encrypt({
    accessToken,
    refreshToken,
  });

  try {
    const integration = await prisma.integration.create({
      data: {
        userId,
        teamId,
        type: 'tiktok',
        encryptedConfig,
        config: {},
      },
    });

    return integration;
  } catch (error) {
    captureException(error);
    return null;
  }
};

const fetchTikTokProfile = async ({ accessToken }: { accessToken: string }) => {
  const options = {
    fields: 'avatar_url,display_name,follower_count,username',
  };

  const qs = new URLSearchParams(options).toString();

  const req = await fetch(`https://open.tiktokapis.com/v2/user/info/?${qs}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { data, error } = await req.json();

  console.log('ERROR', error);

  if (!error.ok) {
    captureException(error);
    return null;
  }

  return {
    followerCount: data.user.follower_count,
    profile: {
      username: data.user.username,
      displayName: data.user.display_name,
      avatarUrl: data.user.avatar_url,
    },
  };
};

const checkHasPublishedVideo = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  const fields = ['id', 'title'];

  const qs = new URLSearchParams({
    fields: fields.join(','),
  }).toString();

  const req = await fetch(`https://open.tiktokapis.com/v2/video/list/?${qs}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'POST',
    next: {
      revalidate: 60,
    },
    body: JSON.stringify({
      max_count: 1,
    }),
  });

  const { data, error } = await req.json();

  if (!error.ok) {
    return false;
  }

  if (data.videos && data.videos.length > 0) {
    return true;
  }

  return false;
};

const setPageConfig = async ({
  pageId,
  headerBlockId,
  contentBlockId,
  stackBlockId,
  tiktokFollowersBlockId,
  tiktokLatestVideoBlockId,
}: {
  pageId: string;
  headerBlockId: string;
  contentBlockId: string;
  stackBlockId: string;
  tiktokFollowersBlockId: string;
  tiktokLatestVideoBlockId?: string | null;
}) => {
  const config = [
    {
      h: 5,
      i: headerBlockId,
      w: 12,
      x: 0,
      y: 0,
      moved: false,
      static: true,
    },
    {
      h: 3,
      i: contentBlockId,
      w: 12,
      x: 0,
      y: 5,
      moved: false,
      static: false,
    },
    {
      h: 5,
      i: tiktokFollowersBlockId,
      w: 6,
      x: 0,
      y: 12,
      moved: false,
      static: false,
    },
    {
      h: 8,
      i: stackBlockId,
      w: 6,
      x: tiktokLatestVideoBlockId ? 0 : 6,
      y: tiktokLatestVideoBlockId ? 17 : 12,
      moved: false,
      static: false,
    },
  ];

  if (tiktokLatestVideoBlockId) {
    config.push({
      h: 13,
      i: tiktokLatestVideoBlockId,
      w: 6,
      x: 6,
      y: 12,
      moved: false,
      static: false,
    });
  }

  const mobileConfig = [
    {
      h: 5,
      i: headerBlockId,
      w: 12,
      x: 0,
      y: 0,
      moved: false,
      static: true,
    },
    {
      h: 4,
      i: contentBlockId,
      w: 12,
      x: 0,
      y: 5,
      moved: false,
      static: false,
    },
    {
      h: 4,
      i: tiktokFollowersBlockId,
      w: 12,
      x: 0,
      y: 9,
      moved: false,
      static: false,
    },
    {
      h: 8,
      i: stackBlockId,
      w: 12,
      x: 0,
      y: 13,
      moved: false,
      static: false,
    },
  ];

  if (tiktokLatestVideoBlockId) {
    mobileConfig.push({
      h: 12,
      i: tiktokLatestVideoBlockId,
      w: 10,
      x: 1,
      y: 25,
      moved: false,
      static: false,
    });
  }

  await prisma.page.update({
    where: {
      id: pageId,
    },
    data: {
      config,
      mobileConfig,
      themeId: '14fc9bdf-f363-4404-b05e-856670722fda',
    },
  });
};

const getTikTokAccessToken = async () => {
  const session = await auth();

  const tiktokAccount = await prisma.account.findFirst({
    where: {
      userId: session?.user.id,
      provider: 'tiktok',
    },
  });

  if (!tiktokAccount) {
    return null;
  }

  return {
    refreshToken: tiktokAccount?.refresh_token,
    accessToken: tiktokAccount?.access_token,
  };
};

const uploadAvatar = async ({
  avatarUrl,
  referenceId,
}: {
  avatarUrl: string;
  referenceId: string;
}) => {
  if (!avatarUrl) {
    return null;
  }

  const imageResponse = await fetch(avatarUrl);

  if (!imageResponse.ok || !imageResponse.body) {
    captureException(new Error('Failed to fetch avatar image'));
    return null;
  }

  const blob = await imageResponse.blob();
  const file = new File([blob], 'avatar.png', { type: blob.type });

  const uploadResult = await uploadAsset({
    context: 'blockAsset',
    file,
    referenceId,
  });

  if (!uploadResult.data || uploadResult.error) {
    captureException(new Error('Failed to upload avatar image'));
    return null;
  }

  return uploadResult.data.url;
};

export async function orchestrateTikTok(orchestrationId: string) {
  const session = await auth();

  if (!session?.user) {
    return {
      error: 'Not authenticated',
    };
  }

  if (!session.currentTeamId || session.currentTeamId === '') {
    captureException(
      new Error('User tried to create a TikTok page without a team')
    );

    return {
      error: 'No team found',
    };
  }

  const orchestration = await prisma.orchestration.findUnique({
    where: {
      id: orchestrationId,
      pageGeneratedAt: null,
    },
  });

  if (!orchestration) {
    return {
      error: 'Orchestration not found',
    };
  }

  if (orchestration.expiresAt < new Date()) {
    return {
      error: 'Orchestration expired',
    };
  }

  // Tmp delay to allow token to be refreshed
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const tiktokTokens = await getTikTokAccessToken();

  if (!tiktokTokens?.accessToken) {
    return {
      error: 'No access token found',
    };
  }

  if (!tiktokTokens?.refreshToken) {
    return {
      error: 'No refresh token found',
    };
  }

  const tiktokData = await fetchTikTokProfile({
    accessToken: tiktokTokens.accessToken,
  });

  if (!tiktokData) {
    return {
      error: 'Unable to fetch TikTok profile',
    };
  }

  const hasPublishedVideo = await checkHasPublishedVideo({
    accessToken: tiktokTokens.accessToken,
  });

  const page = await createPage({
    teamId: session.currentTeamId,
    userId: session.user.id,
    tiktokUsername: tiktokData?.profile?.username,
  });

  if (!page) {
    return {
      error: 'Unable to create page',
    };
  }

  const uploadedAvatarUrl = await uploadAvatar({
    avatarUrl: tiktokData?.profile?.avatarUrl,
    referenceId: `orchestrator-tiktok-avatar-${page.id}`,
  });

  const tiktokIntegration = await createTiktokIntegration({
    teamId: session.currentTeamId,
    userId: session.user.id,
    accessToken: tiktokTokens.accessToken,
    refreshToken: tiktokTokens.refreshToken,
  });

  if (!tiktokIntegration) {
    return {
      error: 'Unable to create TikTok integration',
    };
  }

  const headerBlock = await createHeaderBlock({
    pageId: page.id,
    tiktokUsername: tiktokData?.profile?.username,
    tiktokDisplayName: tiktokData?.profile?.displayName,
    avatarUrl: uploadedAvatarUrl,
  });

  if (!headerBlock) {
    return {
      error: 'Unable to create header block',
    };
  }

  const contentBlock = await createContentBlock({
    pageId: page.id,
  });

  if (!contentBlock) {
    return {
      error: 'Unable to create content block',
    };
  }

  const stackBlock = await createStackBlock({
    pageId: page.id,
  });

  if (!stackBlock) {
    return {
      error: 'Unable to create stack block',
    };
  }

  const tiktokFollowersBlock = await createTikTokFollowersBlock({
    pageId: page.id,
    integrationId: tiktokIntegration.id,
  });

  if (!tiktokFollowersBlock) {
    return {
      error: 'Unable to create TikTok followers block',
    };
  }

  const tiktokLatestVideoBlock = await createTikTokLatestVideoBlock({
    pageId: page.id,
    integrationId: tiktokIntegration.id,
    hasLatestVideo: hasPublishedVideo,
  });

  await setPageConfig({
    pageId: page.id,
    headerBlockId: headerBlock.id,
    tiktokFollowersBlockId: tiktokFollowersBlock.id,
    contentBlockId: contentBlock.id,
    stackBlockId: stackBlock.id,
    tiktokLatestVideoBlockId: tiktokLatestVideoBlock?.id,
  });

  await track('tiktokPageOrchestrated', {
    userId: session.user.id,
    pageId: page.id,
  });

  await prisma.orchestration.update({
    where: {
      id: orchestrationId,
    },
    data: {
      pageGeneratedAt: new Date(),
      page: {
        connect: {
          id: page.id,
        },
      },
    },
  });

  // Experience some delay to simulate the page being built
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    success: true,
    data: {
      pageSlug: page.slug,
    },
  };
}
