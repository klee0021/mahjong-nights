import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mahjong Nights",
  description: "Mahjong leaderboard and game tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100">
        <nav className="border-b bg-white shadow-sm">
          <div className="mx-auto flex max-w-6xl gap-6 p-4">
            <Link href="/" className="font-bold">
              🀄 Mahjong Nights
            </Link>

            <Link href="/players">
              Players
            </Link>

            <Link href="/sessions">
              Sessions
            </Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
