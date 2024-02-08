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
          <AlertDialogTitle>Welcome back!</AlertDialogTitle>
          <AlertDialogDescription>
            Login to your account below.
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
