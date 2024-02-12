'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode, useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { LoginProviderButton } from '../components/LoginProviderButton';
import { FrquentlyAskedQuestions } from '../i/landing-page/faq';
import { ShowLoginAlert } from '../i/landing-page/show-login-alert';
import styles from '../i/landing-page/styles.module.scss';
import { setCookie } from './set-cookie';

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

const title = ['The', 'link-in-bio', 'that', 'is', 'always', 'current.'];

export default function LandingPage() {
  useEffect(() => {
    setCookie();
  }, []);

  return (
    <div className="min-h-screen">
      <ShowLoginAlert />
      <section className="bg-gradient-to-b from-white to-stone-100 py-24 md:py-0">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-6 items-center">
            <div className="md:col-span-4 pr-16">
              <h1
                className={clsx(
                  'text-5xl lg:text-6xl font-black text-black tracking-tight',
                  styles.title
                )}
              >
                {title.map((word) => {
                  return (
                    <span
                      key={word}
                      className={
                        ['link-in-bio'].includes(word) ? 'text-[#FF4F17]' : ''
                      }
                    >
                      {word}
                    </span>
                  );
                })}
              </h1>
              <span
                className={clsx(
                  'text-xl md:text-2xl font-normal mt-3 md:mt-6 text-black/80',
                  styles.subtitle
                )}
              >
                Your current link-in-bio is already out of date. Glow integrates
                with your favorite platforms to keep your page fresh, so that
                you can focus on creating.
              </span>

              <div className={clsx('mt-4 md:mt-8', styles.ctas)}>
                <div className="flex max-w-[240px]">
                  <LoginProviderButton
                    provider="twitter"
                    className="mt-2 md:mt-0 min-h-11"
                    variant="glow"
                  />
                </div>
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
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                  src="https://cdn.glow.as/block-9077b37e-2c6c-4457-aa30-13f44f38ec15/16608f2e-8492-425e-ba0c-777c61755a08"
                  alt=""
                />
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                  src="https://cdn.glow.as/666b7445-c171-4ad7-a21d-eb1954b7bd40/0885d7ec-9af4-4430-94f4-ad1a033c2704"
                  alt=""
                />
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                  src="https://cdn.glow.as/block-9077b37e-2c6c-4457-aa30-13f44f38ec15/94c2926b-a54e-488e-8464-6e44dc5afce4"
                  alt=""
                />
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                  src="https://cdn.glow.as/block-9077b37e-2c6c-4457-aa30-13f44f38ec15/76af84b5-0e47-41fc-852b-458020c75d71"
                  alt=""
                />
              </div>
              <span className="text-xs font-medium text-black/60 block mt-1">
                Used by 100+ creators
              </span>
            </div>
            <div className="hidden md:block md:col-span-2">
              <img src="/hero.png" />
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
                <div className="flex max-w-[240px]">
                  <LoginProviderButton
                    provider="twitter"
                    className="mt-2 md:mt-0 min-h-11"
                    variant="glow"
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
