import prisma from '@/lib/prisma';
import {
  sendMagicLinkEmail,
  sendOrganizationInvitationEmail,
  sendTrialEndedEmail,
  sendWelcomeEmail,
} from '@/modules/notifications/service';
import { stripe } from '@better-auth/stripe';
import slugify from '@sindresorhus/slugify';
import { betterAuth, BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, magicLink, organization } from 'better-auth/plugins';
import Stripe from 'stripe';

const stripeClient = new Stripe(process.env.STRIPE_API_SECRET_KEY!);

const prices = {
  development: {
    freeLegacy: 'price_1Qzm2LJKLsVNmaiRvZE2YGN4',
    premium: 'price_1QA7JEJKLsVNmaiRillvBTsw',
    team: 'price_1QA7K5JKLsVNmaiR4YY86rL4',
  },
  production: {
    freeLegacy: 'price_1QzlZJJKLsVNmaiRvRdmReAD',
    premium: 'price_1QA7KRJKLsVNmaiRZg6VcoKT',
    team: 'price_1QA7KMJKLsVNmaiRy5KrzX3l',
  },
};

const trustedOrigins =
  process.env.NODE_ENV === 'production'
    ? ['https://glow.as', 'https://api.glow.as', 'https://www.glow.as']
    : ['http://localhost:3000', 'http://localhost:3001'];

const options: BetterAuthOptions = {
  trustedOrigins: trustedOrigins,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
    },
    twitter: {
      clientId: process.env.AUTH_TWITTER_CLIENT_ID as string,
      clientSecret: process.env.AUTH_TWITTER_CLIENT_SECRET as string,
    },
    tiktok: {
      clientId: process.env.AUTH_TIKTOK_CLIENT_KEY as string,
      clientSecret: process.env.AUTH_TIKTOK_CLIENT_SECRET as string,
    },
  },
  advanced: {
    // Let the database generate UUIDs
    generateId: false,
    crossSubDomainCookies:
      process.env.NODE_ENV === 'production'
        ? {
            enabled: true,
            domain: '.glow.as',
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
      enabled: false,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  emailAndPassword: {
    enabled: false,
  },
  user: {
    additionalFields: {
      metadata: {
        sortable: true,
        type: 'string',
        defaultValue: {
          showTour: true,
        } as any,
        transform: {
          output: (value: any) => {
            return 'helloworld';
          },
        },
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await createUsersFirstOrganization({
            id: user.id,
            email: user.email,
          });
          await sendWelcomeEmail(user.email);
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
      async sendInvitationEmail(data) {
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
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      subscription: {
        enabled: true,
        plans: [
          {
            name: 'premium',
            priceId:
              process.env.NODE_ENV === 'production'
                ? prices.production.premium
                : prices.development.premium,
            limits: {
              pages: 100,
            },
            freeTrial: {
              days: 14,
              onTrialExpired: async (subscription) => {
                const orgUsers = await getUsersForOrganization(
                  subscription.referenceId
                );

                orgUsers.forEach(async (user) => {
                  if (user.user.email) {
                    await sendTrialEndedEmail(user.user.email);
                  }
                });
              },
            },
          },
          {
            name: 'team',
            priceId:
              process.env.NODE_ENV === 'production'
                ? prices.production.team
                : prices.development.team,
            limits: {
              pages: 200,
            },
          },
          {
            name: 'freeLegacy',
            priceId:
              process.env.NODE_ENV === 'production'
                ? prices.production.freeLegacy
                : prices.development.freeLegacy,
            limits: {
              pages: 1,
            },
          },
        ],
        authorizeReference: async ({ user, referenceId, action }) => {
          const member = await prisma.member.findFirst({
            where: {
              userId: user.id,
              organizationId: referenceId,
            },
          });

          return member?.role === 'OWNER' || member?.role === 'ADMIN';
        },
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail({ email, url });
      },
    }),
  ],
};

export const auth = betterAuth({
  ...options,
});

const getActiveOrganization = async (userId: string) => {
  const organization = await prisma.organization.findFirst({
    where: {
      members: { some: { userId } },
    },
  });

  return organization;
};

const getUsersForOrganization = async (organizationId: string) => {
  const users = await prisma.member.findMany({
    where: {
      organizationId,
    },
    select: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  return users;
};

const createUsersFirstOrganization = async ({
  id,
  email,
}: {
  id: string;
  email: string;
}) => {
  const newOrgName = 'Default Org';
  const randomNumber = Math.floor(Math.random() * 1000000);
  const newOrgSlug = slugify(`${newOrgName}-${randomNumber}`);

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw Error('User not found');
  }

  const org = await prisma.organization.create({
    data: {
      name: newOrgName,
      slug: newOrgSlug,
      metadata: JSON.stringify({
        isPersonal: true,
      }),
      members: {
        create: {
          userId: user.id,
          role: 'ADMIN',
        },
      },
    },
  });

  const customer = await stripeClient.customers.create({
    name: user.name ?? '',
    email: user.email ?? '',
    metadata: {
      dbUserId: user.id,
      dbOrgId: org.id,
    },
  });

  if (!customer) {
    throw Error('Error creating customer');
  }

  const stripeSubscription = await stripeClient.subscriptions.create({
    customer: customer.id,
    items: [
      {
        price:
          process.env.NODE_ENV === 'production'
            ? prices.production.premium
            : prices.development.premium,
      },
    ],
    trial_period_days: 14,
  });

  await prisma.subscription.create({
    data: {
      plan: 'premium',
      referenceId: org.id,
      status: 'trialing',
      stripeCustomerId: customer.id,
      seats: 1,
      stripeSubscriptionId: stripeSubscription.id,
      trialStart: stripeSubscription.trial_start
        ? new Date(stripeSubscription.trial_start * 1000)
        : null,
      trialEnd: stripeSubscription.trial_end
        ? new Date(stripeSubscription.trial_end * 1000)
        : null,
    },
  });

  return org.id;
};
