import 'server-only';

import { createContact } from '@/notifications/create-contact';
import { sendWelcomeEmail } from '@/notifications/welcome-email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { track } from '@vercel/analytics/server';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import TwitterProvider from 'next-auth/providers/twitter';

import prisma from '@/lib/prisma';
import { sendVerificationRequest } from '@/notifications/send-verification-request';

const temporaryTestUserForAppReview = {
  id: process.env.TMP_APP_REVIEW_USER_ID as string,
  email: process.env.TMP_APP_REVIEW_USER_EMAIL,
  name: 'Test User',
  password: process.env.TMP_APP_REVIEW_USER_PASSWORD,
};




export const { auth, signIn, signOut, handlers, unstable_update } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  pages: {
    signIn: '/i/auth/signup',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    }),
    /**
     * This is used for the email link login
     */
    {
      id: 'http-email',
      name: 'Email',
      type: 'email',
      maxAge: 60 * 10,
      sendVerificationRequest,
    },
    /**
     * This provider is used for the app review process only. Some of the
     * integrations that we use (such as Spotify and Facebook) require us to
     * provide test users for the review process.
     */
    CredentialsProvider({
      id: 'credentials',
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
    {
      id: 'magic-link',
      name: 'Magic Link',
      type: 'email',
      maxAge: 60 * 10, // 10 minutes
      sendVerificationRequest,
    },
  ],

  callbacks: {
    signIn: async () => {
      return true;
    },
    session: async ({ session, token }) => {
      if (!session.user) return session;

      session.user.id = token.uid;
      session.currentTeamId = token.teamId;

      session.features = {
        showGlowTour: token?.features?.showGlowTour,
      };

      return session;
    },
    jwt: async (params) => {
      const { user, token, trigger, session } = params;

      if (trigger === 'signUp' && user?.id) {
        // Show the tour
        token.features = { showGlowTour: true };

        await track('signUp', {
          userId: user.id,
          provider: params.account?.provider ?? 'unknown',
        });

        // Create a new team for the user
        await prisma.team.create({
          data: {
            name: 'Default Team',
            isPersonal: true,
            members: {
              create: {
                userId: user.id,
              },
            },
          },
        });

        // Send welcome email
        if (user.email) {
          await createContact(user.email);
          await sendWelcomeEmail(user.email);
        }
      }

      if (trigger === 'signIn') {
        await track('signIn', {
          userId: user.id as string,
          provider: params.account?.provider ?? 'unknown',
        });
      }

      if (user) {
        token.uid = user.id as string;
      }

      if (!token.teamId) {
        const team = await prisma.team.findFirst({
          where: {
            members: {
              some: {
                userId: token.uid,
              },
            },
          },
        });

        if (team?.id) {
          token.teamId = team?.id;
        }
      }

      if (trigger === 'update' && session) {
        token.teamId = session.currentTeamId;
        if (session?.features?.showGlowTour) {
          token.features = { showGlowTour: session.features.showGlowTour };
        }
      }

      return token;
    },
  },
});
