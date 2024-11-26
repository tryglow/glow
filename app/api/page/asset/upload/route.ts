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
import { isObjKey } from '@/lib/utils';
import path from 'path';
import { promises as fs } from 'fs';

// function isComplete(
//   output:
//     | CompleteMultipartUploadCommandOutput
//     | AbortMultipartUploadCommandOutput
// ): output is CompleteMultipartUploadCommandOutput {
//   return (output as CompleteMultipartUploadCommandOutput).ETag !== undefined;
// }

// const s3 = new S3({
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
//   },
//   region: process.env.AWS_REGION,
// });

// const uploadTemplateFile = async (
//   fileBuffer: Buffer,
//   fileName: string,
//   fileContentType: string
// ) => {
//   return await new Upload({
//     client: s3,
//     params: {
//       Bucket: `${process.env.NEXT_PUBLIC_APP_ENV}.onedash.user-uploads`,
//       Key: fileName,
//       ContentType: fileContentType,
//       Body: fileBuffer,
//     },
//   }).done();
// };

// const assetContexts: Record<
//   AssetContexts,
//   {
//     keyPrefix: string;
//     quality: number;
//     resize: {
//       width: number;
//       height: number;
//     };
//   }
// > = {
//   pageBackgroundImage: {
//     keyPrefix: 'pg-bg',
//     quality: 100,
//     resize: {
//       width: 1200,
//       height: 800,
//     },
//   },
//   blockAsset: {
//     keyPrefix: 'block',
//     quality: 80,
//     resize: {
//       width: 800,
//       height: 800,
//     },
//   },
// };

// For locally upload
const uploadDir = path.join(process.cwd(), 'public', 'assets', 'uploads');

// Ensure the upload directory exists
const ensureUploadDirExists = async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Error creating upload directory:', err);
  }
};


export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return Response.json({
      error: {
        message: 'Unauthorized',
      },
    });
  }

  // For locally upload
  await ensureUploadDirExists();


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

  // For locally upload
  const buffer = await firstFileOnly.arrayBuffer();
    const sharpBuffer = Buffer.from(buffer);

    // Resize and convert the image to different formats
    const [webpImage, pngImage] = await Promise.all([
      sharp(sharpBuffer).resize(1200, 800).toFormat('webp').toBuffer(),
      sharp(sharpBuffer).resize(1200, 800).toFormat('png').toBuffer(),
    ]);

    const fileId = randomUUID();
    const pngPath = path.join(uploadDir, `${fileId}.png`);

    // Save the images to the upload directory
    await Promise.all([
      fs.writeFile(pngPath, pngImage),
    ]);

    const pngUrl = `/uploads/${fileId}.png`;

    try{
      return new Response(
        JSON.stringify({
          message: 'success',
          url: pngUrl,
        }),
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Error during file upload:', error);
      return new Response(
        JSON.stringify({
          error: { message: 'Internal server error', details: error?.message },
        }),
        { status: 500 }
      );
    }

  // if (!isObjKey(context, assetContexts)) {
  //   return Response.json({
  //     error: {
  //       message: 'Invalid asset context',
  //     },
  //   });
  // }

  // const assetConfig = assetContexts[context];

  // const buffer = await firstFileOnly.arrayBuffer();

  // const [webpImage, pngImage] = await Promise.all([
  //   sharp(buffer)
  //     .resize(assetConfig.resize.width, assetConfig.resize.height)
  //     .toFormat('webp', {
  //       quality: assetConfig.quality,
  //     })
  //     .toBuffer(),
  //   sharp(buffer)
  //     .resize(assetConfig.resize.width, assetConfig.resize.height)
  //     .toFormat('png', {
  //       quality: assetConfig.quality,
  //     })
  //     .toBuffer(),
  // ]);

  // const fileId = randomUUID();
  // const baseFileName = `${assetConfig.keyPrefix}-${referenceId}/${fileId}`;

  // const [webpUpload, pngUpload] = await Promise.all([
  //   uploadTemplateFile(webpImage, baseFileName, 'image/webp'),
  //   uploadTemplateFile(pngImage, `${baseFileName}.png`, 'image/png'),
  // ]);

  // if (isComplete(webpUpload) && isComplete(pngUpload)) {
  //   const fileLocation =
  //     process.env.NEXT_PUBLIC_APP_ENV === 'development'
  //       ? `https://cdn.dev.glow.as/${webpUpload.Key}`
  //       : `https://cdn.glow.as/${webpUpload.Key}`;

  //   await track('assetUploaded', {
  //     userId: session.user.id,
  //     teamId: session.currentTeamId,
  //     assetContext: context,
  //   });

  //   // const fileLocation = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${assetUpload.Bucket}/${assetUpload.Key}`

  //   return Response.json({ message: 'success', url: fileLocation });
  // }
}
