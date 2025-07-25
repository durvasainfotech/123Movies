"use client";

import { useEffect } from 'react';
import clarity from '@microsoft/clarity';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      clarity.init('sdlozm49no');
    }
  }, []);
  return (
    <>
      <head>
        <link rel="shortcut icon" href="/favicon.png" />
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-DJMBSS7RLB" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DJMBSS7RLB');
          `}
        </Script>
        {/* Adsterra Popunder Ad */}
        {/**
        <Script
          id="adsterra-popunder"
          strategy="afterInteractive"
          src="//pl27153488.profitableratecpm.com/54/13/7c/54137ccb85ba388cabc899bdc1fa30e6.js"
        />
        */}
      </head>
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <Navbar />
        <div style={{ paddingTop: '140px' }}>
          {children}
        </div>
        {/**
        <BannerAd id="banner-ad-728x90" />
        */}
        <Footer />
      </body>
    </>
  );
} 