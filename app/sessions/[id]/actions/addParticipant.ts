"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/src/lib/supabase";

export async function addParticipant(
  sessionId: string,
  formData: FormData
) {
  const playerId = formData.get("playerId")?.toString();

  if (!playerId) return;

  const { error } = await supabase
    .from("session_players")
    .insert({
      session_id: sessionId,
      player_id: playerId,
    });

  if (error) {
    console.error(error);
    return;
  }
const { data: session } =
  await supabase
    .from("sessions")
    .select("participant_count, leaderboard")
    .eq("id", sessionId)
    .single();

const leaderboard =
  session?.leaderboard ?? [];

const { data: player } =
  await supabase
    .from("players")
    .select("name")
    .eq("id", playerId)
    .single();

if (
  player &&
  !leaderboard.find(
    (p: any) => p.name === player.name
  )
) {
  leaderboard.push({
    name: player.name,
    points: 0,
  });
}

await supabase
  .from("sessions")
  .update({
    participant_count:
      (session?.participant_count ?? 0) + 1,
    leaderboard,
  })
  .eq("id", sessionId);

  revalidatePath("/");

revalidatePath("/sessions");

revalidatePath(`/sessions/${sessionId}`);
}