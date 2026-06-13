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

  revalidatePath(`/sessions/${sessionId}`);
}