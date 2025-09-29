import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})


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
      <body className={cn(
        "h-full font-sans antialiased",
        inter.variable
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
