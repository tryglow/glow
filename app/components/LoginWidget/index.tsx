'use client';

import { LoginProviderButton } from '../LoginProviderButton';
import { Button } from '@/components/ui/button';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface Props {
  trigger: React.ReactNode;
}

export function LoginWidget({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Let&apos;s get started!</AlertDialogTitle>
          <AlertDialogDescription>
            Sign up or login to begin creating your page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <LoginProviderButton
            provider={{
              id: 'google',
              name: 'Google',
              type: 'oauth',
              signinUrl: '/api/auth/signin/google',
              callbackUrl: '/api/auth/callback/google',
            }}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
