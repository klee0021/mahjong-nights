import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { addSession } from "./actions/addSession";

export default async function SessionsPage() {
  const { data: openSessions } =
  await supabase
    .from("sessions")
    .select("*")
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });

const { data: closedSessions } =
  await supabase
    .from("sessions")
    .select("*")
    .eq("is_active", false)
    .order("created_at", {
      ascending: false,
    });

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-4xl font-bold">
        Sessions
      </h1>

      <form
        action={addSession}
        className="mb-6 flex gap-2"
      >
        <input
          name="name"
          placeholder="Session name"
          className="rounded border px-3 py-2"
        />

        <button
          type="submit"
          className="rounded border px-4 py-2"
        >
          Create Session
        </button>
      </form>

      <div className="mb-8">
  <h2 className="mb-4 text-2xl font-semibold">
    Open Sessions
  </h2>

  <div className="space-y-3">
    {openSessions?.length ? (
      openSessions.map((session) => (
        <Link
          key={session.id}
          href={`/sessions/${session.id}`}
          className="block rounded-lg border bg-white p-4 shadow hover:bg-slate-50"
        >
          <p className="font-medium">
            {session.name}
          </p>

          <p className="text-sm text-gray-500">
            {new Date(
  session.created_at
).toLocaleDateString("en-GB")}
          </p>
        </Link>
      ))
    ) : (
      <p>No open sessions.</p>
    )}
  </div>
</div>

<div>
  <h2 className="mb-4 text-2xl font-semibold">
    Closed Sessions
  </h2>

  <div className="space-y-3">
    {closedSessions?.length ? (
      closedSessions.map((session) => (
        <Link
          key={session.id}
          href={`/sessions/${session.id}`}
          className="block rounded-lg border bg-white p-4 shadow hover:bg-slate-50"
        >
          <p className="font-medium">
            {session.name}
          </p>

          <p className="text-sm text-gray-500">
            {new Date(
              session.created_at
            ).toLocaleDateString("en-GB")}
          </p>
        </Link>
      ))
    ) : (
      <p>No closed sessions.</p>
    )}
  </div>
</div>
    </main>
  );
}