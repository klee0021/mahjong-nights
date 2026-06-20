import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { AppShell } from "@/src/components/ui/AppShell";
import { Card, PanelHeader } from "@/src/components/ui/primitives";
import { TapButton } from "@/src/components/ui/TapButton";
import { Leaderboard } from "@/src/components/ui/Leaderboard";
import { MahjongTile } from "@/src/components/mj/MahjongTile";
import { endSession } from "./actions/endSession";
import { addParticipant } from "./actions/addParticipant";
import { removeParticipant } from "./actions/removeParticipant";
import { renameSession } from "./actions/renameSession";
import { deleteSession } from "./actions/deleteSession";
import DeleteSessionButton from "@/src/components/DeleteSessionButton";
import InlineRenameSession from "./InlineRenameSession";
import type { Standing } from "@/src/lib/types";

export const dynamic = "force-dynamic";

export function SessionDashboardView({
  id,
  name,
  isActive,
  participantCount,
participantList,
players,
playersWhoPlayed,
addParticipantAction,
hands,
standings
}: {
  id: string;
  name: string;
  isActive: boolean;
  participantCount: number;
  participantList: any[];
players: any[];
playersWhoPlayed: Set<string>;
addParticipantAction: any;
hands: number;
standings: Standing[];
}) {
  return (
    <AppShell>
      <Link href="/sessions" className="mb-3 inline-flex items-center gap-1 text-[13px] font-bold text-mj-muted">‹ Sessions</Link>
      <div className="mb-4">
  <InlineRenameSession
    sessionName={name}
    action={renameSession.bind(null, id)}
  />
</div>

      <Card className="mb-4">
        <PanelHeader>Session Overview</PanelHeader>
        <div className="flex divide-x divide-mj-line/70">
          <div className="flex-1 p-4 text-center"><div className="font-display text-3xl font-bold leading-none">{participantCount}</div><div className="mt-1 text-xs font-semibold text-mj-muted">Participants</div></div>
          <div className="flex-1 p-4 text-center"><div className="font-display text-3xl font-bold leading-none">{hands}</div><div className="mt-1 text-xs font-semibold text-mj-muted">Hands Played</div></div>
        </div>
      </Card>

      {isActive && (
        <Link href={`/sessions/${id}/record-game`}>
  <TapButton variant="danger" className="mb-4 w-full">
    <MahjongTile char="🀄" size="sm" /> Record a Hand
  </TapButton>
</Link>
      )}

      <Card className="mb-4">
        <PanelHeader>Leaderboard</PanelHeader>
        <Leaderboard rows={standings} />
      </Card>

<Card className="mb-4">
  <PanelHeader>Participants</PanelHeader>

  {isActive && (
    <div className="border-b border-mj-line p-4">
      <form
  action={addParticipantAction}
  className="flex gap-2"
>
        <select
  name="playerId"
  className="flex-1 rounded-2xl border border-mj-line bg-mj-card px-3 py-3 text-sm"
>
          <option>Select Player</option>

          {players
  ?.filter(
    (player: any) =>
      !participantList.some(
        (participant: any) =>
          participant.player_id === player.id
      )
  )
  .map((player: any) => (
    <option
      key={player.id}
      value={player.id}
    >
      {player.name}
    </option>
  ))}
        </select>

        <TapButton type="submit">
  Add
</TapButton>
      </form>
    </div>
  )}

  <div className="divide-y divide-mj-line/70">
    {participantList.length ? (
     participantList.map((participant: any) => (
  <div
    key={participant.player_id}
    className="flex items-center justify-between px-4 py-3"
  >
    <span className="font-semibold">
      {participant.players?.name}
    </span>

    {isActive &&
 !playersWhoPlayed.has(
   participant.players?.name
 ) && (
  <form
    action={removeParticipant.bind(
      null,
      id,
      participant.player_id
    )}
  >
    <button
      type="submit"
      className="text-sm text-mj-muted hover:text-mj-neg"
    >
      ✕
    </button>
  </form>
)}
  </div>
))
    ) : (
      <div className="px-4 py-4 text-sm text-mj-muted">
        No participants.
      </div>
    )}
  </div>
</Card>

      <div className="flex flex-col gap-3">
        <Link href={`/sessions/${id}/history`}>
  <TapButton variant="secondary" className="w-full">
    📜 Hand History
  </TapButton>
</Link>
        {isActive ? (
  <form action={endSession.bind(null, id)}>
    <TapButton
  variant="secondary"
  type="submit"
  className="w-full border-[#eccaa0] bg-[#f8efdb] text-[#8a6a2e]"
>
  End Session
</TapButton>
  </form>
) : (
  <form action={deleteSession.bind(null, id)}>
    <DeleteSessionButton />
  </form>
)}
      </div>
    </AppShell>
  );
}

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
const addParticipantWithSession =
  addParticipant.bind(null, id);
  const { data: session } = await supabase.from("sessions").select("*").eq("id", id).single();
const { data: players } = await supabase
  .from("players")
  .select("*")
  .order("name");
  const { data: participants } = await supabase
  .from("session_players")
  .select(`
    player_id,
    players (
      id,
      name
    )
  `)
  .eq("session_id", id);
  const { data: games } = await supabase.from("games").select("hand_data").eq("session_id", id);

  const totals: Record<string, number> = {};
  (participants ?? []).forEach((p: any) => { totals[p.players.name] = 0; });
  (games ?? []).forEach((g: any) => (g.hand_data?.settlement ?? []).forEach((e: any) => { totals[e.player] = (totals[e.player] ?? 0) + e.points; }));
  const standings: Standing[] = Object.entries(totals).map(([name, points]) => ({ name, points })).sort((a, b) => b.points - a.points);
const playersWhoPlayed = new Set<string>();

(games ?? []).forEach((g: any) => {
  (g.hand_data?.settlement ?? []).forEach((e: any) => {
    playersWhoPlayed.add(e.player);
  });
});

  return (
  <SessionDashboardView
    id={id}
    name={session?.name ?? ""}
    isActive={!!session?.is_active}
    participantCount={participants?.length ?? 0}
    participantList={participants ?? []}
players={players ?? []}
playersWhoPlayed={playersWhoPlayed}
addParticipantAction={addParticipantWithSession}
hands={games?.length ?? 0}
    standings={standings}
  />
);
}
