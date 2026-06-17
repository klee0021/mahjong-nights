import Link from "next/link";
import { MahjongTile } from "../mj/MahjongTile";

const NAV = [
  { href: "/", label: "Home", key: "home" },
  { href: "/players", label: "Players", key: "players" },
  { href: "/sessions", label: "Sessions", key: "sessions" },
] as const;

export function AppShell({ active, children }: { active?: "home" | "players" | "sessions"; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mj-paper">
      <header className="sticky top-0 z-10 border-b border-mj-line bg-mj-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <MahjongTile char="🀄" size="sm" />
            <span className="font-display text-[17px] font-bold uppercase leading-[0.95] text-mj-green">Mahjong<br />Nights</span>
          </Link>
          <nav className="flex gap-1.5">
            {NAV.map((n) => (
              <Link key={n.key} href={n.href}
                className={`rounded-xl px-3 py-2 text-[13px] font-bold ${active === n.key ? "bg-mj-greensoft text-mj-green" : "text-mj-muted hover:text-mj-ink"}`}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-5">{children}</main>
    </div>
  );
}
