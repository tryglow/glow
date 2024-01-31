import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';

import prisma from './prisma';

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
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  pages: {
    signIn: '/auth/login',
    newUser: '/new',
  },
  callbacks: {
    signIn: async ({ user }) => {
      return true;
    },
    session: async ({ session, token }) => {
      if (!session.user) return session;

      session.user.id = token.uid;

      return session;
    },
    jwt: async (params) => {
      const { user, token, trigger } = params;

      if (user) {
        token.uid = user.id;
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
