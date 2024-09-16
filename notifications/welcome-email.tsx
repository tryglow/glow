import { Resend } from 'resend';

export async function sendWelcomeEmail(email: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const oneHourFromNow = new Date(Date.now() + 1000 * 60 * 60).toISOString();

  await resend.emails.send({
    from: 'Alex - Glow <alex@glow.as>',
    to: [email],
    subject: 'Re: Welcome to Glow!',
    scheduledAt: oneHourFromNow,
    text: "Just wanted to say a quick welcome to Glow! \n\n We're still very much in the early days, so if you have any feedback or questions, feel free to reach out to me directly (this is my personal email, so feel free to reply to this!). \n\n Thanks, \nAlex",
  });
}
