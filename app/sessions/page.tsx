import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { addSession } from "./actions/addSession";

export default async function SessionsPage() {
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .order("created_at", { ascending: false });

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

      <div className="space-y-3">
        {sessions?.map((session) => (
          <Link
            key={session.id}
            href={`/sessions/${session.id}`}
            className="block rounded-lg border bg-white p-4 shadow hover:bg-slate-50"
          >
            {session.name} →
          </Link>
        ))}
      </div>
    </main>
  );
}