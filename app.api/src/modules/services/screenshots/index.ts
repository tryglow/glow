import { generateScreenshotSchema } from '@/modules/services/screenshots/schema';
import { takeScreenshot } from '@/modules/services/screenshots/service';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async function threadsServiceRoutes(
  fastify: FastifyInstance,
  opts: any
) {
  fastify.post(
    '/screenshots/generate-screenshot',
    { schema: generateScreenshotSchema },
    generateScreenshotHandler
  );
}

async function generateScreenshotHandler(
  request: FastifyRequest<{ Body: { url: string } }>,
  response: FastifyReply
) {
  await request.server.authenticate(request, response);

  const { url } = request.body;

  const imageUrl = await takeScreenshot(url);

  if (!imageUrl) {
    return response.status(500).send({
      error: 'Failed to generate screenshot',
    });
  }

  return response.status(200).send({
    url: imageUrl,
  });
}
