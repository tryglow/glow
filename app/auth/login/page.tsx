import {getProviders} from 'next-auth/react';
import {LoginProviderButton} from '@/app/components/LoginProviderButton';
import {getUser} from '@/lib/auth';
import {redirect} from 'next/navigation';

export default async function LoginPage() {
  const providers = await getProviders();

  console.log('PROVIDERS', providers);
  const user = await getUser();

  if (user) {
    redirect('/activity');
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login
          </h2>
          <span className="text-gray-900 text-sm">
            Your Google Account must have been invited in order to register.
          </span>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div></div>
        </div>
      </div>
    </>
  );
}
