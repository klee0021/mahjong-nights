export const revalidate = 30;

import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { AppShell } from "@/src/components/ui/AppShell";
import {
  Card,
  PanelHeader,
  Button,
} from "@/src/components/ui/primitives";
import { MahjongTile } from "@/src/components/mj/MahjongTile";
import { deletePlayer } from "../actions/deletePlayer";
import { updatePlayer } from "../actions/updatePlayer";
import InlineRenamePlayer from "../InlineRenamePlayer";
import type { Player, PlayerStats, SessionSummary } from "@/src/lib/types";

const Stat = ({ label, value, pos }: { label: string; value: string; pos?: boolean }) => (
  <div className="flex-1 p-4 text-center">
    <div className={`font-display text-2xl font-bold leading-none ${pos ? "text-mj-pos" : "text-mj-ink"}`}>{value}</div>
    <div className="mt-1.5 text-[11px] font-semibold text-mj-muted">{label}</div>
  </div>
);

export function PlayerDetailView({
  player,
  stats,
  recent,
  playerId,
}: {
  player: Player;
  stats: PlayerStats;
  recent: SessionSummary[];
  playerId: string;
}) {
  return (
    <AppShell active="players">
      <Link href="/players" className="mb-4 inline-flex items-center gap-1 text-[13px] font-bold text-mj-muted">‹ Players</Link>

      <div className="mb-5 flex items-start gap-3">
        <span className="shrink-0 grid h-14 w-14 place-items-center rounded-full bg-mj-green font-display text-2xl font-bold text-[#f4efe2]">{player.name[0]}</span>
        <div className="min-w-0">
  <InlineRenamePlayer
    playerName={player.name}
    action={updatePlayer.bind(
      null,
      playerId
    )}
  />

  <p className="text-xs font-semibold text-mj-muted">
    {player.wins} wins
  </p>
</div>
      </div>

      <Card className="mb-4">
        <PanelHeader>Statistics</PanelHeader>
        <div className="flex divide-x divide-mj-line/70"><Stat label="Total Score" value={(stats.total_score > 0 ? "+" : "") + stats.total_score} pos={stats.total_score > 0} /><Stat label="Wins" value={String(stats.wins)} /></div>
        <div className="flex divide-x divide-mj-line/70 border-t border-mj-line/70"><Stat label="Win Rate" value={`${stats.win_rate}%`} /><Stat label="Avg Win Hand" value={stats.avg_win_hand} /></div>
      </Card>

      <Card>
        <PanelHeader>Recent Sessions</PanelHeader>
        <ul className="divide-y divide-mj-line/70 px-4">
          {recent.length ? recent.map((s) => (
            <li key={s.id} className="flex items-center gap-2.5 py-3">
              <MahjongTile
  char={(s as any).tile ?? "🀄"}
  size="sm"
/>
              <Link href={`/sessions/${s.id}`} className="flex-1 text-sm font-bold hover:underline">{s.name}</Link>
              <span className="text-xs text-mj-muted">{new Date(s.created_at).toLocaleDateString("en-GB")}</span>
            </li>
          )) : <li className="py-4 text-sm text-mj-muted">No sessions played yet.</li>}
        </ul>
      </Card>
      {player.wins === 0 &&
        player.total_score === 0 && (
          <form
            action={deletePlayer.bind(
              null,
              playerId
            )}
            className="mt-4"
          >
            <Button
              variant="secondary"
              type="submit"
              className="w-full border-[#eccaa0] bg-[#f8efdb] text-[#8a6a2e]"
            >
              Delete Player
            </Button>
          </form>
        )}
    </AppShell>
  );
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [
  { data: player },
  { data: won },
  { data: all },
  { data: sessions },
] = await Promise.all([
  supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single(),

  supabase
    .from("games")
    .select("score")
    .eq("winner_id", id),

  supabase
    .from("games")
    .select("hand_data"),

  supabase
    .from("session_players")
    .select(`
      session_id,
      sessions (
        id,
        name,
        created_at,
        tile
      )
    `)
    .eq("player_id", id),
]);

  const played = (all ?? []).filter((g: any) => g.hand_data?.participants?.includes(player?.name)).length;
  const wins = player?.wins ?? 0;
  const stats: PlayerStats = {
    total_score: player?.total_score ?? 0,
    wins,
    win_rate: played ? ((wins / played) * 100).toFixed(1) : "0.0",
    avg_win_hand: won?.length ? (won.reduce((t, g: any) => t + (g.score ?? 0), 0) / won.length).toFixed(1) : "0.0",
  };
  const recent = (sessions ?? []).slice(-5).reverse().map((s: any) => s.sessions) as SessionSummary[];
  return (
  <PlayerDetailView
    player={player as Player}
    stats={stats}
    recent={recent}
    playerId={id}
  />
);
}