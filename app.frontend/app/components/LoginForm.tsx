'use client';

import { useState } from 'react';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { toast } from '@/app/components/ui/use-toast';
import { LoginProviderButton } from '@/components/LoginProviderButton';

import { signInWithEmail } from '@/app/lib/auth-actions';

interface Props {
  onComplete?: () => void;
  redirectTo?: string;
}

export function LoginForm({ onComplete, redirectTo }: Props) {
  const [email, setEmail] = useState('');
  const handleEmailSubmit = async () => {
    if (!email || email === '') {
      toast({
        title: 'Please enter your email',
      });
      return;
    }

    await signInWithEmail(email, redirectTo);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <form action={handleEmailSubmit}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <Button size="lg" type="submit" className="w-full mt-4">
          Continue with Email
        </Button>
      </form>
      <div className="flex items-center my-4">
        <span className="h-[1px] w-full bg-zinc-200" />
        <span className="text-zinc-400 text-sm mx-4 uppercase font-semibold">
          Or
        </span>
        <span className="h-[1px] w-full bg-zinc-200" />
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <LoginProviderButton
          provider="twitter"
          className="mt-2 md:mt-0"
          redirectTo={redirectTo}
        />
        <LoginProviderButton provider="google" redirectTo={redirectTo} />
        <LoginProviderButton provider="tiktok" redirectTo={redirectTo} />
      </div>
    </div>
  );
}
