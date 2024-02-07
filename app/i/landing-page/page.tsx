import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';

import { LoginProviderButton } from '@/app/components/LoginProviderButton';
import { LoginWidget } from '@/app/components/LoginWidget';

import { Button } from '@/components/ui/button';

import { FrquentlyAskedQuestions } from './faq';
import styles from './styles.module.scss';

export const Container = (props: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={clsx('max-w-5xl mx-auto px-4', props.className)}>
      {props.children}
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 md:pt-48 md:pb-16">
        <Container>
          <div className="flex flex-col justify-center md:items-center max-w-2xl mx-auto text-center">
            <h1
              className={clsx(
                'text-5xl md:text-7xl lg:text-8xl font-black text-black tracking-tight',
                styles.title
              )}
            >
              <span className={styles.row}>
                <span>Always</span> <span>Current.</span>
              </span>
              <span className={styles.row}>
                <span>Uniquely</span>{' '}
                <span className="text-[#FF4F17]">You.</span>
              </span>
            </h1>
            <span
              className={clsx(
                'text-xl md:text-2xl font-normal mt-3 text-black/80',
                styles.subtitle
              )}
            >
              Glow is the link in bio that stays
              <br /> up-to-date with your content.
            </span>

            <div className={clsx('mt-4 md:mt-8', styles.ctas)}>
              <LoginWidget
                trigger={
                  <LoginProviderButton
                    provider="twitter"
                    variant="glow"
                    size="lg"
                    className="mt-2 md:mt-0 mb-2"
                  />
                }
              />
              <Button variant="link" asChild>
                <Link href="/jack" target="_blank" className="text-black/40">
                  See an example page →
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="my-20">
        <Container>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">
            The dynamic link-in-bio
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 w-full">
            <div className="w-full bg-[#e2e5ea] bg-gradient-to-tr from-[#607166] to-[#87a290] border border-stone-200 md:row-span-2 overflow-hidden rounded-xl flex flex-col justify-between">
              <img
                src="/dynamic.png"
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
              <img
                src="/drag.png"
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
              <img
                src="/themes.png"
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
              <img
                src="/devices.png"
                className="w-full border-b border-stone-100"
                alt=""
              />
              <div className="py-3 px-4 bg-white flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-semibold mb-2">Works everywhere</h3>
                <p className="text-base text-black/80">
                  Optimized for mobile devices, and looks great on desktop.
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
                    trigger={
                      <Button variant="default" size="xl">
                        Get started
                      </Button>
                    }
                  />
                </div>
              </div>
              <img
                src="/blocks.webp"
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
