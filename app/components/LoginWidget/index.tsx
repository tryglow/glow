'use client'

import { LoginProviderButton } from '../LoginProviderButton'
import { Button } from '@/components/ui/button'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function LoginWidget() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="fixed top-2 right-2">
        <Button type="button">Log in or sign up</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Let&apos;s get started!</AlertDialogTitle>
          <AlertDialogDescription>
            Sign up or login to begin creating your page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <LoginProviderButton
            provider={{
              id: 'google',
              name: 'Google',
              type: 'oauth',
              signinUrl: '/api/auth/signin/google',
              callbackUrl: '/api/auth/callback/google',
            }}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
