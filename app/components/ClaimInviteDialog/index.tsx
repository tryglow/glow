'use client';

import Link from 'next/link';
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold tracking-tight text-2xl">
            Enter invite code
          </DialogTitle>
          <DialogDescription>
            Welcome to Glow. To get started, please enter your invite code and
            then sign in with either Twitter or Google.
          </DialogDescription>
        </DialogHeader>
        <div className="my-3">
          <Input
            value={userInput}
            onChange={(ev) => setUserInput(ev.target.value)}
            type="text"
            placeholder="GLOW-XXX"
            className="h-10"
          />
          <span className="text-xs block mt-3 text-black/80">
            Don&apos;t have an invite code? We regularly tweet out new codes at{' '}
            <Link href="https://twitter.com/tryglow">@tryglow</Link> 👀
          </span>
        </div>
        <DialogFooter>
          <LoginProviderButton
            onClick={setCookie}
            provider="twitter"
            className="mt-2 md:mt-0"
          />
          <LoginProviderButton onClick={setCookie} provider="google" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
