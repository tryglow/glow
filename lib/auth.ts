import type {NextAuthOptions} from 'next-auth';
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import {getServerSession} from 'next-auth';

import prisma from './prisma';
import {generateSlug} from './slugs/generator/generate-slug';
import {randomUUID} from 'crypto';

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
      return true;
    },
    session: async ({session, token}) => {
      if (!session.user) return session;

      session.user.id = token.uid;

      return session;
    },
    jwt: async (params) => {
      const {user, token, trigger} = params;

      if (trigger === 'signUp') {
        const usersFirstPage = await prisma.page.findFirst({
          where: {
            userId: user.id,
          },
          select: {
            slug: true,
          },
        });

        if (!usersFirstPage) {
          // Could give the user a nice onboarding experience here
          const randomPageSlug = await generateSlug({words: 2});
          const headerSectionId = randomUUID();
          const userFirstPage = await prisma.page.create({
            data: {
              userId: user.id,
              slug: randomPageSlug,
              config: [
                {
                  h: 6,
                  i: headerSectionId,
                  w: 11,
                  x: 0,
                  y: 0,
                  moved: false,
                  static: false,
                },
              ],
              blocks: {
                create: {
                  id: headerSectionId,
                  type: 'header',
                  config: {},
                  data: {
                    title: 'Welcome to my page',
                    avatar: {
                      src: '/demo/avatar.svg',
                    },
                    description:
                      'A generic header component to display a title',
                  },
                },
              },
            },
            select: {
              slug: true,
            },
          });

          if (!userFirstPage) {
            throw new Error('Could not create user first page');
          }
        }
      }

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
