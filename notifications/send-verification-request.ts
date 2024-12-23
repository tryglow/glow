import 'server-only';

import { captureException } from '@sentry/nextjs';
import { verificationCache } from '@/lib/verification-cache';

import { createLoopsClient, transactionalEmailIds } from '@/lib/loops';

export async function sendVerificationRequest({
  identifier,
  url,
}: {
  identifier: string;
  url: string;
}) {
  const loops = createLoopsClient();
  verificationCache.set(identifier, url);
  console.log('Verification URL:', url);
}
