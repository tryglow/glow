'use client'

import { ClientSafeProvider, signIn } from 'next-auth/react'
import { ReactNode } from 'react'

interface Props {
  provider: ClientSafeProvider
}

const providerIcons: Record<string, ReactNode> = {
  google: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.68 8.18183C15.68 7.61456 15.6291 7.06911 15.5345 6.54547H8V9.64002H12.3055C12.12 10.64 11.5564 11.4873 10.7091 12.0546V14.0618H13.2945C14.8073 12.6691 15.68 10.6182 15.68 8.18183Z"
        fill="#4285F4"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8 16C10.16 16 11.9709 15.2837 13.2945 14.0618L10.7091 12.0546C9.99273 12.5346 9.07636 12.8182 8 12.8182C5.91636 12.8182 4.15272 11.4109 3.52363 9.52002H0.850906V11.5927C2.16727 14.2073 4.87272 16 8 16Z"
        fill="#34A853"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.52364 9.52001C3.36364 9.04001 3.27273 8.52729 3.27273 8.00001C3.27273 7.47274 3.36364 6.96001 3.52364 6.48001V4.40729H0.850909C0.309091 5.48729 0 6.70911 0 8.00001C0 9.29092 0.309091 10.5127 0.850909 11.5927L3.52364 9.52001Z"
        fill="#FBBC05"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8 3.18182C9.17454 3.18182 10.2291 3.58545 11.0582 4.37818L13.3527 2.08364C11.9673 0.792727 10.1564 0 8 0C4.87272 0 2.16727 1.79273 0.850906 4.40727L3.52363 6.48C4.15272 4.58909 5.91636 3.18182 8 3.18182Z"
        fill="#EA4335"
      ></path>
    </svg>
  ),
}

export function LoginProviderButton({ provider }: Props) {
  return (
    <button
      type="submit"
      onClick={() => signIn(provider.id)}
      className="flex w-full justify-center items-center border border-stone-200 rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-stone-800  hover:bg-stone-100"
    >
      {providerIcons[provider.id]}
      <span className="ml-3">Continue with {provider.name}</span>
    </button>
  )
}
