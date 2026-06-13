export default function Home() {
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
              Current Session
            </h2>

            <p>No active session yet.</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-semibold">
              All-Time Leaderboard
            </h2>

            <p>No players yet.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
