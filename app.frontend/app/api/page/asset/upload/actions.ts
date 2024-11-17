import {
  CompleteMultipartUploadCommandOutput,
  S3,
  type AbortMultipartUploadCommandOutput,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { track } from '@vercel/analytics/server';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

import { auth } from '@/app/lib/auth';
import { AssetContexts } from '@/lib/asset';

function isComplete(
  output:
    | CompleteMultipartUploadCommandOutput
    | AbortMultipartUploadCommandOutput
): output is CompleteMultipartUploadCommandOutput {
  return (output as CompleteMultipartUploadCommandOutput).ETag !== undefined;
}

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  region: process.env.AWS_REGION,
});

const uploadFile = async (
  fileBuffer: Buffer,
  fileName: string,
  fileContentType: string
) => {
  return await new Upload({
    client: s3,
    params: {
      Bucket: `${process.env.NEXT_PUBLIC_APP_ENV}.glow.user-uploads`,
      Key: fileName,
      ContentType: fileContentType,
      Body: fileBuffer,
    },
  }).done();
};

export const assetContexts: Record<
  AssetContexts,
  {
    keyPrefix: string;
    quality: number;
    resize: {
      width: number;
      height: number;
    };
  }
> = {
  pageBackgroundImage: {
    keyPrefix: 'pg-bg',
    quality: 100,
    resize: {
      width: 1200,
      height: 800,
    },
  },
  blockAsset: {
    keyPrefix: 'block',
    quality: 80,
    resize: {
      width: 800,
      height: 800,
    },
  },
};

export async function uploadAsset({
  context,
  file,
  referenceId,
}: {
  context: AssetContexts;
  file: File;
  referenceId: string;
}) {
  const session = await auth();

  if (!session?.user) {
    return {
      error: 'Not authenticated',
    };
  }

  const assetConfig = assetContexts[context];

  const buffer = await file.arrayBuffer();

  const [webpImage, pngImage] = await Promise.all([
    sharp(buffer)
      .resize(assetConfig.resize.width, assetConfig.resize.height)
      .toFormat('webp', {
        quality: assetConfig.quality,
      })
      .toBuffer(),
    sharp(buffer)
      .resize(assetConfig.resize.width, assetConfig.resize.height)
      .toFormat('png', {
        quality: assetConfig.quality,
      })
      .toBuffer(),
  ]);

  const fileId = randomUUID();
  const baseFileName = `${assetConfig.keyPrefix}-${referenceId}/${fileId}`;

  const [webpUpload, pngUpload] = await Promise.all([
    uploadFile(webpImage, baseFileName, 'image/webp'),
    uploadFile(pngImage, `${baseFileName}.png`, 'image/png'),
  ]);

  if (isComplete(webpUpload) && isComplete(pngUpload)) {
    const fileLocation =
      process.env.NEXT_PUBLIC_APP_ENV === 'development'
        ? `https://cdn.dev.glow.as/${webpUpload.Key}`
        : `https://cdn.glow.as/${webpUpload.Key}`;

    await track('assetUploaded', {
      userId: session.user.id,
      teamId: session.currentTeamId,
      assetContext: context,
    });

    return {
      data: {
        url: fileLocation,
      },
    };
  }

  return {
    error: 'Failed to upload asset',
  };
}
