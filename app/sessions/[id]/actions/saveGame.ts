"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/src/lib/supabase";

type SaveGameInput = {
  sessionId: string;
  winnerId: string;
  winType: string;
  discarderId: string | null;
  flowers: number;
  kongs: number;
  score: number;
  handData: any;
};

export async function saveGame({
  sessionId,
  winnerId,
  winType,
  discarderId,
  flowers,
  kongs,
  score,
  handData,
}: SaveGameInput) {
  const { error } = await supabase
    .from("games")
    .insert({
  session_id: sessionId,
  winner_id: winnerId,
  win_type: winType,
  discarder_id: discarderId,
  flowers,
  kongs,
  score,
  hand_data: handData,
});

  if (error) {
  console.error(
    "SAVE GAME ERROR:",
    error
  );

  throw new Error(
    error.message
  );
}

  revalidatePath(`/sessions/${sessionId}`);
}