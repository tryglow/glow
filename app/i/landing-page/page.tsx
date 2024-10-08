import { ArrowRightIcon, ArrowUpRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { LoginWidget } from '@/app/components/LoginWidget';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import { FrquentlyAskedQuestions } from './faq';
import { ShowLoginAlert } from './show-login-alert';
import styles from './styles.module.scss';

export const Container = (props: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn('max-w-5xl mx-auto px-4', props.className)}>
      {props.children}
    </div>
  );
};

const featuredProfiles: {
  name: string;
  label: string;
  slug: string;
  avatarUrl: string;
  bg: string;
  bgImage?: string;
  isLight?: boolean;
}[] = [
  {
    name: 'Jonas K',
    label: 'Wallpapers / Icons / Etsy',
    slug: 'jonask',
    avatarUrl:
      'https://cdn.glow.as/block-db66b09e-6253-477e-b48e-7adc9f5234fa/7c98057e-f2c2-415b-bb8c-638e2a961994',
    bg: '#f5f5f4',
    isLight: true,
  },
  {
    name: 'Alex',
    label: 'A product engineer from the UK based in Milan.',
    slug: 'alex',
    avatarUrl:
      'https://cdn.glow.as/block-f5a2d44d-6933-4a51-a9e2-9fbb27923585/f4fdd080-46be-483f-9b04-e5646efb157d',
    bg: '#2c2443',
  },
  {
    name: 'Hystruct',
    label: 'Web scraping made easy',
    slug: 'hystruct',
    avatarUrl:
      'https://cdn.glow.as/block-ebc6bb3e-72c2-45f9-af7d-6137fc99bd47/f606307f-02fc-47fc-b3d4-84e9eba360e2',
    bg: '#000',
  },
  {
    name: 'Nicola Adams',
    label: 'Student at University of Georgia',
    slug: 'nicola_adams',
    avatarUrl:
      'https://cdn.glow.as/block-4e8321e4-6997-4b74-92f8-5da2458ef6fb/1066a5b8-cf2f-43f6-8525-a39c82f27795',
    bg: '#f5f5f4',
    isLight: true,
  },
  {
    name: 'SK',
    label: 'Probably nothing...',
    slug: 'skl',
    avatarUrl:
      'https://cdn.glow.as/block-65ddb0b7-467c-4015-bd15-2b2ff91a4b73/c7f46beb-7f9b-4034-b734-037cd38bbb34',
    bg: '#000',
    bgImage:
      'https://cdn.glow.as/pg-bg-42175fcd-41b6-4411-a46e-38e8f09352ad/953fee3e-0c78-400b-b195-ff461d0feeb5',
  },
  {
    name: 'Jack',
    label: 'Product designer from Paris.',
    slug: 'jack',
    avatarUrl:
      'https://cdn.glow.as/666b7445-c171-4ad7-a21d-eb1954b7bd40/0885d7ec-9af4-4430-94f4-ad1a033c2704',
    bg: '#f5f5f4',
    isLight: true,
  },
];

const title = ['Your', 'personal', 'page', 'that', 'is', 'always', 'current.'];

const fetchUserAndPages = async () => {
  const session = await getServerSession(authOptions);

  const user = session?.user;

  const pages = await prisma.page.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return {
    user,
    pages,
  };
};

