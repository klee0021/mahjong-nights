import { supabase } from "@/src/lib/supabase";
import { AppShell } from "@/src/components/ui/AppShell";
import { SectionLabel } from "@/src/components/ui/primitives";
import { TapButton } from "@/src/components/ui/TapButton";
import SessionRow from "@/src/components/SessionRow";
import { addSession } from "./actions/addSession";
import type { SessionSummary } from "@/src/lib/types";

export const dynamic = "force-dynamic";

export function SessionsView({ open, closed }: { open: SessionSummary[]; closed: SessionSummary[] }) {
  return (
    <AppShell active="sessions">
      <h1 className="mb-4 font-display text-2xl font-bold uppercase text-mj-green">Sessions</h1>
      <form action={addSession} className="mb-6 flex gap-2.5">
        <input name="name" placeholder="Session name" className="flex-1 rounded-2xl border border-mj-line bg-mj-card px-3.5 py-3 text-sm outline-none focus:border-mj-green" />
        <TapButton type="submit" className="px-4 py-3">
  Create
</TapButton>
      </form>

      <div className="mb-3"><SectionLabel>Open Sessions</SectionLabel></div>
      <div className="mb-6 flex flex-col gap-2.5">
        {open.length ? open.map((s) => <SessionRow key={s.id} s={s} />) : <p className="text-sm text-mj-muted">No open sessions.</p>}
      </div>

      <div className="mb-3"><SectionLabel>Closed Sessions</SectionLabel></div>
      <div className="flex flex-col gap-2.5">
        {closed.length ? closed.map((s) => <SessionRow key={s.id} s={s} />) : <p className="text-sm text-mj-muted">No closed sessions.</p>}
      </div>
    </AppShell>
  );
}

export default async function SessionsPage() {
  const { data: open } = await supabase
    .from("sessions")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const { data: closed } = await supabase
    .from("sessions")
    .select("*")
    .eq("is_active", false)
    .order("created_at", { ascending: false });

  async function enrichSessions(
    sessions: any[]
  ) {
    return Promise.all(
      sessions.map(async (session) => {
        const { count: playerCount } =
          await supabase
            .from("session_players")
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq(
              "session_id",
              session.id
            );

        const { count: handCount } =
          await supabase
            .from("games")
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq(
              "session_id",
              session.id
            );

        return {
          ...session,
          player_count:
            playerCount ?? 0,
          hand_count:
            handCount ?? 0,
        };
      })
    );
  }

  const enrichedOpen =
    await enrichSessions(
      open ?? []
    );

  const enrichedClosed =
    await enrichSessions(
      closed ?? []
    );

  return (
    <SessionsView
      open={
        enrichedOpen as SessionSummary[]
      }
      closed={
        enrichedClosed as SessionSummary[]
      }
    />
  );
}
