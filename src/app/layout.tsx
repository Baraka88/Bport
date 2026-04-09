import type {Metadata} from 'next';
import './globals.css';
import {ThemeProvider} from '@/components/theme-provider';
import {Navbar} from '@/components/navbar';
import {Footer} from '@/components/footer';
import {Toaster} from '@/components/ui/toaster';
import {FirebaseClientProvider} from '@/firebase/client-provider';

export const metadata: Metadata = {
  metadataBase: new URL('https://studio-5852085552-383c3.web.app'),
  title: 'BRJDEV | Baraka Ruzibiza Junior',
  description: 'Professional Portfolio of Baraka Ruzibiza Junior - Full Stack Developer',
  openGraph: {
    title: 'BRJDEV | Baraka Ruzibiza Junior',
    description: 'Professional Portfolio of Baraka Ruzibiza Junior - Full Stack Developer',
    url: 'https://studio-5852085552-383c3.web.app',
    siteName: 'BRJDEV',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BRJDEV | Baraka Ruzibiza Junior',
    description: 'Professional Portfolio of Baraka Ruzibiza Junior - Full Stack Developer',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
