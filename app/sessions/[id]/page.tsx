import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { addParticipant } from "./actions/addParticipant";
import { removeParticipant } from "./actions/removeParticipant";
import { endSession } from "./actions/endSession";
import { renameSession } from "./actions/renameSession";
import EndSessionButton from "./EndSessionButton";
import InlineRenameSession from "./InlineRenameSession";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SessionPage({
  params,
}: Props) {
  const { id } = await params;

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

  const { data: games } = await supabase
  .from("games")
  .select("*")
  .eq("session_id", id);
const leaderboard: Record<
  string,
  number
> = {};

participants?.forEach(
  (participant: any) => {
    leaderboard[
      participant.players.name
    ] = 0;
  }
);

games?.forEach((game: any) => {
  const settlement =
    game.hand_data?.settlement ?? [];

  settlement.forEach(
    (entry: any) => {
      leaderboard[
        entry.player
      ] =
        (leaderboard[
          entry.player
        ] ?? 0) +
        entry.points;
    }
  );
});

const leaderboardRows =
  Object.entries(leaderboard)
    .map(
      ([player, points]) => ({
        player,
        points,
      })
    )
    .sort(
      (a, b) =>
        b.points - a.points
    );
const addParticipantWithSession =
    addParticipant.bind(null, id);

function hasPlayedGame(
  playerName: string
) {
  return games?.some(
    (game: any) =>
      game.hand_data?.settlement?.some(
        (entry: any) =>
          entry.player === playerName
      )
  );
}

  return (
    <main className="min-h-screen p-8">
      <div className="mb-6">
  {session?.is_active ? (
    <InlineRenameSession
      sessionName={session.name}
      action={renameSession.bind(
        null,
        id
      )}
    />
  ) : (
    <h1 className="text-4xl font-bold">
      {session?.name}
    </h1>
  )}
</div>

      <div className="mb-6 rounded-lg border bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-semibold">
          Dashboard
        </h2>

 <div className="space-y-2">
          <p>
            Participants: {participants?.length ?? 0}
          </p>

          <p>
  Games Played: {games?.length ?? 0}
</p>
        </div>

        <div className="mt-4 flex gap-2">
  {session?.is_active && (
  <Link
    href={`/sessions/${id}/record-game`}
    className="rounded border px-4 py-2"
  >
    Record Game
  </Link>
)}

  <Link
  href={`/sessions/${id}/history`}
  className="rounded border px-4 py-2"
>
  Hand History
</Link>

</div>
      </div>

      <div className="mb-6 rounded-lg border bg-white p-6 shadow">
  <h2 className="mb-4 text-2xl font-semibold">
    Leaderboard
  </h2>

  {leaderboardRows.length ? (
    <div className="divide-y">
  {leaderboardRows.map(
    (row) => (
      <div
        key={row.player}
        className="flex justify-between py-2"
      >
        <span>
          {row.player}
        </span>

        <span className="font-semibold">
          {row.points > 0
            ? `+${row.points}`
            : row.points}
        </span>
      </div>
    )
  )}
</div>
  ) : (
    <p className="text-gray-600">
      No games recorded yet.
    </p>
  )}
</div>

      <div className="rounded-lg border bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-semibold">
          Participants ({participants?.length ?? 0})
        </h2>

        {session?.is_active && (
  <form
    action={addParticipantWithSession}
    className="mb-6 flex gap-2"
  >
          <select
            name="playerId"
            className="rounded border px-3 py-2"
          >
            <option value="">
              Select Player
            </option>

            {players?.map((player) => (
              <option
                key={player.id}
                value={player.id}
              >
                {player.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded border px-4 py-2"
          >
            Add Player
          </button>
        </form>
)}

        <div className="divide-y">
          {participants?.length ? (
            participants.map((participant: any) => {
              const removeWithSession =
                removeParticipant.bind(
                  null,
                  id,
                  participant.player_id
                );

              return (
                <div
                  key={participant.player_id}
                  className="flex items-center justify-between py-2"
                >
                  <span>
                    {participant.players?.name}
                  </span>

                  {session?.is_active &&
 !hasPlayedGame(
   participant.players?.name
 ) && (
  <form action={removeWithSession}>
    <button
      type="submit"
      className="text-sm text-gray-500 hover:text-black"
    >
      ✕
    </button>
  </form>
)}
                </div>
              );
            })
          ) : (
            <p>No participants yet.</p>
          )}
        </div>
            </div>

     {session?.is_active && (
  <div className="mt-6 flex justify-center">
    <form
      action={endSession.bind(
        null,
        id
      )}
    >
      <EndSessionButton />
    </form>
  </div>
)}
    </main>
  );
}