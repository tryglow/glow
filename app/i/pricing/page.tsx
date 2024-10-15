import { Container } from '@/app/i/landing-page/page';
import { PricingTable } from '@/app/i/pricing/table';

import { auth } from '@/lib/auth';

export default async function PricingPage() {
  const session = await auth();

  const isLoggedIn = !!session?.user;

  return (
    <div className="bg-white pt-24 sm:pt-32 pb-8">
      <Container>
        <h1 className="text-pretty text-5xl lg:text-6xl font-black text-black tracking-tight">
          Our Plans
        </h1>
        <p className="mt-6 max-w-3xl text-xl font-medium text-gray-600 sm:text-2xl">
          Take Glow to the next level with one of our paid plans.
        </p>
      </Container>
      <PricingTable isLoggedIn={isLoggedIn} />
    </div>
  );
}
