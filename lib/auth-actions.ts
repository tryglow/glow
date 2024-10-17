'use server';

import { signOut as authSignOut, signIn } from '@/lib/auth';

export async function signOut() {
  await authSignOut();
}

export async function signInWithEmail(email: string, redirectTo?: string) {
  return await signIn('resend', { email, redirectTo, redirect: true });
}

export async function signInWithGoogle(redirectTo?: string) {
  return await signIn('google', { redirectTo, redirect: true });
}

export async function signInWithTwitter(redirectTo?: string) {
  return await signIn('twitter', { redirectTo, redirect: true });
}
