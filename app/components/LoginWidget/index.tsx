'use client';

import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { LoginProviderButton } from '../LoginProviderButton';

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
          <LoginProviderButton provider="twitter" className="mt-2 md:mt-0" />
          <LoginProviderButton provider="google" />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
