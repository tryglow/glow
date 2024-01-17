import './globals.css'
import './react-grid-layout.scss'

import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Pulse',
  description: 'Your personal site builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-system-bg-primary">
        <Toaster />
        {children}
      </body>
      <Analytics />
    </html>
  )
}
