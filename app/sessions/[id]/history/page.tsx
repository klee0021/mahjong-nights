import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { AppShell } from "@/src/components/ui/AppShell";
import { Card, Sparkle } from "@/src/components/ui/primitives";
import { MahjongTile, TileRow } from "@/src/components/mj/MahjongTile";
import { deleteGame } from "../actions/deleteGame";
import type { GameRecord } from "@/src/lib/types";

export const dynamic = "force-dynamic";

const Field = ({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) => (
  <div><div className="text-[11px] text-mj-muted">{label}</div><div className={`text-sm font-extrabold ${valueClass}`}>{value}</div></div>
);

function HandCard({ sessionId, g }: { sessionId: string; g: GameRecord }) {
  return (
    <Card>
      <div className="relative flex items-center justify-between bg-mj-green px-3.5 py-2.5">
        <span className="fret fret-tl" />
        <span className="ml-3 font-display text-sm font-bold tracking-wide text-[#f4efe2]">
  HAND #{g.index}
</span>
        <div className="flex gap-1.5">
          <Link href={`/sessions/${sessionId}/edit-game/${g.id}`} className="rounded-lg bg-[#f4efe2] px-2.5 py-2 text-[11px] font-extrabold text-mj-green">Edit</Link>
          <form action={deleteGame.bind(null, sessionId, g.id)}>
            <button type="submit" className="rounded-lg bg-mj-neg px-2.5 py-2 text-[11px] font-extrabold text-white">Delete</button>
          </form>
        </div>
      </div>
      <div className="p-3.5">
        <div className="mb-5 flex gap-8">
          <Field label="Winner" value={g.winner} />
          <Field label="Winning Tile" value={g.win_type === "self-draw" ? "Self Draw" : `From ${g.discarder}`} />
          <Field label="Points" value={`+${g.score}`} valueClass="text-mj-neg" />
        </div>
        <TileRow
  tiles={g.tiles}
  size="sm"
  gap={7}
/>
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-mj-line/70 pt-2.5">
          {g.settlement.map((e) => (
            <span key={e.player} className={`rounded-lg px-2.5 py-1 text-xs font-bold ${e.points > 0 ? "bg-[#e9f1ec] text-mj-pos" : e.points < 0 ? "bg-[#fbebe9] text-mj-neg" : "bg-[#efece1] text-mj-muted"}`}>
              {e.player} {e.points > 0 ? `+${e.points}` : e.points < 0 ? `−${Math.abs(e.points)}` : "0"}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function HandHistoryView({ sessionId, name, games }: { sessionId: string; name: string; games: GameRecord[] }) {
  return (
    <AppShell>
      <Link href={`/sessions/${sessionId}`} className="mb-3 inline-flex items-center gap-1 text-[13px] font-bold text-mj-muted">‹ {name}</Link>
      <div className="relative mb-4 text-center">
        <Sparkle className="absolute left-10 top-1.5" size={12} /><Sparkle className="absolute right-10 top-1.5" size={12} />
        <h1 className="inline-flex items-center gap-2 font-display text-2xl font-bold uppercase text-mj-green"><MahjongTile char="🀄" size="sm" /> Hand History</h1>
        <div className="mt-0.5 text-xs font-bold text-mj-muted">{games.length} hands recorded</div>
      </div>
      <div className="flex flex-col gap-3">
        {games.length ? games.map((g) => <HandCard key={g.id} sessionId={sessionId} g={g} />) : <p className="text-sm text-mj-muted">No games recorded yet.</p>}
      </div>
    </AppShell>
  );
}

export default async function HistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: session } = await supabase.from("sessions").select("name").eq("id", id).single();
  const { data: games } = await supabase.from("games").select("*, players:winner_id ( name )").eq("session_id", id).order("created_at", { ascending: false });
  const total = games?.length ?? 0;
  const records: GameRecord[] = (games ?? []).map((g: any, idx: number) => ({
    id: g.id, index: total - idx, winner: g.players?.name ?? g.winner_id,
    win_type: g.hand_data?.winType === "self-draw" ? "self-draw" : "claimed",
    discarder: g.hand_data?.discarder, score: g.score,
    tiles: [...(g.hand_data?.meld1Tiles ?? []), ...(g.hand_data?.meld2Tiles ?? []), ...(g.hand_data?.meld3Tiles ?? []), ...(g.hand_data?.meld4Tiles ?? []), ...(g.hand_data?.pairTiles ?? [])],
    settlement: g.hand_data?.settlement ?? [],
  }));
  return <HandHistoryView sessionId={id} name={session?.name ?? "Session"} games={records} />;
}