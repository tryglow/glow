import { PricingTable } from './table';
import { CallToActionBlock } from '@/components/landing-page/CallToActionBlock';
import { FrequentlyAskedQuestions } from '@/components/landing-page/Faq';
import { MarketingContainer } from '@/components/marketing-container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Linky',
  description: 'Take Linky to the next level with one of our paid plans.',
};

export default async function PricingPage() {
  return (
    <div className="bg-gradient-to-b from-[#f9f9f8] to-[#f5f3ea] pt-24 sm:pt-32 pb-8">
      <MarketingContainer className="text-center">
        <h1 className="text-pretty text-5xl lg:text-6xl font-black text-black tracking-tight">
          Get Premium.
        </h1>
        <p className="mt-6 text-xl font-medium text-gray-600">
          Take Linky to the next level with one of our paid plans.
        </p>
      </MarketingContainer>
      <PricingTable />

      <section className="my-24">
        <MarketingContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Frequently Asked <br /> Questions
            </h2>
            <div className="flex flex-col items-start w-full flex-1 gap-4">
              <FrequentlyAskedQuestions questionSet="pricing" />
            </div>
          </div>
        </MarketingContainer>
      </section>

      <section className="py-8 md:py-16">
        <MarketingContainer>
          <CallToActionBlock />
        </MarketingContainer>
      </section>
    </div>
  );
}
