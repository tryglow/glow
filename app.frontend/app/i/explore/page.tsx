import { MarketingContainer } from '@/app/components/MarketingContainer';
import prisma from '@/lib/prisma';
import { JsonObject } from '@prisma/client/runtime/library';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Explore - Glow',
};

const getFeaturedPages = async () => {
  const pages = await prisma.page.findMany({
    where: {
      deletedAt: null,
      publishedAt: {
        not: null,
      },
      isFeatured: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      slug: true,
      blocks: {
        where: {
          type: 'header',
        },
      },
    },
  });

  return pages
    .map((page) => {
      const headerBlock = page.blocks.find(
        (block) => block.type === 'header'
      ) as unknown as JsonObject;

      if (!headerBlock) {
        return null;
      }

      return {
        ...page,
        headerTitle: (headerBlock?.data as JsonObject)?.title,
        headerDescription: (headerBlock?.data as JsonObject)?.description,
      };
    })
    .filter(Boolean) as {
    id: string;
    slug: string;
    headerTitle: string;
    headerDescription: string;
  }[];
};

export default async function ExploreLandingPage() {
  const featuredPages = await getFeaturedPages();

  return (
    <main>
      <div className="w-full flex-auto">
        <MarketingContainer>
          <div className="mx-auto max-w-2xl lg:max-w-none pt-24 pb-8">
            <div>
              <h1>
                <span className="text-pretty text-5xl lg:text-6xl font-black text-black tracking-tight">
                  Explore
                </span>
              </h1>
              <div className="mt-6 max-w-3xl text-xl text-slate-900">
                <p>
                  Explore some of the best link-in-bio pages created by the Glow
                  community.
                </p>
              </div>
            </div>
          </div>
        </MarketingContainer>
      </div>
      <MarketingContainer className="pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-4 w-[calc(100%+2rem)] -ml-4">
          {featuredPages.map((page) => {
            return (
              <Link
                key={page.id}
                href={`/${page.slug}`}
                className="bg-transparent hover:bg-slate-100 transition-colors px-4 py-4 rounded-xl"
              >
                <Image
                  src={`/${page.slug}/opengraph-image`}
                  alt=""
                  width={1200}
                  height={630}
                  className="rounded-xl"
                />
                <div className="flex flex-col mt-3">
                  <h3 className="text-lg font-bold">{page.headerTitle}</h3>
                  <p className="text-sm text-slate-500">
                    {page.headerDescription}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </MarketingContainer>
    </main>
  );
}
