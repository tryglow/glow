'use client';

import posthog from 'posthog-js';
import { PostHogProvider as OGPostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: 'https://eu.i.posthog.com',
    person_profiles: 'identified_only',
  });
}
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <OGPostHogProvider client={posthog}>{children}</OGPostHogProvider>;
}
