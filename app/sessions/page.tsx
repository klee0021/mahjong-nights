import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { AppShell } from "@/src/components/ui/AppShell";
import { SectionLabel, Button } from "@/src/components/ui/primitives";
import { MahjongTile } from "@/src/components/mj/MahjongTile";
import { addSession } from "./actions/addSession";
import type { SessionSummary } from "@/src/lib/types";

export const dynamic = "force-dynamic";

function SessionRow({ s }: { s: SessionSummary }) {
  return (
    <Link href={`/sessions/${s.id}`} className="flex items-center gap-3 rounded-2xl border border-mj-line bg-mj-card px-3.5 py-3.5 hover:bg-mj-paper">
      <MahjongTile
  char={(s as any).tile ?? "🀄"}
  size="sm"
/>
      <div className="flex-1">
        <div className="text-[15px] font-extrabold">{s.name}</div>
        <div className="text-xs text-mj-muted">{[new Date(s.created_at).toLocaleDateString("en-GB"), `${s.player_count ?? 0} players`, `${s.hand_count ?? 0} hands`].join(" · ")}</div>
      </div>
      <span className="text-lg text-[#b6ad97]">›</span>
    </Link>
  );
}

export function SessionsView({ open, closed }: { open: SessionSummary[]; closed: SessionSummary[] }) {
  return (
    <AppShell active="sessions">
      <h1 className="mb-4 font-display text-2xl font-bold uppercase text-mj-green">Sessions</h1>
      <form action={addSession} className="mb-6 flex gap-2.5">
        <input name="name" placeholder="Session name" className="flex-1 rounded-2xl border border-mj-line bg-mj-card px-3.5 py-3 text-sm outline-none focus:border-mj-green" />
        <Button type="submit" className="px-4 py-3">Create</Button>
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
  const { data: open } = await supabase.from("sessions").select("*").eq("is_active", true).order("created_at", { ascending: false });
  const { data: closed } = await supabase.from("sessions").select("*").eq("is_active", false).order("created_at", { ascending: false });
  return <SessionsView open={(open ?? []) as SessionSummary[]} closed={(closed ?? []) as SessionSummary[]} />;
}
