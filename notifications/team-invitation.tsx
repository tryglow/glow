import 'server-only';

import { TeamInvite } from '@prisma/client';
import { Resend } from 'resend';

export async function sendTeamInvitationEmail(invite: TeamInvite) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'Glow <team@glow.as>',
    to: [invite.email],
    subject: "You've been invited to join a team on Glow!",
    text: `You've been invited to join a team on Glow! To accept the invite, click the link below. If you weren't expecting to receive this email, please ignore it. \n\n https://glow.as/i/invite/${invite.code}`,
  });
}
