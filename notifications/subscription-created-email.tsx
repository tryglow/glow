import { Resend } from 'resend';

const teamWelcomeText = `Welcome to Glow for teams! We're excited to have you on board. Your subscription is active, and you now have access to all of our Pro features. We've also created a new team for you, so you can start collaborating!`;

const premiumWelcomeText = `Welcome to Glow Premium! We're excited to have you on board. Your subscription is active, and you now have access to all of our Pro features.`;

export async function sendSubscriptionCreatedEmail(
  email: string,
  planType: 'premium' | 'team'
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'Glow <team@glow.as>',
    to: [email],
    subject: `Welcome to Glow ${planType === 'premium' ? 'Premium' : 'for teams'}!`,
    text: planType === 'premium' ? premiumWelcomeText : teamWelcomeText,
  });
}
