'use server';

import { auth, signOut as authSignOut, signIn, unstable_update } from './auth';

export async function signOut() {
  await authSignOut();
}

export async function signInWithEmail(email: string, redirectTo?: string) {
  return await signIn('http-email', { email, redirectTo, redirect: true });
}

export async function signInWithCredentials(email: string, password: string) {
  return await signIn('credentials', {
    email,
    password,
    redirect: true,
    redirectTo: '/',
  });
}

export async function signInWithGoogle(redirectTo?: string) {
  return await signIn('google', { redirectTo, redirect: true });
}

export async function signInWithTwitter(redirectTo?: string) {
  return await signIn('twitter', { redirectTo, redirect: true });
}

export async function hideGlowTour() {
  const session = await auth();

  if (!session) return;

  await unstable_update({
    ...session,
    features: {
      showGlowTour: false,
    },
  });

  return {
    success: true,
  };
}
