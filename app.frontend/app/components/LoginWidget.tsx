'use client';

import { useState } from 'react';

import { LoginForm } from '@/app/components/LoginForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Props {
  trigger: React.ReactNode;
  isSignup?: boolean;
}

export function LoginWidget({ trigger, isSignup }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSignup ? 'Get started ' : 'Welcome back!'}
          </DialogTitle>
          <DialogDescription>
            {isSignup
              ? 'Create your account using one of the options below'
              : 'Login to your account below.'}
          </DialogDescription>
        </DialogHeader>

        <LoginForm onComplete={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
