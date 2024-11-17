import {
  assetContexts,
  uploadAsset,
} from '@/app/api/page/asset/upload/actions';
import { auth } from '@/app/lib/auth';
import { isObjKey } from '@/lib/utils';

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return Response.json({
      error: {
        message: 'Unauthorized',
      },
    });
  }

  const formData = await req.formData();
  const files = formData.getAll('file') as File[];
  const referenceId = formData.get('referenceId') as string;
  const context = formData.get('assetContext') as string;

  const firstFileOnly = files[0];

  if (!firstFileOnly || !referenceId) {
    // RETURN AN ERROR
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  if (!isObjKey(context, assetContexts)) {
    return Response.json({
      error: {
        message: 'Invalid asset context',
      },
    });
  }

  const uploadResult = await uploadAsset({
    context,
    file: firstFileOnly,
    referenceId,
  });

  if (uploadResult?.error) {
    return Response.json({
      error: uploadResult.error,
    });
  }

  if (!uploadResult.data) {
    return Response.json({
      error: {
        message: 'Failed to upload asset',
      },
    });
  }

  return Response.json({ message: 'success', url: uploadResult.data.url });
}
