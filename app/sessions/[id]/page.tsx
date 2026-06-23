import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { AppShell } from "@/src/components/ui/AppShell";
import { Card, PanelHeader } from "@/src/components/ui/primitives";
import { TapButton } from "@/src/components/ui/TapButton";
import { Leaderboard } from "@/src/components/ui/Leaderboard";
import { MahjongTile } from "@/src/components/mj/MahjongTile";
import { endSession } from "./actions/endSession";
import { renameSession } from "./actions/renameSession";
import { deleteSession } from "./actions/deleteSession";
import DeleteSessionButton from "@/src/components/DeleteSessionButton";
import InlineRenameSession from "./InlineRenameSession";
import type { Standing } from "@/src/lib/types";

export const dynamic = "force-dynamic";

export function SessionDashboardView({
  id,
  name,
  isActive,
  participantCount,
  hands,
  standings,
}: {
  id: string;
  name: string;
  isActive: boolean;
  participantCount: number;
  hands: number;
  standings: Standing[];
}) {
  return (
    <AppShell>
      <Link href="/sessions" className="mb-3 inline-flex items-center gap-1 text-[13px] font-bold text-mj-muted">‹ Sessions</Link>
      <div className="mb-4">
  <InlineRenameSession
    sessionName={name}
    action={renameSession.bind(null, id)}
  />
</div>

      <Card className="mb-4">
        <PanelHeader>Session Overview</PanelHeader>
        <div className="flex divide-x divide-mj-line/70">
          <div className="flex-1 p-4 text-center"><div className="font-display text-3xl font-bold leading-none">{participantCount}</div><div className="mt-1 text-xs font-semibold text-mj-muted">Participants</div></div>
          <div className="flex-1 p-4 text-center"><div className="font-display text-3xl font-bold leading-none">{hands}</div><div className="mt-1 text-xs font-semibold text-mj-muted">Hands Played</div></div>
        </div>
      </Card>

      {isActive && (
        <Link href={`/sessions/${id}/record-game`}>
  <TapButton variant="danger" className="mb-4 w-full">
    <MahjongTile char="🀄" size="sm" /> Record a Hand
  </TapButton>
</Link>
      )}

      <Card className="mb-4">
        <PanelHeader>Leaderboard</PanelHeader>
        <Leaderboard rows={standings} />
      </Card>

      <div className="grid grid-cols-2 gap-3 mb-3">

  <Link href={`/sessions/${id}/history`}>
    <TapButton variant="secondary" className="w-full">
      📜 Hand History
    </TapButton>
  </Link>

  <Link href={`/sessions/${id}/players`}>
    <TapButton variant="secondary" className="w-full">
      👥 Players
    </TapButton>
  </Link>

      </div>
{isActive ? (
  <form action={endSession.bind(null, id)}>
    <TapButton
  variant="secondary"
  type="submit"
  className="w-full border-[#eccaa0] bg-[#f8efdb] text-[#8a6a2e]"
>
  End Session
</TapButton>
  </form>
) : (
  <form action={deleteSession.bind(null, id)}>
    <DeleteSessionButton />
  </form>
)}
    </AppShell>
  );
}

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
 const { data: session } = await supabase
  .from("sessions")
  .select("*")
  .eq("id", id)
  .single();
  const standings: Standing[] =
  session?.leaderboard ?? [];
  return (
  <SessionDashboardView
  id={id}
  name={session?.name ?? ""}
  isActive={!!session?.is_active}
  participantCount={
  session?.participant_count ?? 0
}

hands={
  session?.hands_played ?? 0
}
  standings={standings}
/>
);
}
