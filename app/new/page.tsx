import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth';

import { NewPageDialog } from '../components/NewPageDialog';

export default async function NewPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect('/');
  }

  return <NewPageDialog open={true} />;
}
