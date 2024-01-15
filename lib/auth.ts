import type {NextAuthOptions} from 'next-auth';
import {PrismaAdapter} from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import {getServerSession} from 'next-auth';

import prisma from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {strategy: 'jwt', maxAge: 24 * 60 * 60},
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    signIn: async ({user}) => {
      console.log('SIGN IN', user);

      return true;
    },
    session: async ({session, token}) => {
      if (!session.user) return session;

      session.user.id = token.uid;

      return session;
    },
    jwt: async (params) => {
      const {user, token} = params;

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
