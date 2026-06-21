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

  revalidatePath("/");
  revalidatePath("/players");
  revalidatePath("/sessions");
  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath(`/sessions/${sessionId}/players`);
}