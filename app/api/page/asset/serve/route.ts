import path from 'path';
import { promises as fs } from 'fs';

// Directory for uploaded files
const uploadDir = path.join(process.cwd(), 'uploads');

export async function GET(req: Request) {
  const url = new URL(req.url);
  const file = url.searchParams.get('file');

  if (!file) {
    return new Response(
      JSON.stringify({
        error: { message: 'File name is required' },
      }),
      { status: 400 }
    );
  }

  const filePath = path.join(uploadDir, file);

  try {
    const fileContent = await fs.readFile(filePath);
    const fileExtension = path.extname(file);

    // Set the correct MIME type based on file extension
    const mimeType =
      fileExtension === '.webp'
        ? 'image/webp'
        : fileExtension === '.png'
        ? 'image/png'
        : 'application/octet-stream';

    return new Response(fileContent, {
      headers: { 'Content-Type': mimeType },
    });
  } catch (err) {
    console.error('Error serving file:', err);
    return new Response(
      JSON.stringify({
        error: { message: 'File not found' },
      }),
      { status: 404 }
    );
  }
}
