import { redirect } from 'next/navigation';

import { auth } from '@/app/lib/auth';

import { NewPageDialog } from '@/components/NewPageDialog';

export default async function NewPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect('/');
  }

  return <NewPageDialog open={true} />;
}
