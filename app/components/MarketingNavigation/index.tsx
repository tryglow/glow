'use client';

import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

import { Container } from '@/app/i/landing-page/page';

import { Button } from '@/components/ui/button';

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
                <svg viewBox="0 0 312 312" width={20} fill="none">
                  <path
                    fill="currentColor"
                    d="M311.366 155.683c0 1.25-1.156 2.292-2.72 2.552-117.952 17.657-131.956 31.72-149.564 150.839-.204 1.302-1.632 2.292-3.399 2.292-1.768 0-3.195-.99-3.399-2.292C134.676 189.955 120.671 175.84 2.71935 158.235 1.08774 157.975 0 156.933 0 155.683s1.15572-2.292 2.71935-2.552C120.671 135.474 134.676 121.411 152.284 2.29176 152.488.989625 153.915 0 155.683 0c1.767 0 3.195.989625 3.399 2.29176C176.69 121.411 190.694 135.526 308.646 153.131c1.564.26 2.72 1.302 2.72 2.552Z"
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
                <svg viewBox="0 0 312 312" width={20} fill="none">
                  <path
                    fill="currentColor"
                    d="M311.366 155.683c0 1.25-1.156 2.292-2.72 2.552-117.952 17.657-131.956 31.72-149.564 150.839-.204 1.302-1.632 2.292-3.399 2.292-1.768 0-3.195-.99-3.399-2.292C134.676 189.955 120.671 175.84 2.71935 158.235 1.08774 157.975 0 156.933 0 155.683s1.15572-2.292 2.71935-2.552C120.671 135.474 134.676 121.411 152.284 2.29176 152.488.989625 153.915 0 155.683 0c1.767 0 3.195.989625 3.399 2.29176C176.69 121.411 190.694 135.526 308.646 153.131c1.564.26 2.72 1.302 2.72 2.552Z"
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
