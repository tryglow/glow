import { createLoopsClient } from '@/lib/loops';
import { transactionalEmailIds } from '@/modules/notifications/constants';
import { captureException } from '@sentry/node';

export async function sendSubscriptionCreatedEmail(
  email: string,
  planType: 'premium' | 'team'
) {
  const loops = createLoopsClient();

  if (!loops) {
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
  const loops = createLoopsClient();

  if (!loops) {
    return;
  }

  try {
    await loops.sendTransactionalEmail({
      transactionalId: 'cm32urz09030i14hjw3kjsmv4',
      email,
      dataVariables: {
        url,
      },
    });
  } catch (error) {
    captureException(error);
  }
}
