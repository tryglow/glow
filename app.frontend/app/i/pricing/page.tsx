import { MarketingContainer } from '@/app/components/MarketingContainer';
import { PricingTable } from '@/app/i/pricing/table';

import { ArrowRightIcon } from '@heroicons/react/20/solid';

import Image from 'next/image';

import { LoginWidget } from '@/components/LoginWidget';

import { auth } from '@/app/lib/auth';

import { Button } from '@/components/ui/button';

export default async function PricingPage() {
  const session = await auth();

  const isLoggedIn = !!session?.user;

  return (
    <div className="bg-white pt-24 sm:pt-32 pb-8">
      <MarketingContainer>
        <h1 className="text-pretty text-5xl lg:text-6xl font-black text-black tracking-tight">
          Our Plans
        </h1>
        <p className="mt-6 max-w-3xl text-xl font-medium text-gray-600 sm:text-2xl">
          Take Glow to the next level with one of our paid plans.
        </p>
      </MarketingContainer>
      <PricingTable isLoggedIn={isLoggedIn} />

      <section className="py-8 md:py-16 from-stone-100 to-white bg-gradient-to-b">
        <MarketingContainer>
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
                  <div className="w-full md:w-auto inline-flex flex-row items-center rounded-full bg-white pl-4 border border-slate-200 shadow-sm">
                    <span className="text-slate-600 font-medium">glow.as/</span>
                    <input
                      type="text"
                      placeholder="name"
                      className="bg-transparent border-0 px-0 focus:outline-none focus:ring-0 rounded-full w-full"
                    />
                    <LoginWidget
                      isSignup
                      trigger={
                        <Button
                          variant="default"
                          size="xl"
                          className="font-bold flex group rounded-full px-6 md:px-10"
                        >
                          Claim Page
                          <ArrowRightIcon className="w-5 h-5 ml-2 -mr-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-mr-4 transition-all ease-in-out duration-200" />
                        </Button>
                      }
                    />
                  </div>
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
        </MarketingContainer>
      </section>
    </div>
  );
}
