import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'StudyBuddy AI - Trợ lý học tập',
  description: 'Trợ lý học tập được hỗ trợ bởi AI dành cho học sinh',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn(
        "h-full font-sans antialiased",
        "bg-background text-foreground"
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
