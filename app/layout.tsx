import type { Metadata } from 'next'
import { Poppins, Bebas_Neue } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/authContext'
import './globals.css'
import 'leaflet/dist/leaflet.css'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-horizon"
});

export const metadata: Metadata = {
  title: 'RenTara - Vehicle Rental App',
  description: 'Rent vehicles from verified providers in your area. Cars, Vans, Trucks, Jeepneys, and Tricycles.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${poppins.variable} ${bebas.variable}`}>
      <body className="font-poppins antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
