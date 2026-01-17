import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";

export const metadata = {
  title: "SEEDBASE | Vegetable Seed Supplier Directory",
  description: "SEEDBASE is a B2B directory for vegetable seed suppliers and varieties.",
  openGraph: {
    title: "SEEDBASE | Vegetable Seed Supplier Directory",
    description: "Discover seed suppliers and varieties, then send direct inquiries.",
    type: "website"
  },
  metadataBase: new URL("https://seedbase.example.com")
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Link className="text-xl font-bold tracking-tight text-emerald-700" href="/">
                SEEDBASE
              </Link>
              <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:inline">
                Supplier Directory
              </span>
            </div>
            <form action="/search" className="flex w-full items-center gap-2 lg:max-w-md">
              <input
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                name="q"
                placeholder="Search suppliers or varieties..."
              />
              <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                Search
              </button>
            </form>
            <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <Link href="/suppliers">Suppliers</Link>
              <Link href="/varieties">Varieties</Link>
              <Link href="/how-it-works">How it works</Link>
              <Link href="/about">About</Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="font-semibold text-emerald-700">
                    Dashboard
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link href="/admin" className="font-semibold text-emerald-700">
                      Admin
                    </Link>
                  )}
                  <form action="/api/auth/logout" method="post">
                    <button
                      className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700"
                      type="submit"
                    >
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login">Login</Link>
                  <Link
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                    href="/register"
                  >
                    List your varieties
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} SEEDBASE. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">Contact</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/imprint">Imprint</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
