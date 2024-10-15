import { Resend } from 'resend';

export async function sendSubscriptionCancelledEmail(email: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'Alex from Glow <alex@glow.as>',
    to: [email],
    subject: 'Your Glow subscription has been cancelled',
    text: `Your Glow subscription has been cancelled. We're sorry to see you go! If you have any feedback, please reply to this email, we're always looking for ways to improve.`,
  });
}
