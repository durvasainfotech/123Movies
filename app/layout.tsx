import React from 'react';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: '123Moviesflix - Watch Free Movies and TV Shows Online',
  description: 'Watch the latest movies and TV shows online for free. Stream full HD movies and TV series on 123Movies.',
  keywords: '123Movies, watch movies, free movies, watch TV shows, stream movies, HD movies, online movies',
  authors: [{ name: '123Movies' }],
  creator: '123Moviesflix',
  publisher: '123Moviesflix',
  metadataBase: new URL('https://123moviesflix.info'),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'FYUf5N4K92YIoSO0KENaaqvu6ja-aWj9-tjDY8HSkDQ',
  },
  other: {
    'google-adsense-account': 'ca-pub-7103613018132711',
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '123Moviesflix',
  },
  openGraph: {
    title: '123Moviesflix - Watch Free Movies & TV Shows',
    description: 'Watch the latest movies and TV shows online for free',
    url: 'https://123moviesflix.info',
    siteName: '123Moviesflix',
    images: [
      {
        url: '/favicon.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '123Moviesflix - Watch Free Movies & TV Shows',
    description: 'Watch the latest movies and TV shows online for free',
    images: ['/twitter-image.jpg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1a1a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Client layout handles all client-side logic and layout */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

// Import ClientLayout as a dynamic client component
import ClientLayout from './ClientLayout';