export default async function LandingPage({
  searchParams,
}: {
  searchParams: { force: string };
}) {
  const { force } = searchParams;

  if (!force) {
    const { user, pages } = await fetchUserAndPages();

    const loggedInUserRedirect =
      user && pages[0] ? `/${pages[0].slug}` : '/new';

    if (user) {
      redirect(loggedInUserRedirect);
    }
  }

  return (
    <div className="min-h-screen">
      <ShowLoginAlert />
      <section className="bg-gradient-to-b from-white to-stone-100 py-24 md:py-0">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-6 items-center">
            <div className="md:col-span-4 pr-16">
              <h1
                className={cn(
                  'text-5xl lg:text-6xl font-black text-black tracking-tight',
                  styles.title
                )}
              >
                {title.map((word) => {
                  return (
                    <span
                      key={word}
                      className={
                        ['personal', 'page'].includes(word)
                          ? 'text-[#FF4F17]'
                          : ''
                      }
                    >
                      {word}
                    </span>
                  );
                })}
              </h1>
              <span
                className={cn(
                  'text-xl md:text-2xl font-normal mt-3 md:mt-6 text-black/80',
                  styles.subtitle
                )}
              >
                Glow is the open source personal page builder that integrates
                with your favorite platforms to keep your page fresh, so that
                you can focus on creating.
              </span>

              <div className={cn('mt-4 md:mt-8', styles.ctas)}>
                <LoginWidget
                  isSignup
                  trigger={
                    <Button
                      variant="default"
                      size="xl"
                      className="mt-2 md:mt-0 mb-2 font-bold flex group"
                    >
                      Create Your Page
                      <ArrowRightIcon className="w-5 h-5 ml-2 -mr-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-mr-4 transition-all ease-in-out duration-200" />
                    </Button>
                  }
                />
                <Button variant="link" asChild>
                  <Link
                    href="/jack"
                    target="_blank"
                    className="text-black/40 text-left pl-0"
                  >
                    See an example page →
                  </Link>
                </Button>
              </div>

              <div className="flex -space-x-1 overflow-hidden mt-4 md:mt-8">
                <Image
                  width={28}
                  height={28}
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                  src="https://cdn.glow.as/block-9077b37e-2c6c-4457-aa30-13f44f38ec15/16608f2e-8492-425e-ba0c-777c61755a08"
                  alt=""
                />
                <Image
                  width={28}
                  height={28}
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                  src="https://cdn.glow.as/666b7445-c171-4ad7-a21d-eb1954b7bd40/0885d7ec-9af4-4430-94f4-ad1a033c2704"
                  alt=""
                />
                <Image
                  width={28}
                  height={28}
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                  src="https://cdn.glow.as/block-9077b37e-2c6c-4457-aa30-13f44f38ec15/94c2926b-a54e-488e-8464-6e44dc5afce4"
                  alt=""
                />
                <Image
                  width={28}
                  height={28}
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                  src="https://cdn.glow.as/block-9077b37e-2c6c-4457-aa30-13f44f38ec15/76af84b5-0e47-41fc-852b-458020c75d71"
                  alt=""
                />
              </div>
              <span className="text-xs font-medium text-black/60 block mt-1">
                Used by 400+ creators
              </span>
            </div>
            <div className="hidden md:block md:col-span-2">
              <Image
                src="/assets/hero.png"
                width={551}
                height={1193}
                alt="Screenshot of Glow"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="my-20">
        <Container>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">
            Explore
          </h2>

          <div className="w-screen overflow-x-auto no-scrollbar ml-[calc(((100vw_-_100%)_/_2)_*_-1)] pl-[calc((100vw_-_100%)_/_2)] -mt-8">
            <div className="w-auto flex gap-4 py-8">
              {featuredProfiles.map((profile) => {
                return (
                  <Link
                    href={profile.slug}
                    key={profile.slug}
                    className="group z-20 relative"
                  >
                    <div
                      className={`border border-black/10 rounded-xl w-[270px] h-[180px] px-5 py-6 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-200 ease-in-out bg-cover`}
                      style={{
                        backgroundColor: profile.bg,
                        backgroundImage: `url(${profile.bgImage})`,
                      }}
                    >
                      <ArrowUpRightIcon
                        className={clsx(
                          'absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out',
                          profile.isLight
                            ? 'text-stone-800/20'
                            : 'text-white/20'
                        )}
                      />
                      <div className="flex flex-col">
                        <Image
                          src={profile.avatarUrl}
                          width={56}
                          height={56}
                          className={clsx(
                            'w-14 h-14 rounded-lg outline outline-3',
                            profile.isLight
                              ? 'outline-stone-200'
                              : 'outline-white/10'
                          )}
                          alt=""
                        />
                        <span
                          className={clsx(
                            'font-bold text-lg mt-2 ',
                            profile.isLight ? 'text-stone-900' : 'text-white'
                          )}
                        >
                          {profile.name}
                        </span>
                        <span
                          className={clsx(
                            'font-normal text-sm',
                            profile.isLight ? 'text-stone-700' : 'text-white/70'
                          )}
                        >
                          {profile.label}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section className="my-20">
        <Container>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">
            What makes Glow special?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 w-full">
            <div className="w-full bg-[#e2e5ea] bg-gradient-to-tr from-[#607166] to-[#87a290] border border-stone-200 md:row-span-2 overflow-hidden rounded-xl flex flex-col justify-between">
              <Image
                src="/assets/dynamic.png"
                width={789}
                height={1311}
                className="w-full border-b border-stone-100"
                alt=""
              />
              <div className="py-3 px-4 bg-white flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-semibold mb-2">Dynamic</h3>
                <p className="text-base text-black/80">
                  Glow does the hard work for you, fetching all of the latest
                  content to keep your page fresh.
                </p>
              </div>
            </div>
            <div className="w-full bg-gradient-to-tr from-[#4e54c8] to-[#8f94fb] border border-stone-200 overflow-hidden rounded-xl flex flex-col justify-between md:col-span-2">
              <Image
                src="/assets/drag.png"
                width={789}
                height={294}
                className="w-full border-b border-stone-100"
                alt=""
              />
              <div className="py-3 px-4 bg-white flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-semibold mb-2">Drag & drop</h3>
                <p className="text-base text-black/80">
                  Build your page block by block in minutes.
                </p>
              </div>
            </div>
            <div className="w-full bg-gradient-to-tr from-[#fc4a1a] to-[#f7b733] border border-stone-200 overflow-hidden rounded-xl flex flex-col justify-between">
              <Image
                width={789}
                height={479}
                src="/assets/themes.png"
                className="w-full border-b border-stone-100"
                alt=""
              />
              <div className="py-3 px-4 bg-white flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-semibold mb-2">Customizable</h3>
                <p className="text-base text-black/80">
                  With a few clicks, you can customize the look and feel of your
                  page.
                </p>
              </div>
            </div>
            <div className="w-full  bg-gradient-to-tr from-[#282337] to-[#434665] border border-stone-200 overflow-hidden rounded-xl flex flex-col justify-between">
              <Image
                width={789}
                height={479}
                src="/assets/devices.png"
                className="w-full border-b border-stone-100"
                alt=""
              />
              <div className="py-3 px-4 bg-white flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-semibold mb-2">Works everywhere</h3>
                <p className="text-base text-black/80">
                  Your page will look great on mobile and desktop.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="my-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Frequently Asked <br /> Questions
            </h2>
            <FrquentlyAskedQuestions />
          </div>
        </Container>
      </section>

      <section className="my-8 md:my-24">
        <Container>
          <div className="bg-[#e2e5ea] rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
              <div className="flex-1 flex flex-col gap-2 col-span-1 max-w-md py-8 md:py-16 px-8">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  Let&apos;s build your page
                </h2>
                <p className="text-base md:text-xl">
                  Creating your first page and getting it live takes a matter of
                  minutes. Let&apos;s start with your username.
                </p>

                <div className="mt-6">
                  <LoginWidget
                    isSignup
                    trigger={
                      <Button
                        variant="default"
                        size="xl"
                        className="mt-2 md:mt-0 mb-2 font-bold flex"
                      >
                        Get Started
                      </Button>
                    }
                  />
                </div>
              </div>
              <Image
                width={831}
                height={831}
                src="/assets/blocks.webp"
                className="hidden md:block flex-1 h-full w-full object-cover"
                alt=""
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
