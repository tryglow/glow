import { auth, signOut as authSignOut, signIn, unstable_update } from '@/app/lib/auth';


import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { verificationCache } from '@/lib/verification-cache';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const team = searchParams.get('team');

  if (!token) {
    return NextResponse.json(
      { error: 'Token is required' },
      { status: 400 }
    );
  }

  try {

    let headers: { [key: string]: string } = {
      Authorization: `Bearer ${token}`,
    };
    
    if (team) {
      headers['X-Press-Team'] = `${team}`;
    }
    // Fetch user info from Zaviago Hosting API
    const response = await axios.get(
      'https://hosting.zaviago.com/api/method/press.api.account.get',
      {
        headers: headers,
      }
    );

    const userinfo = response?.data?.message?.team;
    const user_email = userinfo?.user;

    if (!user_email) {
      return NextResponse.json(
        { error: 'Failed to fetch user information' },
        { status: 400 }
      );
    }

    (global as any).__VERIFICATION_URL__ = null;

    // Generate magic link
    const signInResponse = await signIn('magic-link', {
      email: user_email,
      redirect: false,
      callbackUrl: '/',
    }) as { url: string };

    const verificationUrl = verificationCache.get(user_email);


    if (verificationUrl) {
      return NextResponse.redirect(verificationUrl);
    }


  } catch (error) {
    console.error('SSO Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
