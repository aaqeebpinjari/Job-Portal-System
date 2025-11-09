import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Job Import Admin Dashboard",
  description: "Monitor job imports, queues, and system logs",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <header className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-50">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
              Job Import Admin
            </h1>
            <nav className="space-x-6 text-sm font-medium">
              <Link
                href="/"
                className="text-slate-700 relative after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-blue-600 after:transition-all hover:text-blue-600 hover:after:w-full"
              >
                Dashboard
              </Link>
              <Link
                href="/import-history"
                className="text-slate-700 relative after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-blue-600 after:transition-all hover:text-blue-600 hover:after:w-full"
              >
                Import History
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Job Import System — Built with Next.js & TailwindCSS
        </footer>
      </body>
    </html>
  );
}
