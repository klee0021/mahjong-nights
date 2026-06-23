"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/src/lib/supabase";

export async function createAndAddPlayer(
  sessionId: string,
  formData: FormData
) {
  const name = formData
    .get("name")
    ?.toString()
    .trim();

  if (!name) return;

  // Create player
  const { data: player, error } =
    await supabase
      .from("players")
      .insert({
        name,
      })
      .select()
      .single();

  if (error || !player) {
    console.error(error);
    return;
  }

  // Add to session
  const { error: sessionError } =
    await supabase
      .from("session_players")
      .insert({
        session_id: sessionId,
        player_id: player.id,
      });

  if (sessionError) {
    console.error(sessionError);
    return;
  }

const { data: session } =
  await supabase
    .from("sessions")
    .select("participant_count, leaderboard")
    .eq("id", sessionId)
    .single();

const leaderboard =
  (session?.leaderboard as any[]) ?? [];

leaderboard.push({
  name: player.name,
  points: 0,
});

leaderboard.sort(
  (a, b) => b.points - a.points
);

await supabase
  .from("sessions")
  .update({
    participant_count:
      (session?.participant_count ?? 0) + 1,
    leaderboard,
  })
  .eq("id", sessionId);

  revalidatePath("/");
  revalidatePath("/players");
  revalidatePath("/sessions");
  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath(`/sessions/${sessionId}/players`);
}