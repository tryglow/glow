import { Resend } from 'resend';

export async function createContact(email: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  if (!process.env.RESEND_AUDIENCE_ID) {
    throw Error('RESEND_AUDIENCE_ID is not set');
  }

  const { error } = await resend.contacts.create({
    email,
    unsubscribed: false,
    audienceId: process.env.RESEND_AUDIENCE_ID,
  });

  if (error) {
    throw error;
  }
}
