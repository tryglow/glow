'use client';

import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { LoginProviderButton } from '../LoginProviderButton';

interface Props {
  trigger: React.ReactNode;
}

export function LoginWidget({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome back!</DialogTitle>
          <DialogDescription>Login to your account below.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoginProviderButton provider="twitter" className="mt-2 md:mt-0" />
          <LoginProviderButton provider="google" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
