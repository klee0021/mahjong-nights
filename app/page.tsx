import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { AppShell } from "@/src/components/ui/AppShell";
import { Card, PanelHeader, SectionLabel, Sparkle } from "@/src/components/ui/primitives";
import { Leaderboard } from "@/src/components/ui/Leaderboard";
import { MahjongTile } from "@/src/components/mj/MahjongTile";
import type { Player, SessionSummary, Standing } from "@/src/lib/types";

export const dynamic = "force-dynamic";

/* ---- Presentational view (props-driven) ---- */
export function HomeView({ openSessions, leaderboard }: { openSessions: SessionSummary[]; leaderboard: Standing[] }) {
  return (
    <AppShell active="home">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative">
          <Sparkle className="absolute -left-2 -top-2" size={12} />
          <MahjongTile char="🀄" size="lg" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold uppercase leading-none text-mj-green">Mahjong<br />Nights</h1>
          <p className="mt-1.5 text-[13px] text-mj-muted">Session leaderboard &amp; game tracker</p>
        </div>
      </div>

      <Card className="mb-4 p-4">
        <div className="mb-3"><SectionLabel>Open Sessions</SectionLabel></div>
        <div className="flex flex-col gap-2.5">
          {openSessions.length ? openSessions.map((s) => (
            <Link key={s.id} href={`/sessions/${s.id}`}
              className="flex items-center gap-3 rounded-2xl border border-mj-line bg-mj-paper px-3.5 py-3 hover:bg-mj-greensoft/40">
              <MahjongTile
  char={(s as any).tile ?? "🀄"}
  size="sm"
/>
              <div className="flex-1">
                <div className="text-[15px] font-extrabold">{s.name}</div>
                <div className="text-xs text-mj-muted">{[fmtDate(s.created_at), `${s.player_count ?? 0} players`, `${s.hand_count ?? 0} hands`].join(" · ")}</div>
              </div>
              <span className="text-xl font-bold text-mj-green">→</span>
            </Link>
          )) : <p className="text-sm text-mj-muted">No open sessions.</p>}
        </div>
        <Link href="/sessions"
          className="mt-3 block rounded-2xl border-[1.5px] border-dashed border-[#c4bca6] py-3 text-center text-[13px] font-extrabold tracking-wide text-mj-green">
          + CREATE SESSION
        </Link>
      </Card>

      <Card>
        <PanelHeader>All-Time Leaderboard</PanelHeader>
        <Leaderboard rows={leaderboard} />
      </Card>
    </AppShell>
  );
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB");

/* ---- Route (server): fetch + pass props ---- */
export default async function HomePage() {
  const { data: sessions } = await supabase.from("sessions").select("*").eq("is_active", true).order("created_at", { ascending: false });
  const { data: players } = await supabase.from("players").select("*").order("total_score", { ascending: false });
  const leaderboard: Standing[] = (players ?? []).map((p: Player) => ({ name: p.name, points: p.total_score, wins: p.wins }));
  return <HomeView openSessions={(sessions ?? []) as SessionSummary[]} leaderboard={leaderboard} />;
}
