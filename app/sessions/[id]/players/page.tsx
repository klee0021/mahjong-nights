import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { AppShell } from "@/src/components/ui/AppShell";
import {
  Card,
  PanelHeader,
  SectionLabel,
} from "@/src/components/ui/primitives";
import { TapButton } from "@/src/components/ui/TapButton";
import { addParticipant } from "../actions/addParticipant";
import { removeParticipant } from "../actions/removeParticipant";
import { createAndAddPlayer } from "../actions/createAndAddPlayer";

export default async function PlayersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const addParticipantWithSession =
    addParticipant.bind(null, id);
const createAndAddPlayerWithSession =
  createAndAddPlayer.bind(null, id);

  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single();

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
const sortedParticipants = [...(participants ?? [])].sort(
  (a: any, b: any) =>
    a.players.name.localeCompare(
      b.players.name
    )
);

  const { data: games } = await supabase
    .from("games")
    .select("hand_data")
    .eq("session_id", id);

  const playersWhoPlayed = new Set<string>();

  (games ?? []).forEach((g: any) => {
    (g.hand_data?.settlement ?? []).forEach(
      (e: any) => {
        playersWhoPlayed.add(e.player);
      }
    );
  });

  return (
    <AppShell active="sessions">
      <Link
        href={`/sessions/${id}`}
        className="mb-3 inline-flex items-center gap-1 text-[13px] font-bold text-mj-muted"
      >
        ‹ {session?.name}
      </Link>

      <h1 className="mb-4 font-display text-2xl font-bold uppercase text-mj-green">
        Manage Players
      </h1>

      <Card className="mb-4">
  <PanelHeader>In This Session</PanelHeader>

  {sortedParticipants.length ? (
    <ul className="px-4 py-1">
  {sortedParticipants.map(
    (participant: any, i: number) => (
          <li
            key={participant.player_id}
            className={`flex items-center gap-3 py-3 ${
              i < sortedParticipants.length - 1
                ? "border-b border-mj-line/70"
                : ""
            }`}
          >
            <span className="flex-1 text-[15px] font-extrabold">
              {participant.players?.name}
            </span>

            {session?.is_active &&
  (playersWhoPlayed.has(
    participant.players?.name
  ) ? (
    <span className="rounded-full bg-[#efece1] px-3 py-1 text-xs font-bold text-mj-muted">
      Locked
    </span>
  ) : (
    <form
      action={removeParticipant.bind(
        null,
        id,
        participant.player_id
      )}
    >
      <button
        type="submit"
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-mj-line text-[#a89f8a] hover:text-mj-neg"
      >
        ✕
      </button>
    </form>
  ))}
          </li>
        )
      )}
    </ul>
  ) : (
    <p className="px-4 py-5 text-center text-sm text-mj-muted">
  {session?.is_active
    ? "No players yet — add some below."
    : "No players were added to this session."}
</p>
  )}
</Card>

{session?.is_active && (
  <>
    <div className="mb-2">
      <SectionLabel>Add New Player</SectionLabel>
    </div>

    <form
      action={createAndAddPlayerWithSession}
      className="mb-6 flex gap-2.5"
    >
      <input
        name="name"
        placeholder="Player name"
        className="flex-1 rounded-2xl border border-mj-line bg-mj-card px-3.5 py-3 text-sm outline-none focus:border-mj-green"
      />

      <TapButton
        type="submit"
        className="px-4 py-3"
      >
        Add
      </TapButton>
    </form>
  </>
)}

{session?.is_active && (
  <>
    <div className="mb-2">
      <SectionLabel>Add Existing Player</SectionLabel>
    </div>

    <form
      action={addParticipantWithSession}
      className="mb-6 flex gap-2.5"
    >
      <select
        name="playerId"
        className="flex-1 rounded-2xl border border-mj-line bg-mj-card px-3.5 py-3 text-sm"
      >
        <option value="">
          Select Player
        </option>

        {players
          ?.filter(
            (player: any) =>
              !participants?.some(
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

      <TapButton
        type="submit"
        className="px-4 py-3"
      >
        Add
      </TapButton>
    </form>
  </>
)}

    </AppShell>
  );
}