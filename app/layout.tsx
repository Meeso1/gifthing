import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gift Recommendation System',
  description: 'AI-powered gift recommendation assistant.',
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

