'server only';

import { sendWelcomeEmail } from '@/notifications/welcome-email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { track } from '@vercel/analytics/server';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';

import prisma from './prisma';

const temporaryTestUserForAppReview = {
  id: process.env.TMP_APP_REVIEW_USER_ID as string,
  email: process.env.TMP_APP_REVIEW_USER_EMAIL,
  name: 'Test User',
  password: process.env.TMP_APP_REVIEW_USER_PASSWORD,
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: '2.0', // opt-in to Twitter OAuth 2.0
    }),
    /**
     * This provider is used for the app review process only. Some of the
     * integrations that we use (such as Spotify and Facebook) require us to
     * provide test users for the review process.
     */
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'testuser' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials) return null;

        if (
          credentials.password === temporaryTestUserForAppReview.password &&
          credentials.email === temporaryTestUserForAppReview.email
        ) {
          return {
            id: temporaryTestUserForAppReview.id,
            name: temporaryTestUserForAppReview.name,
            email: temporaryTestUserForAppReview.email,
          };
        }

        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  pages: {
    signIn: '/',
  },
  callbacks: {
    signIn: async () => {
      return true;
    },
    session: async ({ session, token }) => {
      if (!session.user) return session;

      session.user.id = token.uid;
      session.currentTeamId = token.teamId;

      return session;
    },
    jwt: async (params) => {
      const { user, token, trigger } = params;

      if (trigger === 'signUp') {
        await track('signUp', {
          userId: user.id,
          provider: params.account?.provider ?? 'unknown',
        });

        // Create a new team for the user
        await prisma.team.create({
          data: {
            name: 'Default Team',
            members: {
              create: {
                userId: user.id,
              },
            },
          },
        });

        // Send welcome email
        if (user.email) {
          await sendWelcomeEmail(user.email);
        }
      }

      if (trigger === 'signIn') {
        await track('signIn', {
          userId: user.id,
          provider: params.account?.provider ?? 'unknown',
        });
      }

      if (user) {
        token.uid = user.id;
      }

      if (!token.teamId) {
        const team = await prisma.team.findFirst({
          where: {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
        });

        if (team?.id) {
          token.teamId = team?.id;
        }
      }

      return token;
    },
  },
};

export const getUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return session.user;
};
