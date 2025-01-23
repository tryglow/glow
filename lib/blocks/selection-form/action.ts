'use server';

import { captureException } from '@sentry/nextjs';
import { SelectionFormConfig } from './config';

export const submitSignupToWaitlistCom = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const waitlistId = formData.get('waitlist_id') as string;

  if (!email) {
    return {
      errors: 'Email is required',
    };
  }

  try {
    const req = await fetch('https://api.getwaitlist.com/api/v1/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        waitlist_id: waitlistId,
      }),
    });

    if (req.ok) {
      return {
        success: true,
      };
    }
  } catch (error) {
    captureException(error);

    return {
      errors: 'There was an error submitting your email. Please try again.',
    };
  }
};


export const submitFeedback = async (formData: SelectionFormConfig) => {
  console.log('submitFeedback called !');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  console.log('response => ', data);
  return data
};
