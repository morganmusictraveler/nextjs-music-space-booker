import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const nunitoSans = Nunito_Sans({ 
  subsets: ["latin"],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-nunito-sans',
});

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
    <html lang="en" className={nunitoSans.variable}>
      <head>
        <script src="https://kit.fontawesome.com/c7afc8063a.js" crossOrigin="anonymous"></script>
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
