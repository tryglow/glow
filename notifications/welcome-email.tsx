import 'server-only';

import { Resend } from 'resend';

const fromEmail = 'Alex from Glow <alex@glow.as>';

export async function sendWelcomeEmail(email: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  // 23 hours from now
  const emailOneScheduledAt = new Date(
    Date.now() + 1000 * 60 * 60 * 23
  ).toISOString();

  // 23 hours and 45 seconds from now
  const emailTwoScheduledAt = new Date(
    Date.now() + 1000 * 60 * 60 * 23 + 45 * 1000
  ).toISOString();

  await Promise.all([
    resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'How are you finding Glow?',
      scheduledAt: emailOneScheduledAt,
      text: "Hey there! \n\n Saw that you signed up to Glow yesterday. I wanted to check in to see how you're finding it so far? \n\n It's still very much in the early days, so if you have any feedback or questions, would be very interested to hear them :) \n\n Thanks, \nAlex",
    }),
    resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'Re: How are you finding Glow?',
      scheduledAt: emailTwoScheduledAt,
      text: 'Sorry forgot to add, we also added page verification last week so let me know if you want me to verify your page!',
    }),
  ]);
}
