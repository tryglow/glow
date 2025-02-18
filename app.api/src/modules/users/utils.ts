import { User } from '@prisma/client';

interface UserPlanDetails {
  plan: string;
  status: 'legacyFree' | 'active' | 'trial' | 'inactive';
  daysRemainingOnTrial?: number | null;
}

export function getUserPlanDetails(user: User): UserPlanDetails {
  if (!user.stripeTrialEnd) {
    // User is on the legacy free plan
    return {
      plan: user.plan,
      status: 'legacyFree',
      daysRemainingOnTrial: null,
    };
  }

  if (['premium', 'team'].includes(user.plan) && user.stripeTrialEnd === null) {
    return {
      plan: user.plan,
      status: 'active',
    };
  }

  const daysRemainingOnTrial = Math.ceil(
    (user.stripeTrialEnd.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return {
    plan: user.plan,
    status: user.stripeTrialEnd < new Date() ? 'inactive' : 'trial',
    daysRemainingOnTrial: daysRemainingOnTrial > 0 ? daysRemainingOnTrial : 0,
  };
}
