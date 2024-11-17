import { auth } from '@/app/lib/auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function VerifyLoginPage() {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return (
    <section className="bg-muted min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Image
            width={40}
            height={40}
            src="/assets/logo.png"
            alt="Glow"
            className="mx-auto h-10 w-auto rounded-md mb-4"
          />

          <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Verify your email
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 space-y-3">
          <div className="mt-4 w-full flex-1 rounded-lg border bg-white px-6 py-4 shadow-sm md:w-96 dark:bg-zinc-950 text-center">
            <span className="text-base text-zinc-600 text-center">
              We&apos;ve sent a verification link to your email. Please click on
              the link to continue.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
