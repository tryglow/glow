'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';

export default function TestUserPrivateLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      alert('Please enter your email and password');
    }

    const result = await signIn('credentials', {
      redirect: false, // Prevents redirecting to the home page after login
      email,
      password,
    });

    if (result?.error) {
      console.error(result.error);
    } else {
      router.push('/');
    }
  };
  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">
        Login form for app review test users
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-slate-200 rounded-ld min-w-96 p-6"
      >
        <label className="flex flex-col">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>
        <label className="flex flex-col">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}
