import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { blockId: string } }
) {
  const blockId = params.blockId;

  if (!blockId) {
    return Response.json(null, {
      status: 400,
    });
  }

  const block = await prisma.block.findUnique({
    where: {
      id: blockId,
    },
  });

  if (!block) {
    return Response.json(null, {
      status: 404,
    });
  }

  return Response.json(block.data);
}
