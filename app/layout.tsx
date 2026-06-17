import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mahjong Nights",
  description: "Mahjong leaderboard and game tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
