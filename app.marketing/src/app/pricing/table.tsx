'use client';

import { LoginWidget } from '@/components/login-widget';
import { MarketingContainer } from '@/components/marketing-container';
import { useIsLoggedIn } from '@/hooks/use-is-logged-in';
import { InternalApi } from '@/lib/api';
import {
  LockClosedIcon,
  UserGroupIcon,
  ChatBubbleBottomCenterTextIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  UserIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  EyeSlashIcon,
  ArrowDownTrayIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Button, cn } from '@tryglow/ui';

const tiers = [
  {
    name: 'Premium',
    id: 'premium',
    badge: 'Popular',
    description: 'The best way to get started',
    priceMonthly: '4',
    billingPeriod: 'per month',
    href: '#',
    highlights: [
      { description: 'Custom Domains', icon: GlobeAltIcon },
      { description: 'Unlimited pages', icon: ArrowPathIcon },
      { description: 'Unlimited blocks', icon: LockClosedIcon },
      { description: 'Verification badge', icon: EyeSlashIcon },
      { description: 'Private pages', icon: ArrowDownTrayIcon },
      { description: 'Analytics', icon: ClockIcon },
    ],
  },
  {
    name: 'Team',
    id: 'team',
    description: 'For teams & agencies',
    priceMonthly: '14',
    billingPeriod: 'per month',
    href: '#',
    highlights: [
      { description: 'All Premium features', icon: LockClosedIcon },
      { description: 'A separate team space', icon: LockClosedIcon },
      { description: 'Invite up to 5 team members', icon: UserGroupIcon },
      {
        description: 'Google Analytics integration',
        icon: ChatBubbleBottomCenterTextIcon,
      },
      { description: 'Facebook Pixel integration', icon: Cog6ToothIcon },
    ],
  },
];

export function PricingTable() {
  const handleGetPlan = async (planType: 'premium' | 'team') => {
    try {
      const req = await InternalApi.get(
        `/billing/checkout/get-checkout-link?planType=${planType}`
      );

      if (req.checkoutLink) {
        window.open(req.checkoutLink, '_blank');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isLoggedIn = useIsLoggedIn();

  return (
    <div className="relative py-16">
      <MarketingContainer className="relative z-[2] max-w-2xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                'rounded-2xl bg-transparent p-8 shadow-sm ring-1 ring-gray-200',
                tier.id === 'premium' && 'bg-white ring-0'
              )}
            >
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serf font-semibold text-gray-900">
                  {tier.name}
                </h2>
                {tier.badge && (
                  <span className="rounded-full bg-[#e26c1e] px-3 py-1 text-xs font-medium text-white">
                    {tier.badge}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">{tier.description}</p>

              <div className="mt-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    ${tier.priceMonthly}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {tier.billingPeriod}
                  </span>
                </div>

                <div className="mt-6">
                  {isLoggedIn && tier.id !== 'free' ? (
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full rounded-full bg-black text-white hover:bg-gray-800"
                      onClick={() =>
                        handleGetPlan(tier.id as 'premium' | 'team')
                      }
                    >
                      Get started
                    </Button>
                  ) : (
                    <LoginWidget
                      isSignup
                      trigger={
                        <Button
                          variant="default"
                          size="lg"
                          className="w-full rounded-full bg-black text-white hover:bg-gray-800"
                        >
                          Get started
                        </Button>
                      }
                    />
                  )}
                </div>

                <ul className="mt-8 space-y-3">
                  {tier.highlights.map((highlight) => (
                    <li
                      key={highlight.description}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >
                      <highlight.icon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                      {highlight.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </MarketingContainer>
    </div>
  );
}
