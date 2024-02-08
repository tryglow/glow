'use client';

import Link from 'next/link';
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
import { Input } from '@/components/ui/input';

import { LoginProviderButton } from '../LoginProviderButton';

interface Props {
  trigger: React.ReactNode;
}

export function ClaimInviteDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState('');

  const setCookie = async () => {
    if (window.document) {
      const date = new Date();
      date.setTime(date.getTime() + 5 * 60 * 1000);
      document.cookie = `inviteCode=${String(userInput)}; expires=${date.toUTCString()}; path=/`;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold tracking-tight text-2xl">
            Enter invite code
          </AlertDialogTitle>
          <AlertDialogDescription>
            Welcome to Glow. To get started, please enter your invite code and
            then sign in with either Twitter or Google.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-3">
          <Input
            value={userInput}
            onChange={(ev) => setUserInput(ev.target.value)}
            type="text"
            placeholder="GLOW-XXX"
            className="h-10"
          />
          <span className="text-xs block mt-3 text-black/80">
            Don&apos;t have an invite code? Reach out to us at{' '}
            <Link href="https://twitter.com/tryglow">@tryglow</Link> 👀
          </span>
        </div>
        <AlertDialogFooter>
          <LoginProviderButton
            onClick={setCookie}
            provider="twitter"
            className="mt-2 md:mt-0"
          />
          <LoginProviderButton onClick={setCookie} provider="google" />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
