import { getIpAddress, getReactionsForPageId } from '@/app/api/reactions/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const pageId = req.nextUrl.searchParams.get('pageId');

  if (!pageId) {
    return new Response('Missing required fields', { status: 400 });
  }

  const ipAddress = await getIpAddress();

  const reactions = await getReactionsForPageId({ pageId, ipAddress });

  return NextResponse.json(reactions);
}
