import { signIn } from '@/app/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const redirectTo = searchParams.get('redirectTo');
  const provider = searchParams.get('provider');
  const email = searchParams.get('email');

  if (provider === 'http-email') {
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    return await signIn('http-email', {
      email,
      redirectTo: redirectTo || undefined,
      redirect: true,
    });
  }

  if (provider === 'google') {
    return await signIn('google', {
      redirectTo: redirectTo || undefined,
      redirect: true,
    });
  }

  if (provider === 'twitter') {
    return await signIn('twitter', {
      redirectTo: redirectTo || undefined,
      redirect: true,
    });
  }

  if (provider === 'tiktok') {
    return await signIn('tiktok', {
      redirectTo: redirectTo || undefined,
      redirect: true,
    });
  }

  return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
}
