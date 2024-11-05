import { getEnabledBlocks } from '@/app/api/blocks/enabled-blocks/actions';
import { auth } from '@/app/lib/auth';

export async function GET() {
  const session = await auth();

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const enabledBlocks = await getEnabledBlocks();

  return Response.json(enabledBlocks);
}
