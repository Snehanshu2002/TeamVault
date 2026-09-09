import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Private Team Chat Management System - SaaS Demo',
  description: 'Production-quality demo SaaS private team communication platform with multi-admin governance, role isolation, and real-time 1-on-1 private messaging.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
