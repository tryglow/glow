import { MagicLinkEmail } from './emails/magic-link';
import { validateEmail } from '@/lib/email';
import { createLoopsClient } from '@/lib/loops';
import { createResendClient } from '@/lib/resend';
import { transactionalEmailIds } from '@/modules/notifications/constants';
import { captureException } from '@sentry/node';
import React from 'react';

export async function sendSubscriptionCreatedEmail(
  email: string,
  planType: 'premium' | 'team'
) {
  const loops = createLoopsClient();

  if (!loops) {
    return;
  }

  const isValidEmail = validateEmail(email);

  if (!isValidEmail) {
    return;
  }

  const transactionalId =
    planType === 'premium'
      ? transactionalEmailIds.subscriptionCreatedPremium
      : transactionalEmailIds.subscriptionCreatedTeam;

  try {
    await loops.sendTransactionalEmail({
      transactionalId,
      email,
    });
  } catch (error) {
    captureException(error);
  }
}

export async function sendSubscriptionCancelledEmail(email: string) {
  const loops = createLoopsClient();

  if (!loops) {
    return;
  }

  const isValidEmail = validateEmail(email);

  if (!isValidEmail) {
    return;
  }

  try {
    await loops.sendTransactionalEmail({
      transactionalId: transactionalEmailIds.subscriptionCancelled,
      email,
    });
  } catch (error) {
    captureException(error);
  }
}

export async function sendTrialReminderEmail(email: string) {
  const loops = createLoopsClient();

  if (!loops) {
    return;
  }

  const isValidEmail = validateEmail(email);

  if (!isValidEmail) {
    return;
  }

  try {
    await loops.sendEvent({
      eventName: 'userFreeTrialExpiringSoon',
      email,
    });
  } catch (error) {
    captureException(error);
  }
}

export async function sendTrialEndedEmail(email: string) {
  const loops = createLoopsClient();

  if (!loops) {
    return;
  }

  const isValidEmail = validateEmail(email);

  if (!isValidEmail) {
    return;
  }

  try {
    await loops.sendEvent({
      eventName: 'userFreeTrialExpired',
      email,
    });
  } catch (error) {
    captureException(error);
  }
}

export async function sendOrganizationInvitationEmail({
  email,
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
}: {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}) {
  const loops = createLoopsClient();

  if (!loops) {
    return;
  }

  const isValidEmail = validateEmail(email);

  if (!isValidEmail) {
    return;
  }

  try {
    await loops.sendTransactionalEmail({
      transactionalId: 'cm32wb5yt01uyf362gulg1kjn',
      email,
      dataVariables: {
        inviteUrl: inviteLink,
        invitedByUsername,
        invitedByEmail,
        teamName,
      },
    });
  } catch (error) {
    captureException(error);
  }
}

export async function sendWelcomeEmail(email: string) {
  const loops = createLoopsClient();

  if (!loops) {
    return;
  }

  const isValidEmail = validateEmail(email);

  if (!isValidEmail) {
    return;
  }

  try {
    await loops.sendEvent({
      email,
      eventName: 'accountCreated',
    });
  } catch (error) {
    captureException(error);
  }
}

export async function sendMagicLinkEmail({
  email,
  url,
}: {
  email: string;
  url: string;
}) {
  const resend = createResendClient();

  if (!resend) {
    return;
  }

  const isValidEmail = validateEmail(email);

  if (!isValidEmail) {
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Linky <team@notifications.lin.ky>',
      to: [email],
      subject: 'Verify your Linky login',
      react: <MagicLinkEmail url={url} />,
    });

    if (error) {
      captureException(error);
    }
  } catch (error) {
    captureException(error);
  }
}
