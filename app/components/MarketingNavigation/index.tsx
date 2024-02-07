'use client';

import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

import { Container } from '@/app/i/landing-page/page';

import { Button } from '@/components/ui/button';

import { LoginWidget } from '../LoginWidget';

interface Props {
  children: ReactNode;
}

export default function MarketingNavigation({ children }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white">
        <Container className="py-4">
          <nav className="flex items-center justify-between gap-x-6">
            <div className="flex lg:flex-1">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                <svg viewBox="0 0 224 224" width={20} fill="none">
                  <path
                    fill="currentColor"
                    d="M222.253 222.253c-.884.884-2.437.803-3.727-.118-95.89-70.919-115.737-70.878-212.41732.901-1.06496.777-2.77423.467-4.02409-.783-1.249868-1.25-1.559625-2.959-.78309-4.024 71.7792-96.68 71.8573-116.564.90128-212.4171-.96957-1.33787-1.0021-2.84364-.11818-3.72755.88392-.88392 2.43771-.80328 3.72751.11822C101.702 73.1218 121.549 73.0805 218.229 1.30128c1.065-.776532 2.774-.466797 4.024.78307 1.25 1.24986 1.56 2.95915.783 4.02411-71.779 96.68054-71.857 116.56454-.901 212.41754.922 1.289 1.002 2.843.118 3.727Z"
                  />
                </svg>
                <span className="font-medium">Glow</span>
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-end gap-x-3">
              <Button asChild variant="ghost" className="hidden md:flex">
                <Link href="https://twitter.com/tryglow">Twitter / X</Link>
              </Button>
              {children}
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </nav>
        </Container>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-4 py-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center gap-x-6">
              <Link
                href="/"
                className="-m-1.5 p-1.5 flex items-center gap-2 flex-1"
              >
                <svg viewBox="0 0 224 224" width={20} fill="none">
                  <path
                    fill="currentColor"
                    d="M222.253 222.253c-.884.884-2.437.803-3.727-.118-95.89-70.919-115.737-70.878-212.41732.901-1.06496.777-2.77423.467-4.02409-.783-1.249868-1.25-1.559625-2.959-.78309-4.024 71.7792-96.68 71.8573-116.564.90128-212.4171-.96957-1.33787-1.0021-2.84364-.11818-3.72755.88392-.88392 2.43771-.80328 3.72751.11822C101.702 73.1218 121.549 73.0805 218.229 1.30128c1.065-.776532 2.774-.466797 4.024.78307 1.25 1.24986 1.56 2.95915.783 4.02411-71.779 96.68054-71.857 116.56454-.901 212.41754.922 1.289 1.002 2.843.118 3.727Z"
                  />
                </svg>
                <span className="font-medium">Glow</span>
              </Link>
              {children}

              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="py-6">
                  <Link
                    href="/api/auth/signin/google"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in with Google
                  </Link>
                  <Link
                    href="/api/auth/signin/twitter"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in with Twitter
                  </Link>
                </div>
                <div className="py-6">
                  <Link
                    href="https://x.com/tryglow"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Twitter / X
                  </Link>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </>
  );
}
