import Link from "next/link";
import { supabase } from "@/src/lib/supabase";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PlayerPage({
  params,
}: Props) {
  const { id } = await params;

  const { data: player } =
    await supabase
      .from("players")
      .select("*")
      .eq("id", id)
      .single();

  const { data: sessionsPlayed } =
    await supabase
      .from("session_players")
      .select(`
        session_id,
        sessions (
          id,
          name
        )
      `)
      .eq("player_id", id);

  const { data: gamesWon } =
    await supabase
      .from("games")
      .select("*")
      .eq("winner_id", id);

  const { data: allGames } =
  await supabase
    .from("games")
    .select("*");

const gamesParticipated =
  allGames?.filter(
    (game: any) =>
      game.hand_data?.participants?.includes(
        player?.name
      )
  ).length ?? 0;

const winRate =
  gamesParticipated > 0
    ? (
        ((player?.wins ?? 0) /
          gamesParticipated) *
        100
      ).toFixed(1)
    : "0.0";

  const averageWinningHandScore =
    gamesWon?.length
      ? (
          gamesWon.reduce(
            (
              total,
              game: any
            ) =>
              total +
              (game.score ?? 0),
            0
          ) / gamesWon.length
        ).toFixed(1)
      : "0.0";

  const recentSessions =
    sessionsPlayed
      ?.slice(-5)
      .reverse() ?? [];

  return (
    <main className="min-h-screen p-8">
      <Link
        href="/players"
        className="rounded border px-4 py-2"
      >
        Back to Players
      </Link>

      <h1 className="mt-6 text-4xl font-bold">
        {player?.name}
      </h1>

      <div className="mt-6 rounded-lg border bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-semibold">
          Statistics
        </h2>

        <div className="space-y-2">
          <p>
            Total Score:{" "}
            {player?.total_score ?? 0}
          </p>

          <p>
            Wins: {player?.wins ?? 0}
          </p>

          <p>
            Win Rate: {winRate}%
          </p>

          <p>
            Average Winning Hand Score:{" "}
            {averageWinningHandScore}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-semibold">
          Recent Sessions
        </h2>

        {recentSessions.length ? (
          <div className="space-y-2">
            {recentSessions.map(
              (session: any) => (
                <div
                  key={
                    session.session_id
                  }
                >
                  {session.sessions
                    ?.name ??
                    "Unknown Session"}
                </div>
              )
            )}
          </div>
        ) : (
          <p>
            No sessions played yet.
          </p>
        )}
      </div>
    </main>
  );
}