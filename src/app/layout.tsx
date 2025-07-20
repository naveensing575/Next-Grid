import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zuperscore Data Grid',
  description: 'Frontend Assignment using Next.js + Tailwind + TS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  )
}
