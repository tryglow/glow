import 'server-only';

import { Resend } from 'resend';
import VerificationCodeEmail from './login-verification-email';

export async function sendVerificationRequest({
  identifier,
  url,
}: {
  identifier: string;
  url: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'no-reply@glow.as',
    to: identifier,
    subject: 'Log in to Glow',
    react: VerificationCodeEmail({ url }),
  });
}
