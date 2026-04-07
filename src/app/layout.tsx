import type {Metadata} from 'next';
import './globals.css';
import {ThemeProvider} from '@/components/theme-provider';
import {Navbar} from '@/components/navbar';
import {Footer} from '@/components/footer';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'ProFolio Studio | Baraka Junior',
  description: 'Professional Portfolio of Baraka Junior - Software Engineer and Systems Analyst',
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}