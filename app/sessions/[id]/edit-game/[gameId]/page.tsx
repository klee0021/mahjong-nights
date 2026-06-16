import { supabase } from "@/src/lib/supabase";
import RecordGameWizard from "../../record-game/RecordGameWizard";

type Props = {
  params: Promise<{
    id: string;
    gameId: string;
  }>;
};

export default async function EditGamePage({
  params,
}: Props) {
  const { id, gameId } =
    await params;

  const { data: game } =
    await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();

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

 const handPlayers =
  game?.hand_data?.participants ??
  game?.hand_data?.settlement?.map(
    (entry: any) => entry.player
  ) ??
  [];

  const gameParticipants =
    (participants ?? []).filter(
      (participant: any) =>
        handPlayers.includes(
          participant.players.name
        )
    );

  return (
    <RecordGameWizard
      sessionId={id}
      participants={
        gameParticipants as any
      }
      initialGame={game}
    />
  );
}