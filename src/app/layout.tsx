import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cosentus AI - One platform. Patient to payment.',
  description: 'Stop juggling vendors. Full-cycle healthcare automation built on 25 years of expertise.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

