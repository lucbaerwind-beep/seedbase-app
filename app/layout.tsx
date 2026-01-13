import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";

export const metadata = {
  title: "SEEDBASE",
  description: "B2B seed marketplace for vegetable seed companies."
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="header-inner">
            <Link className="brand" href="/">
              SEEDBASE
            </Link>
            <nav className="nav-links">
              <Link href="/">Directory</Link>
              {user ? (
                <>
                  <Link href="/dashboard">Dashboard</Link>
                  <form action="/api/auth/logout" method="post">
                    <button className="button secondary" type="submit">
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login">Log in</Link>
                  <Link href="/register">
                    <span className="button">Get started</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
