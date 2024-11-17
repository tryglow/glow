import prisma from '@/lib/prisma';

const generateRandomId = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export async function createInviteCodesForUser(
  userId: string,
  numberOfCodes: number
) {
  const inviteCodes = Array.from({ length: numberOfCodes }, () => ({
    assignedToId: userId,
    code: `GLOW-${generateRandomId(10)}`,
  }));

  return prisma.inviteCode.createMany({
    data: inviteCodes,
  });
}
