import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Job Import Admin',
  description: 'Monitor automated job feed imports'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <header className="border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <h1 className="text-xl font-semibold">Job Import Admin</h1>
            <nav className="space-x-4 text-sm font-medium">
              <Link href="/import-history" className="text-blue-600 hover:underline">
                Import History
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}

