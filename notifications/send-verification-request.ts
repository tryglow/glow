import 'server-only';

import { captureException } from '@sentry/nextjs';

import { createLoopsClient, transactionalEmailIds } from '@/lib/loops';

export async function sendVerificationRequest({
  identifier,
  url,
}: {
  identifier: string;
  url: string;
}) {
  const loops = createLoopsClient();

  try {
    await loops.sendTransactionalEmail({
      transactionalId: transactionalEmailIds.loginVerificationRequest,
      email: identifier,
      dataVariables: {
        url,
      },
    });

    return true;
  } catch (error) {
    captureException(error);
  }
}
