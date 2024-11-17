import { LoopsClient } from 'loops';

export const transactionalEmailIds = {
  loginVerificationRequest: 'cm32urz09030i14hjw3kjsmv4',
  memberAcceptedInvitation: 'cm32vjtao00hcqhny8h24y93o',
  subscriptionCancelled: 'cm32vr21z00ivm0au9rga45qz',
  subscriptionCreatedPremium: 'cm32vtzjm0173100eosidocyw',
  subscriptionCreatedTeam: 'cm32w9hz101lj1ztajhesqu9z',
  invitationToTeam: 'cm32wb5yt01uyf362gulg1kjn',
};

export const createLoopsClient = () => {
  if (!process.env.LOOPS_API_KEY) {
    console.warn('LOOPS API KEY is not set');
    return null;
  }

  return new LoopsClient(process.env.LOOPS_API_KEY);
};
