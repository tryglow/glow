import { trustedOrigins } from '@/lib/origins';
import prisma from '@/lib/prisma';
import { createUserInitialFlags, handleUserCreated } from '@/lib/user-created';
import {
  sendMagicLinkEmail,
  sendOrganizationInvitationEmail,
  sendWelcomeEmail,
} from '@/modules/notifications/service';
import { sendNewUserSlackMessage } from '@/modules/slack/service';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, magicLink, organization } from 'better-auth/plugins';

export const auth = betterAuth({
  baseUrl: process.env.API_BASE_URL,
  rateLimit: {
    window: 10, // time window in seconds
    max: 100, // max requests in the window
  },
  trustedOrigins,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${process.env.API_BASE_URL}/api/auth/callback/google`,
    },
    twitter: {
      clientId: process.env.AUTH_TWITTER_CLIENT_ID as string,
      clientSecret: process.env.AUTH_TWITTER_CLIENT_SECRET as string,
      redirectURI: `${process.env.API_BASE_URL}/api/auth/callback/twitter`,
    },
    tiktok: {
      clientId: process.env.AUTH_TIKTOK_CLIENT_ID as string,
      clientKey: process.env.AUTH_TIKTOK_CLIENT_KEY as string,
      clientSecret: process.env.AUTH_TIKTOK_CLIENT_SECRET as string,
      redirectURI: `${process.env.API_BASE_URL}/api/auth/callback/tiktok`,
    },
  },
  advanced: {
    generateId: false, // Let the database generate UUIDs
    crossSubDomainCookies:
      process.env.NODE_ENV === 'production'
        ? {
            enabled: true,
            domain: '.lin.ky',
          }
        : {
            enabled: false,
          },
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: 'none', // Allows CORS-based cookie sharing across subdomains
      partitioned: true, // New browser standards will mandate this for foreign cookies
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  emailAndPassword: {
    enabled: false,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await handleUserCreated({ userId: user.id });
          await createUserInitialFlags(user.id);
          if (user.email) {
            await sendWelcomeEmail(user.email);
          }
          await sendNewUserSlackMessage(user);
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const organization = await getActiveOrganization(session.userId);

          return {
            data: {
              ...session,
              activeOrganizationId: organization?.id || null,
            },
          };
        },
      },
    },
  },
  plugins: [
    admin(),
    organization({
      allowUserToCreateOrganization: false,
      sendInvitationEmail: async (data) => {
        const inviteLink = `${process.env.APP_FRONTEND_URL}/invite/${data.id}`;

        sendOrganizationInvitationEmail({
          email: data.email,
          invitedByUsername: data.inviter.user.name,
          invitedByEmail: data.inviter.user.email,
          teamName: data.organization.name,
          inviteLink,
        });
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // There's a bug in better-auth where the invite link is not using
        // the API_BASE_URL, so we need to clean it up
        // const cleanedUrl = url.replace(
        //   'https://lin.ky/api',
        //   'https://api.lin.ky/api'
        // );

        const cleanedPath = new URL(url).pathname;

        // /api/auth/magic-link/verify?token=dlpkufmzwoaurkdyvgpakuuvgeoayooz&callbackURL=https://lin.ky/edit
        const cleanedUrl = `https://api.lin.ky${cleanedPath}&callbackURL=https://lin.ky/edit`;

        await sendMagicLinkEmail({ email, url: cleanedUrl });
      },
    }),
  ],
});

const getActiveOrganization = async (userId: string) => {
  const organization = await prisma.organization.findFirst({
    where: {
      members: { some: { userId } },
    },
  });

  return organization;
};
