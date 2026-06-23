import type { Metadata } from "next";
import "./globals.css";
import ScrollToTop from "@/src/components/ScrollToTop";

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
      <body>
  <ScrollToTop />
  {children}
</body>
    </html>
  );
}
