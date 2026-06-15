import { supabase } from "@/src/lib/supabase";
import { addPlayer } from "./actions/addPlayer";
import { deletePlayer } from "./actions/deletePlayer";

export default async function PlayersPage() {
  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("name");

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-4xl font-bold">
        Players
      </h1>

      <form
        action={addPlayer}
        className="mb-6 flex gap-2"
      >
        <input
          name="name"
          placeholder="Player name"
          className="rounded border px-3 py-2"
        />

        <button
          type="submit"
          className="rounded border px-4 py-2"
        >
          Add Player
        </button>
      </form>

      <div className="space-y-3">
        {players?.map((player) => (
          <div
  key={player.id}
  className="flex items-center justify-between rounded-lg border bg-white p-4 shadow"
>
  <span>
    {player.name}
  </span>

  {player.wins === 0 &&
player.total_score === 0 && (
  <form
    action={deletePlayer.bind(
      null,
      player.id
    )}
  >
   <button
  type="submit"
  className="text-sm text-gray-500 hover:text-black"
>
  ✕
</button>
  </form>
)}
</div>
        ))}
      </div>
    </main>
  );
}