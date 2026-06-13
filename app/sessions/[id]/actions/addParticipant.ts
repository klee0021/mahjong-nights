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

  revalidatePath(`/sessions/${sessionId}`);
}