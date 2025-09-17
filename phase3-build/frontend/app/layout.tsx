import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'TNT Speed-to-Lead Dashboard',
  description: 'Corporate transportation lead management system - Driven by Service, Defined by Excellence',
  keywords: ['transportation', 'limousine', 'corporate', 'leads', 'dashboard'],
  authors: [{ name: 'TNT Transportation' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}