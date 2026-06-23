"use server";

import { revalidateTag } from "next/cache";
import { supabase } from "@/src/lib/supabase";
import type { Standing } from "@/src/lib/types";

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
  winner_name:
    handData.settlement.find(
      (e: any) => e.points > 0
    )?.player,
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

revalidateTag("home", "max");
revalidateTag("players", "max");
revalidateTag("sessions", "max");
revalidateTag(`session-${sessionId}`, "max");
revalidateTag(`history-${sessionId}`, "max");
}