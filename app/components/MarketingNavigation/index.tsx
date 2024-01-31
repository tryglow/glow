'use client';

import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

import { Button } from '@/components/ui/button';

import { LoginWidget } from '../LoginWidget';

const navigation = [
  { name: 'Features', href: '#' },
  { name: 'Pricing', href: '#' },
  { name: 'Integrations', href: '#' },
];

interface Props {
  children: ReactNode;
}

export default function MarketingNavigation({ children }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <svg viewBox="0 0 196 240" width={20} height={20} fill="none">
                <path
                  fill="#000"
                  fillRule="evenodd"
                  d="M76.4539 239.092C142.477 239.092 196 185.57 196 119.546 196 53.5226 142.477 0 76.4539 0v43.0922C34.2296 43.0922.0000037 77.3217 0 119.546-.0000037 161.77 34.2296 196 76.4539 196v43.092ZM76.454 196c42.224 0 76.454-34.23 76.454-76.454 0-42.2242-34.23-76.4538-76.454-76.4538V196Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Glow</span>
            </Link>
          </div>
          {/* <div className="hidden lg:flex lg:gap-x-2">
            {navigation.map((item) => {
              return (
                <Button variant="ghost" asChild key={item.name}>
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              );
            })}
          </div> */}
          <div className="flex flex-1 items-center justify-end gap-x-3">
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
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center gap-x-6">
              <Link
                href="/"
                className="-m-1.5 p-1.5 flex items-center gap-2 flex-1"
              >
                <svg viewBox="0 0 196 240" width={20} height={20} fill="none">
                  <path
                    fill="#000"
                    fillRule="evenodd"
                    d="M76.4539 239.092C142.477 239.092 196 185.57 196 119.546 196 53.5226 142.477 0 76.4539 0v43.0922C34.2296 43.0922.0000037 77.3217 0 119.546-.0000037 161.77 34.2296 196 76.4539 196v43.092ZM76.454 196c42.224 0 76.454-34.23 76.454-76.454 0-42.2242-34.23-76.4538-76.454-76.4538V196Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Glow</span>
              </Link>
              <LoginWidget trigger={<Button>Create Page</Button>} />

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
                {/* <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div> */}
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </>
  );
}
