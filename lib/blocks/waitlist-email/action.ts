'use server';

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
    console.log(error);

    return {
      errors: 'There was an error submitting your email. Please try again.',
    };
  }
};
