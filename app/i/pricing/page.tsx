import { PlusIcon } from '@heroicons/react/16/solid';

import { LoginWidget } from '@/app/components/LoginWidget';
import { Container } from '@/app/i/landing-page/page';

import { Button } from '@/components/ui/button';

const tiers = [
  {
    name: 'Free',
    description: 'Everything you need to get started.',
    priceMonthly: '$0',
    href: '#',
    highlights: [
      { description: 'Use up to 5 blocks' },
      { description: 'Create 2 pages' },
      { description: 'Real-time blocks' },
      { description: 'Custom themes' },
    ],
  },
  {
    name: 'Premium',
    description: 'For those who want to go all in.',
    priceMonthly: '$4',
    href: '#',
    highlights: [
      { description: 'Custom domains' },
      { description: 'Unlimited blocks' },
      { description: 'Unlimited pages' },
      { description: 'Premium only blocks' },
      { description: 'Verification badge' },
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white pt-24 sm:pt-32 pb-8">
      <Container>
        <h1 className="text-pretty text-5xl lg:text-6xl font-black text-black tracking-tight">
          Premium
        </h1>
        <p className="mt-6 max-w-3xl text-xl font-medium text-gray-600 sm:text-2xl">
          Get Glow Premium to unlock to exclusive features and blocks.
        </p>
      </Container>
      <div className="relative pt-16 sm:pt-16 pb-16">
        <div className="absolute inset-x-0 bottom-0 top-48 bg-gradient-to-b from-white to-stone-100" />
        <Container className="relative z-10">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="-m-2 grid grid-cols-1 rounded-[2rem] shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:w-full max-lg:max-w-md"
              >
                <div className="grid grid-cols-1 rounded-[2rem] p-2 shadow-md shadow-black/5">
                  <div className="rounded-3xl bg-white p-10 pb-9 shadow-2xl ring-1 ring-black/5">
                    <h2 className="text-3xl font-black text-[#FF4F17]">
                      {tier.name} <span className="sr-only">plan</span>
                    </h2>
                    <p className="mt-2 text-pretty text-sm/6 text-gray-600">
                      {tier.description}
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                      <div className="text-5xl font-black tracking-tight text-gray-950">
                        {tier.priceMonthly}
                      </div>
                      {tier.name !== 'Free' && (
                        <div className="text-sm/5 text-gray-600">
                          <p>USD</p>
                          <p>per month</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-8">
                      <LoginWidget
                        isSignup
                        trigger={
                          <Button size="lg" className="w-full">
                            {tier.name === 'Premium'
                              ? 'Get Premium'
                              : 'Get Started'}
                          </Button>
                        }
                      />
                    </div>
                    <div className="mt-8">
                      <h3 className="text-sm/6 font-medium text-gray-950">
                        {tier.name === 'Free'
                          ? 'Includes:'
                          : 'Everything in free plus:'}
                      </h3>
                      <ul className="mt-3 space-y-3">
                        {tier.highlights.map((highlight) => (
                          <li
                            key={highlight.description}
                            className="group flex items-start gap-4 text-sm/6 text-gray-600 data-[disabled]:text-gray-400"
                          >
                            <span className="inline-flex h-6 items-center">
                              <PlusIcon
                                aria-hidden="true"
                                className="size-4 fill-gray-400 group-data-[disabled]:fill-gray-300"
                              />
                            </span>

                            {highlight.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
