import { auth } from '@/lib/auth';
import { getTeamIntegrations } from './actions';

export async function GET() {
  const session = await auth();

  if (!session) {
    return Response.json({
      error: {
        message: 'Authentication required',
      },
    });
  }

  const integrations = await getTeamIntegrations();

  return Response.json(integrations);
}
