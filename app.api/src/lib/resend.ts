import { config } from '@/modules/features';
import { Resend } from 'resend';

export const createResendClient = () => {
  if (!config.resend.enabled) {
    console.info('Resend is not enabled, skipping client creation');
    return null;
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND API KEY is not set');
    return null;
  }

  return new Resend(process.env.RESEND_API_KEY);
};
