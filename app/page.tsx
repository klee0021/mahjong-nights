import { supabase } from "@/src/lib/supabase";
import { AppShell } from "@/src/components/ui/AppShell";
import { Card, PanelHeader, SectionLabel, Sparkle } from "@/src/components/ui/primitives";
import { Leaderboard } from "@/src/components/ui/Leaderboard";
import { MahjongTile } from "@/src/components/mj/MahjongTile";
import type { Player, SessionSummary, Standing } from "@/src/lib/types";
import HomeSessionCard from "@/src/components/HomeSessionCard";
import HomeCreateSessionButton from "@/src/components/HomeCreateSessionButton";

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
          {openSessions.length ? (
  openSessions.map((s) => (
    <HomeSessionCard
      key={s.id}
      session={s}
    />
  ))
) : (
  <p className="text-sm text-mj-muted">
    No open sessions.
  </p>
)}
        </div>
        <HomeCreateSessionButton />
      </Card>

      <Card>
  <PanelHeader>All-Time Leaderboard</PanelHeader>

  <Leaderboard rows={leaderboard} />
</Card>
    </AppShell>
  );
}

/* ---- Route (server): fetch + pass props ---- */
export default async function HomePage() {
  const [
  { data: sessions },
  { data: players },
] = await Promise.all([
  supabase
    .from("sessions")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false }),

  supabase
    .from("players")
    .select("*")
    .order("total_score", { ascending: false }),
]);

  const enrichedSessions = await Promise.all(
    (sessions ?? []).map(async (session) => {
      const { count: playerCount } = await supabase
        .from("session_players")
        .select("*", { count: "exact", head: true })
        .eq("session_id", session.id);

      const { count: handCount } = await supabase
        .from("games")
        .select("*", { count: "exact", head: true })
        .eq("session_id", session.id);

      return {
        ...session,
        player_count: playerCount ?? 0,
        hand_count: handCount ?? 0,
      };
    })
  );

  const leaderboard: Standing[] =
    (players ?? []).map((p: Player) => ({
      name: p.name,
      points: p.total_score,
      wins: p.wins,
    }));

  return (
    <HomeView
      openSessions={enrichedSessions as SessionSummary[]}
      leaderboard={leaderboard}
    />
  );
}