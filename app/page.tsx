import Link from "next/link";
import { supabase } from "@/src/lib/supabase";

export default async function Home() {
const { data: activeSessions } =
  await supabase
    .from("sessions")
    .select("*")
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });
const { data: players } =
  await supabase
    .from("players")
    .select("*")
    .order("total_score", {
      ascending: false,
    });
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-4xl font-bold">
          🀄 Mahjong Nights
        </h1>

        <p className="mb-8 text-gray-600">
          Session leaderboard and game tracker
        </p>

        <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow">
  <h2 className="mb-4 text-2xl font-semibold">
    Open Sessions
  </h2>

  {activeSessions?.length ? (
    <div className="space-y-3">
      {activeSessions.map(
        (session: any) => (
          <div
            key={session.id}
            className="border-b pb-3 last:border-b-0"
          >
            <Link
              href={`/sessions/${session.id}`}
              className="text-lg font-medium underline"
            >
              {session.name}
            </Link>

            <p className="text-sm text-gray-500">
              {new Date(
  session.created_at
).toLocaleDateString("en-GB")}
            </p>
          </div>
        )
      )}
    </div>
  ) : (
    <p>No active sessions.</p>
  )}

  <Link
    href="/sessions"
    className="mt-4 inline-block rounded border px-4 py-2"
  >
    Create Session
  </Link>
</div>

          <div className="rounded-xl bg-white p-6 shadow">
  <h2 className="mb-4 text-2xl font-semibold">
    All-Time Leaderboard
  </h2>

  {players?.length ? (
    <div className="space-y-2">
      {players.map(
        (player: any) => (
          <div
  key={player.id}
  className="border-b py-2 last:border-b-0"
>
  <div className="grid grid-cols-3">
  <span>
    {player.name}
  </span>

  <span className="text-center">
    {player.wins}W
  </span>

  <span className="text-right">
    {player.total_score > 0
      ? `+${player.total_score}`
      : player.total_score}
  </span>
</div>
</div>
        )
      )}
    </div>
  ) : (
    <p>No players yet.</p>
  )}
</div>
        </div>
      </div>
    </main>
  );
}
