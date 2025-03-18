import { validateEmail } from '@/lib/email';
import { createResendClient } from '@/lib/resend';
import { captureException } from '@sentry/node';
import {
  MagicLinkEmail,
  OrganizationInviteEmail,
  TrialEndingSoonEmail,
  TrialFinishedEmail,
  WelcomeEmail,
} from '@trylinky/notifications';
import React from 'react';

export async function sendEmail({
  email,
  subject,
  from = 'Linky <team@notifications.lin.ky>',
  react,
}: {
  email: string;
  subject: string;
  from?: string;
  react: React.ReactNode;
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
      from,
      to: [email],
      subject,
      react,
    });

    if (error) {
      captureException(error);
    }
  } catch (error) {
    captureException(error);
  }

  return;
}

export async function sendTrialReminderEmail(email: string) {
  return await sendEmail({
    email,
    subject: 'Your Linky Premium trial is ending soon',
    react: <TrialEndingSoonEmail />,
  });
}

export async function sendTrialEndedEmail(email: string) {
  return await sendEmail({
    email,
    subject: 'Your Linky Premium trial has ended',
    react: <TrialFinishedEmail />,
  });
}

export async function sendOrganizationInvitationEmail({
  email,
  inviteLink,
}: {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}) {
  return await sendEmail({
    email,
    subject: "You've been invited to join a team on Linky",
    react: <OrganizationInviteEmail inviteUrl={inviteLink} />,
  });
}

export async function sendWelcomeEmail(email: string) {
  return await sendEmail({
    from: 'Alex from Linky <alex@notifications.lin.ky>',
    email,
    subject: 'Welcome to Linky',
    react: <WelcomeEmail />,
  });
}

export async function sendMagicLinkEmail({
  email,
  url,
}: {
  email: string;
  url: string;
}) {
  return await sendEmail({
    email,
    subject: 'Verify your Linky login',
    react: <MagicLinkEmail url={url} />,
  });
}
