import {
  type AbortMultipartUploadCommandOutput,
  CompleteMultipartUploadCommandOutput,
  S3,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { randomUUID } from 'crypto';
import { getServerSession } from 'next-auth';
import sharp from 'sharp';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

const uploadTemplateFile = async (
  fileBuffer: Buffer,
  fileName: string,
  fileContentType: string
) => {
  return await new Upload({
    client: s3,
    params: {
      Bucket: `${process.env.NEXT_PUBLIC_APP_ENV}.onedash.user-uploads`,
      Key: fileName,
      ContentType: fileContentType,
      Body: fileBuffer,
    },
  }).done();
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({
      error: {
        message: 'Unauthorized',
      },
    });
  }

  const formData = await req.formData();
  const files = formData.getAll('file') as File[];
  const blockId = formData.get('blockId') as string;

  const firstFileOnly = files[0];

  if (!firstFileOnly || !blockId) {
    // RETURN AN ERROR
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  const block = await prisma.block.findUnique({
    where: {
      id: blockId,
      page: {
        userId: session.user.id,
      },
    },
  });

  if (!block) {
    return Response.json({
      error: {
        message: 'Block not found',
      },
    });
  }

  const convertedImage = await sharp(await firstFileOnly.arrayBuffer())
    .resize(800)
    .toFormat('webp', {
      quality: 80,
    })
    .toBuffer();

  const fileName = `${blockId}/${randomUUID()}`;

  const assetUpload = await uploadTemplateFile(
    convertedImage,
    fileName,
    'image/webp'
  );

  if (isComplete(assetUpload)) {
    const fileLocation =
      process.env.NEXT_PUBLIC_APP_ENV === 'development'
        ? `https://cdn.dev.oneda.sh/${assetUpload.Key}`
        : `https://cdn.oneda.sh/${assetUpload.Key}`;

    // const fileLocation = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${assetUpload.Bucket}/${assetUpload.Key}`

    await prisma.block.update({
      where: {
        id: blockId,
      },
      data: {
        data: {
          src: fileLocation,
        },
      },
    });
    return Response.json({ message: 'success', url: fileLocation });
  }
}
