import { MarketingContainer } from '@/app/components/MarketingContainer';
import prisma from '@/lib/prisma';
import { TikTokLoginButton } from './login-button';

export default async function TikTokGeneratePage() {
  const createNewOrchestration = async () => {
    'use server';
    const orchestration = await prisma.orchestration.create({
      data: {
        expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
        type: 'TIKTOK',
      },
      select: {
        id: true,
      },
    });

    return orchestration.id;
  };

  return (
    <section className="w-full h-full bg-white py-32 min-h-screen">
      <MarketingContainer>
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          <h1 className="text-6xl font-black tracking-tighter text-stone-950 mb-2">
            Generate your own TikTok link-in-bio
          </h1>
          <span className="text-stone-950/80 text-xl">
            An automatically generated link in bio crafted for your TikTok.
          </span>

          <TikTokLoginButton className="mt-8" action={createNewOrchestration} />
        </div>
      </MarketingContainer>
    </section>
  );
}
