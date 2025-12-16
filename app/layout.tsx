import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MT Booking Mockups',
  description: 'Booking widget and generated sites for Music Traveler Venues',
  generator: 'v0.app',
  icons: {
    icon: 'https://d1r3culteut8k2.cloudfront.net/media/attachments/room_host/13/MUSIC_TRAVELER_-_LOGO_-_fbw2.png',
    apple: 'https://d1r3culteut8k2.cloudfront.net/media/attachments/room_host/13/MUSIC_TRAVELER_-_LOGO_-_fbw2.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
