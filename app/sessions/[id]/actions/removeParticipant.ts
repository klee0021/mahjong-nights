"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/src/lib/supabase";

export async function removeParticipant(
  sessionId: string,
  playerId: string
) {
  const { error } = await supabase
    .from("session_players")
    .delete()
    .eq("session_id", sessionId)
    .eq("player_id", playerId);

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

let leaderboard =
  (session?.leaderboard as any[]) ?? [];

// Find the player's name
const { data: player } =
  await supabase
    .from("players")
    .select("name")
    .eq("id", playerId)
    .single();

// Remove them from leaderboard only if they have 0 points
if (player) {
  const entry = leaderboard.find(
    (p) => p.name === player.name
  );

  if (!entry || entry.points === 0) {
    leaderboard = leaderboard.filter(
      (p) => p.name !== player.name
    );
  }
}

await supabase
  .from("sessions")
  .update({
    participant_count: Math.max(
      0,
      (session?.participant_count ?? 0) - 1
    ),
    leaderboard,
  })
  .eq("id", sessionId);

  revalidatePath("/");
revalidatePath("/sessions");
revalidatePath(`/sessions/${sessionId}`);
}