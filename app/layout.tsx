import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Reel Scenario Generator',
  description: 'Znajdź viralowe Reelsy i wygeneruj scenariusz dla salonu beauty',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
