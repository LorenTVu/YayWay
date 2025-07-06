import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YayWay Karaoke',
  description: 'A modern karaoke app with real-time features, synchronized lyrics, and social engagement. Join rooms, perform with friends, and discover new music.',
  keywords: ['karaoke', 'music', 'singing', 'social', 'real-time', 'lyrics', 'performance'],
  authors: [{ name: 'YayWay Team' }],
  creator: 'YayWay Team',
  publisher: 'YayWay',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'YayWay Karaoke - Sing Together, Create Together',
    description: 'A modern karaoke app with real-time features, synchronized lyrics, and social engagement.',
    siteName: 'YayWay Karaoke',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'YayWay Karaoke',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YayWay Karaoke - Sing Together, Create Together',
    description: 'A modern karaoke app with real-time features, synchronized lyrics, and social engagement.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <meta name="theme-color" content="#0f0f23" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a2e',
                color: '#e2e8f0',
                border: '1px solid #2d3748',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#1a1a2e',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#1a1a2e',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
} 