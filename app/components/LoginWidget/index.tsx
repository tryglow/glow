'use client';

import {Dialog, Transition} from '@headlessui/react';
import {Fragment, useState} from 'react';
import {LoginProviderButton} from '../LoginProviderButton';

export function LoginWidget() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="fixed top-4 right-4 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          Log in or sign up
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Let&apos;s get started!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Sign up or login to begin creating your page.
                    </p>
                  </div>

                  <div className="mt-4">
                    <LoginProviderButton
                      provider={{
                        id: 'google',
                        name: 'Google',
                        type: 'oauth',
                        signinUrl: '/api/auth/signin/google',
                        callbackUrl: '/api/auth/callback/google',
                      }}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
