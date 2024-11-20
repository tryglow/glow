import { BrandLogo, TiktokLogo } from './assets';
import { Button } from '@/app/components/ui/button';
import { apiServerFetch } from '@/app/lib/api-server';
import { captureMessage } from '@sentry/nextjs';
import Link from 'next/link';

async function fetchTiktokOrchestrator(orchestrationId: string) {
  const response = await apiServerFetch(`/orchestrators/tiktok/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orchestrationId,
    }),
  });

  const data = await response.json();

  return data;
}

export async function Card({
  isLoading,
  orchestrationId,
}: {
  isLoading?: boolean;
  orchestrationId: string;
}) {
  const orchestrator = isLoading
    ? null
    : await fetchTiktokOrchestrator(orchestrationId);

  if (orchestrator?.error) {
    captureMessage(
      `TikTok orchestration ${orchestrationId} error: ${orchestrator.error}`
    );
  }

  const title = orchestrator?.error
    ? 'Oh no!'
    : isLoading
      ? 'Building your page'
      : 'Your page is ready';

  const description = orchestrator?.error
    ? 'There was a problem building your page. Please try again in a bit.'
    : isLoading
      ? 'Our robots are hard at work building your page.'
      : 'Click below to see your page!';

  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-stone-100 shadow-lg rounded-xl p-8 text-center flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-8 px-24">
        <div className="relative z-[2] w-16 h-16 bg-stone-100 outline outline-8 outline-white rounded-lg flex items-center justify-center">
          <TiktokLogo />
        </div>
        <div className="flex-1 w-full h-[1px] border border-dashed border-stone-200 z-0" />
        <div className="relative z-[2] w-16 h-16 bg-stone-100 outline outline-8 outline-white  rounded-lg flex items-center justify-center">
          <BrandLogo shouldAnimate={isLoading} />
        </div>
      </div>

      <h1 className="text-3xl font-black tracking-tight text-stone-950">
        {title}
      </h1>

      <span className="text-stone-500 text-lg text-balance">{description}</span>

      <div className="mt-8">
        {orchestrator?.error ? null : isLoading ? (
          <Button variant="outline" disabled size="xl">
            Building page
          </Button>
        ) : (
          <>
            <Button asChild size="xl">
              <Link href={`/${orchestrator?.pageSlug}`}>Continue</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
