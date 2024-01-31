import Image from 'next/image';

import { LoginWidget } from '@/app/components/LoginWidget';

import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="bg-gradient-to-b from-white to-stone-100">
      <section className="py-24 md:pt-48 md:pb-32">
        <div className="container mx-auto px-4 flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center md:items-center max-w-4xl text-left md:text-center">
            <h1 className="text-2xl md:text-6xl font-medium">
              Always Current, Uniquely You. <br />
              The Dynamic Link in Bio.
            </h1>
            <span className="text-lg md:text-xl font-normal mt-3">
              Glow is the link in bio that stays up-to-date with your content.
            </span>

            <LoginWidget
              trigger={
                <Button size="xl" className="mt-5">
                  Get started
                </Button>
              }
            />
          </div>
        </div>
      </section>
      <section className="border-b border-stone-200">
        <div className="container mx-auto">
          <Image
            src="/landing-page-ui@2x.png"
            alt="Some example pages built with glow"
            width={1400}
            height={731}
          />
        </div>
      </section>
    </main>
  );
}
