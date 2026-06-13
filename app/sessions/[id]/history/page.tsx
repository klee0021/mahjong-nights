import Link from "next/link";
import { supabase } from "@/src/lib/supabase";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function HistoryPage({
  params,
}: Props) {
  const { id } = await params;

  const { data: games } = await supabase
  .from("games")
  .select(`
    *,
    players:winner_id (
      name
    )
  `)
  .eq("session_id", id)
  .order("created_at", {
    ascending: false,
  });

  return (
    <main className="min-h-screen p-8">
      <div className="mb-6 flex items-center gap-2">
        <Link
          href={`/sessions/${id}`}
          className="rounded border px-4 py-2"
        >
          Back to Session
        </Link>
      </div>

      <h1 className="mb-6 text-4xl font-bold">
        Hand History
      </h1>

      {games?.length ? (
        <div className="divide-y rounded border bg-white">
          {games.map(
  (
    game: any,
    index: number
  ) => (
    <div
  key={game.id}
  className="p-4"
>
  <h2 className="mb-4 text-lg font-semibold">
    Hand #{games.length - index}
  </h2>

  <div className="flex justify-between">
  <strong>
    Winner
  </strong>

  <span>
    {game.players?.name ??
      game.winner_id}
  </span>
</div>

<div className="mt-2 flex justify-between">
  <strong>
    Score
  </strong>

  <span>
    {game.score}
  </span>
</div>
<div className="mt-2 flex justify-between">
  <strong>
    Win Type
  </strong>

  <span>
    {game.hand_data?.winType ===
    "self-draw"
      ? "Self-Draw"
      : `Claimed from ${game.hand_data?.discarder}`}
  </span>
</div>

<div className="mt-4 text-3xl leading-relaxed">
  {[
    game.hand_data?.meld1Tiles?.join(
      " "
    ),
    game.hand_data?.meld2Tiles?.join(
      " "
    ),
    game.hand_data?.meld3Tiles?.join(
      " "
    ),
    game.hand_data?.meld4Tiles?.join(
      " "
    ),
    game.hand_data?.pairTiles?.join(
      " "
    ),
  ].join("   ")}
</div>

              {game.hand_data?.settlement
  ?.length > 0 && (
  <div className="mt-4">
    <div className="mb-2 font-semibold">
      Settlement
    </div>

    <div className="divide-y">
      {game.hand_data.settlement.map(
        (entry: any) => (
          <div
            key={entry.player}
            className="flex justify-between py-1"
          >
            <span>
              {entry.player}
            </span>

            <span>
              {entry.points > 0
                ? `+${entry.points}`
                : entry.points}
            </span>
          </div>
        )
      )}
    </div>
  </div>
)}
            </div>
          ))}
        </div>
      ) : (
        <p>
          No games recorded yet.
        </p>
      )}
    </main>
  );
}