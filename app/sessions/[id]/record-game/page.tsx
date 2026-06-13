import { supabase } from "@/src/lib/supabase";
import RecordGameWizard from "./RecordGameWizard";

export default async function RecordGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: participants } =
    await supabase
      .from("session_players")
      .select(`
        player_id,
        players (
          id,
          name
        )
      `)
      .eq("session_id", id);

  return (
    <RecordGameWizard
  sessionId={id}
  participants={(participants as any) || []}
/>
  );
}