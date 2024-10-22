import 'server-only';

import { Resend } from 'resend';

export async function sendMemberAcceptedInvitationEmail({
  teamEmails,
  newMemberName,
}: {
  teamEmails: string[];
  newMemberName: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const emails = teamEmails.map((email) => ({
    from: 'Glow <team@glow.as>',
    to: [email],
    subject: `${newMemberName} has accepted your team invite on Glow!`,
    text: `${newMemberName} has accepted your team invite on Glow! They can now see and edit all of the pages in your team.`,
  }));

  await resend.batch.send(emails);
}
